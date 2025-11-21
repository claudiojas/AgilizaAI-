# RockBandPay - Admin & Kitchen Frontend

Esta é a aplicação frontend para a equipe do estabelecimento, servindo como a interface principal para gerenciamento e operações do sistema RockBandPay.

## Features

- **Dashboard de Vendas:** Visualização de relatórios de faturamento, vendas por mesa, performance de produtos e mais.
- **Painel da Cozinha em Tempo Real:** Uma visão kanban (`A Fazer`, `Em Preparo`) que atualiza instantaneamente com novos pedidos e mudanças de status, graças à comunicação via WebSockets.
- **Gerenciamento de Pedidos:** Permite que a equipe da cozinha atualize o status de um pedido (ex: de `PENDING` para `PREPARING`).
- **Gerenciamento de Mesas:** Ferramentas para criar e visualizar as mesas e seus respectivos QR Codes.
- **Gerenciamento de Produtos:** Interface para adicionar novos produtos e categorias ao cardápio.
- **Fluxo de Caixa:** Funcionalidades para abrir e fechar o caixa do dia.

## Tech Stack

- **Framework:** **[React](https://react.dev/)**
- **Linguagem:** **[TypeScript](https://www.typescriptlang.org/)**
- **Build Tool:** **[Vite](https://vitejs.dev/)**
- **Roteamento:** **[TanStack Router](https://tanstack.com/router/)** - Roteador moderno e totalmente tipado.
- **Gerenciamento de Estado Assíncrono:** **[TanStack Query (React Query)](https://tanstack.com/query/)** - Para fetching, caching e atualização de dados do servidor.
- **Estilização:** **[Tailwind CSS](https://tailwindcss.com/)** e **[Shadcn UI](https://ui.shadcn.com/)** - Para uma UI moderna e componentizada.

---

## Funcionalidade em Tempo Real

A aplicação se conecta ao backend via WebSockets para receber atualizações em tempo real, criando uma experiência de usuário fluida e reativa, especialmente no painel da cozinha.

-   **Conexão:** O app estabelece uma conexão com o canal `/ws/kitchen` do backend.
-   **Gerenciamento de Estado:** O `React Query` é usado para gerenciar os dados dos pedidos. Quando uma mensagem de WebSocket é recebida (ex: `NEW_ORDER`, `SESSION_CLOSED`), em vez de apenas recarregar os dados, a aplicação utiliza as APIs do React Query (`invalidateQueries` ou `setQueryData`) para atualizar o cache local de forma inteligente e eficiente, garantindo que a UI reflita o estado mais recente com o mínimo de latência.

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
    cd admin-frontend
    npm install
    ```

2.  **Rode a aplicação em modo de desenvolvimento:**
    ```bash
    npm run dev
    ```

    A aplicação estará disponível em `http://localhost:5174` e se conectará automaticamente à API do backend em `localhost:3000`.