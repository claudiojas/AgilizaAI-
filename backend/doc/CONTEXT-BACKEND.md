# Guia Técnico Interno: AgilizAI API

Este documento detalha a arquitetura, os padrões de projeto e os fluxos de negócio críticos do backend do AgilizAI. O objetivo é servir como um guia para desenvolvedores que trabalham na manutenção e evolução do sistema.

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

## 4. Fluxo de Autenticação com JWT e Cookies HttpOnly

A segurança do painel administrativo é garantida por um robusto sistema de autenticação baseado em JSON Web Tokens (JWT) e cookies `HttpOnly`.

-   **Processo de Login:**
    1.  O cliente envia credenciais (email e senha) para `POST /auth/login`.
    2.  O Fastify verifica as credenciais. Se válidas, um JWT é gerado usando `@fastify/jwt`.
    3.  Este JWT é então assinado e enviado ao cliente como um cookie `HttpOnly` (`access_token`). Este tipo de cookie é inacessível via JavaScript no navegador, prevenindo ataques de Cross-Site Scripting (XSS).
    4.  O cookie é configurado com `SameSite: 'Lax'` e `Secure: true` (em produção) para aumentar a segurança contra ataques de Cross-Site Request Forgery (CSRF).

-   **Verificação de Autenticação (`GET /auth/me`):**
    1.  O frontend pode chamar `GET /auth/me` para verificar se existe uma sessão ativa.
    2.  O navegador envia automaticamente o cookie `access_token` para o backend (devido à configuração do cookie).
    3.  A rota `/auth/me` utiliza um hook `onRequest` para chamar `request.jwtVerify()`. Este método, provido pelo `@fastify/jwt`, verifica o token no cookie.
    4.  Se o token for válido e não expirado, o `request.user` é populado com o payload do JWT, e os dados do usuário podem ser retornados ao frontend.

-   **Proteção de Rotas:**
    1.  Todas as rotas que exigem autenticação são registradas em um bloco `app.register` que possui um hook `onRequest` que executa `await request.jwtVerify()`.
    2.  Se o JWT for inválido ou não estiver presente (no cookie), o `request.jwtVerify()` lançará um erro, resultando em uma resposta `401 Unauthorized` para o cliente.
    3.  Isso garante que apenas usuários com tokens válidos (e, portanto, logados) possam acessar funcionalidades restritas.

-   **Logout (`POST /auth/logout`):**
    1.  Ao fazer logout, o cliente envia uma requisição para `POST /auth/logout`.
    2.  O backend simplesmente limpa o cookie `access_token` no navegador, invalidando a sessão do usuário.

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