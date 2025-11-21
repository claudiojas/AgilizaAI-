# Guia Técnico Interno: RockBandPay API

Este documento detalha a arquitetura, os padrões de projeto e os fluxos de negócio críticos do backend do RockBandPay. O objetivo é servir como um guia para desenvolvedores que trabalham na manutenção e evolução do sistema.

---

## 1. Arquitetura e Padrões

O código-fonte (`src/`) é estruturado em uma arquitetura de camadas para promover a separação de responsabilidades e a testabilidade.

**`Router` -> `UseCase` -> `Repository`**

1.  **`routers/`**: A camada de entrada da aplicação. É responsável por:
    -   Definir os endpoints HTTP (rotas).
    -   Validar e sanitizar os dados da requisição (usando `zod`).
    -   Orquestrar o fluxo da requisição, chamando a camada de `UseCase`.
    -   Formatar e enviar a resposta HTTP.

2.  **`usecases/`**: O coração da aplicação. Contém toda a lógica de negócio.
    -   Não conhece nada sobre HTTP (Fastify, `request`, `reply`).
    -   Recebe dados puros, executa as regras de negócio e orquestra as operações com os repositórios.
    -   É responsável por interações complexas, como transações de banco de dados que envolvem múltiplos modelos.

3.  **`repositories/`**: A camada de acesso a dados. É a única parte do sistema que interage diretamente com o banco de dados.
    -   Abstrai toda a lógica do Prisma ORM.
    -   Expõe métodos claros e com propósito de negócio (ex: `findOrdersByStatus`, `createOrder`).

---

## 2. Implementação de WebSocket

A comunicação em tempo real é um pilar do sistema. A implementação foi refatorada para garantir estabilidade e performance.

-   **Motivo da Mudança:** A implementação original com `@fastify/websocket` apresentava instabilidade, causando quedas silenciosas do servidor. A solução foi adotar a biblioteca `ws`, uma das mais robustas e utilizadas do ecossistema Node.js.

-   **Inicialização:** O servidor WebSocket é inicializado em `src/app.ts` e acoplado ao servidor HTTP do Fastify. A instância do servidor `ws` é então passada para o `WebSocketRouter` para que ele possa gerenciar as conexões.

-   **Gerenciamento de Conexões (`WebSocketRouter.ts`):**
    -   Este router é o ponto de entrada para todas as conexões WebSocket (`/ws/...`).
    -   Ele inspeciona a URL da requisição para determinar o "canal" da conexão (ex: `/ws/kitchen` ou `/ws/session/some-id`).
    -   A conexão é então registrada no `NotificationHub` dentro do canal apropriado.

-   **`NotificationHub`:**
    -   É um singleton (`src/utils/NotificationHub.ts`) que atua como um hub central de mensagens.
    -   Ele mantém um registro de todas as conexões ativas em seus respectivos canais.
    -   Expõe métodos simples como `broadcastToKitchen(message)` e `broadcastToSession(sessionId, message)`, permitindo que qualquer parte da aplicação (Use Cases, Routers) envie notificações de forma desacoplada e sem precisar gerenciar clientes WebSocket diretamente.

---

## 3. Fluxos de Negócio Críticos

Compreender estes fluxos é essencial para dar manutenção no sistema.

### Buscando Pedidos para a Cozinha

-   **Endpoint:** `GET /orders?status=...`
-   **Fluxo:** `OrderRoutes` -> `OrderUseCases.getAllOrders` -> `OrderRepository.findOrdersByStatus`
-   **Lógica Chave:** Dentro do `OrderRepository`, a consulta ao banco de dados foi corrigida para incluir um filtro crucial:

    ```prisma
    // Apenas pedidos de sessões ATIVAS são retornados
    where: {
        status: orderStatus,
        session: {
            status: 'ACTIVE'
        }
    }
    ```
    -   **Motivo:** Isso impede que a cozinha carregue pedidos de contas que já foram pagas e fechadas, resolvendo o bug de "pedidos fantasmas" na tela.

### Fechando uma Sessão (Pagamento de Conta)

-   **Endpoint:** `PATCH /sessions/:id/close`
-   **Fluxo:** `SessionRoutes` -> `SessionUseCases.closeSession` -> `SessionRepository.closeSession`
-   **Lógica Chave:** Após a confirmação de que a sessão foi fechada com sucesso no banco de dados, a própria rota no `SessionRouter.ts` chama o `NotificationHub`:

    ```typescript
    // Dentro do handler da rota, após o sucesso do UseCase
    notificationHub.broadcastToKitchen({
        type: 'SESSION_CLOSED',
        payload: { sessionId: session.id }
    });
    ```
    -   **Motivo:** Isso garante que a notificação seja enviada de forma confiável. O frontend da cozinha ouve essa mensagem e usa o `sessionId` para remover da tela, em tempo real, todos os pedidos pertencentes à sessão recém-encerrada.