# AgilizAI - Customer Frontend

Esta é a aplicação frontend voltada para o cliente, projetada para ser acessada através de um QR Code na mesa do estabelecimento. Ela permite que o cliente tenha autonomia para visualizar o cardápio, fazer pedidos e acompanhar o status do seu consumo em tempo real.

## Features

- **Início de Sessão por QR Code:** A aplicação é iniciada passando o ID da mesa via query param na URL (ex: `?table=table_id`), e o sistema automaticamente cria ou recupera a sessão de consumo ativa.
- **Cardápio Digital:** Apresenta o cardápio completo do estabelecimento, agrupado por categorias.
- **Carrinho de Compras:** Permite que o cliente adicione múltiplos itens ao seu pedido antes de enviá-lo para a cozinha.
- **Acompanhamento de Pedidos em Tempo Real:** Após fazer um pedido, o cliente pode ver o status dele (`Pendente`, `Em Preparo`, etc.) sendo atualizado instantaneamente na tela.
- **Cancelamento de Pedidos:** O cliente pode cancelar um pedido que ainda esteja com o status `Pendente`.

## Tech Stack

- **Framework:** **[React](https://react.dev/)**
- **Linguagem:** **[TypeScript](https://www.typescriptlang.org/)**
- **Build Tool:** **[Vite](https://vitejs.dev/)**
- **Roteamento:** **[TanStack Router](https://tanstack.com/router/)**
- **Gerenciamento de Estado Assíncrono:** **[TanStack Query (React Query)](https://tanstack.com/query/)**
- **Estilização:** **[Tailwind CSS](https://tailwindcss.com/)** e **[Shadcn UI](https://ui.shadcn.com/)**

---

## Funcionalidade em Tempo Real

A aplicação utiliza WebSockets para criar uma experiência interativa e manter o cliente informado sobre o andamento de seus pedidos.

-   **Conexão:** Ao iniciar uma sessão, o app estabelece uma conexão WebSocket com um canal dedicado à sua sessão no backend (ex: `/ws/session/session_id`).
-   **Atualizações de Status:** O frontend escuta por mensagens como `NEW_ORDER` e `ORDER_STATUS_UPDATED`. Ao recebê-las, o estado local é atualizado para refletir imediatamente a mudança, seja adicionando um novo pedido à lista ou alterando o status de um existente.
-   **Hook Personalizado:** A lógica de conexão e gerenciamento do WebSocket é abstraída no hook `useWebSocket`, tornando o código dos componentes mais limpo e focado na apresentação.

---

## Getting Started

### Pré-requisitos

- Node.js (v18+)
- npm
- A [API do backend](<URL_DO_REPO_BACKEND>) deve estar rodando localmente.

### Instalação e Execução

1.  **Clone o repositório e instale as dependências:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd client-frontend
    npm install
    ```

2.  **Rode a aplicação em modo de desenvolvimento:**
    ```bash
    npm run dev
    ```

    A aplicação estará disponível em `http://localhost:5173`. Para simular o uso real, acesse a URL passando o ID de uma mesa existente, por exemplo: `http://localhost:5173/?table=clxyz12340001abcde12345`.