# AgilizAI API

# AgilizAI API

API backend para o sistema de comanda digital AgilizAI. Construída para ser rápida, escalável e fácil de manter, esta API gerencia todas as operações do sistema, desde o controle de mesas e sessões de consumo até o processamento de pedidos e notificações em tempo real para a cozinha.

## Features

- **Gerenciamento de Sessões por QR Code:** Clientes iniciam e gerenciam seu consumo através de sessões vinculadas a mesas.
- **Cardápio Digital:** Gerenciamento completo de produtos e categorias.
- **Controle de Estoque:** Validação de estoque em tempo real durante a criação de pedidos.
- **Painel da Cozinha em Tempo Real:** Notifica a cozinha instantaneamente sobre novos pedidos e atualizações de status via WebSockets.
- **Fluxo de Caixa:** Abertura e fechamento de caixa para registro de transações.
- **Dashboard e Relatórios:** Endpoints otimizados para fornecer dados para painéis de visualização e relatórios de vendas.
- **Exclusão Lógica (Soft Delete):** Itens como mesas são desativados em vez de excluídos para manter a integridade do histórico.

## Tech Stack

- **Framework:** **[Fastify](https://www.fastify.io/)** - Alta performance e baixo overhead.
- **Linguagem:** **[TypeScript](https://www.typescriptlang.org/)** - Código seguro e escalável com tipagem estática.
- **ORM:** **[Prisma](https://www.prisma.io/)** - ORM moderno que garante interações com o banco de dados totalmente tipadas.
- **WebSockets:** **[ws](https://github.com/websockets/ws)** - Biblioteca de WebSocket robusta e performática, integrada diretamente ao servidor HTTP do Fastify.
- **Banco de Dados:** **[PostgreSQL](https://www.postgresql.org/)** - Sistema de banco de dados relacional open-source.
- **Testes:** **[Vitest](https://vitest.dev/)** - Executor de testes rápido com API compatível com Jest.
- **Ambiente de Desenvolvimento:** **[Docker](https://www.docker.com/)** e **[tsx](https://github.com/esbuild-kit/tsx)** - Para um ambiente de banco de dados consistente e hot-reloading eficiente.

---

## Getting Started

Siga as instruções abaixo para configurar e executar o projeto localmente.

### Pré-requisitos

- Node.js (v18+)
- npm
- Git
- Docker

### 1. Instalação

Clone o repositório e instale as dependências:
```bash
git clone <URL_DO_REPOSITORIO>
cd rockbandpay-api
npm install
```

### 2. Configuração de Ambiente

1.  Crie um arquivo chamado `.env` na raiz do projeto.
2.  Copie o conteúdo do exemplo abaixo para o seu arquivo `.env` e substitua os valores conforme necessário.

    ```env
    # .env.example
    DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DB_NAME?schema=public"
    ```

### 3. Banco de Dados

Com o Docker em execução, suba o container do PostgreSQL:
```bash
docker-compose up -d
```

Após o container estar no ar, aplique as migrações do Prisma para criar as tabelas:
```bash
npx prisma migrate dev
```

### 4. Rodando a Aplicação

Para iniciar o servidor em modo de desenvolvimento com hot-reloading:
```bash
npm run dev
```
O servidor estará disponível em `http://localhost:3000`.

---

## Arquitetura do Projeto

O código-fonte em `src/` é organizado seguindo uma arquitetura de camadas para separação de responsabilidades:

-   **`routers/`**: Define os endpoints da API, valida os dados de entrada e chama os `UseCases` correspondentes.
-   **`usecases/`**: Contém a lógica de negócio central da aplicação. Orquestra as operações e interage com os `Repositories`.
-   **`repositories/`**: Camada de acesso a dados. É responsável por toda a comunicação com o banco de dados através do Prisma.
-   **`interfaces/`**: Define os tipos e contratos de dados usados em toda a aplicação.
-   **`utils/`**: Contém utilitários, como o `NotificationHub` para WebSockets.

## Arquitetura de Tempo Real (WebSockets)

O sistema utiliza WebSockets para comunicação em tempo real, essencial para a agilidade do painel da cozinha e do cliente.

-   **Implementação:** A API usa a biblioteca `ws` para criar um servidor WebSocket que é acoplado diretamente ao servidor HTTP do Fastify. Essa abordagem garante estabilidade e performance.
-   **Gerenciamento de Conexões:** O arquivo `src/routers/WebSocketRouter.ts` é responsável por gerenciar as conexões. Ele identifica o tipo de cliente (cozinha ou sessão de cliente) com base na URL da conexão e o adiciona ao canal apropriado.
-   **Canais:**
    -   `/ws/kitchen`: Canal para todos os clientes do painel da cozinha.
    -   `/ws/session/:sessionId`: Canal dedicado para cada sessão de cliente individual.
-   **`NotificationHub`:** É um utilitário singleton (`src/utils/NotificationHub.ts`) que abstrai a lógica de broadcast. Ele permite que qualquer parte da aplicação (Use Cases, Routers) envie mensagens para os canais de forma simples e desacoplada.
-   **Principais Mensagens:**
    -   `NEW_ORDER`: Enviada para a cozinha e para o cliente quando um novo pedido é criado.
    -   `ORDER_STATUS_UPDATED`: Enviada para a cozinha e para o cliente quando o status de um pedido muda.
    -   `SESSION_CLOSED`: Enviada para a cozinha quando uma sessão é fechada (conta paga), para que os pedidos daquela sessão sejam removidos da tela.

## API Endpoints

Abaixo, uma visão geral dos principais endpoints disponíveis.

-   **Caixa:** `POST /cash-register/open`, `POST /cash-register/close`
-   **Mesas:** `POST /tables`, `GET /tables`
-   **Sessões:** `POST /sessions`, `GET /sessions/table/:tableId/active`, `PATCH /sessions/:id/close`
-   **Produtos e Categorias:** `POST /products`, `GET /products`, `POST /categories`, `GET /categories`
-   **Pedidos:** `POST /orders`, `GET /orders`, `GET /orders/session/:sessionId`, `PATCH /orders/:id/status`
-   **Pagamentos:** `POST /payments/close-bill`
-   **Relatórios:** `GET /reports/sales-by-table`, `GET /reports/product-performance`, etc.
