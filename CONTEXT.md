# Contexto de Desenvolvimento - AgilizAI

## 1. Visão Geral e Estado Atual

**Produto:** AgilizAI (anteriormente RockBandPay) é um sistema de Ponto de Venda (PDV) e comanda digital para restaurantes, bares e estabelecimentos similares. Ele é projetado como um monorepo single-tenant, com planos de migração para uma arquitetura SaaS multi-tenant.

**Estado Atual (Novembro de 2025):** O projeto está em um estágio de MVP (Produto Mínimo Viável) maduro e funcional. O fluxo operacional principal está completo:
-   **Cliente:** Pode ver o cardápio via QR Code, fazer pedidos e acompanhar o status em tempo real.
-   **Operação:** A cozinha recebe pedidos instantaneamente em um painel Kanban, o garçom é notificado sobre pratos prontos, e o caixa gerencia as mesas e pagamentos.
-   **Gestão:** Um dashboard fornece relatórios básicos de vendas e performance.

O desenvolvimento mais recente focou na reestruturação do projeto para um monorepo gerenciado com **Turborepo** e na correção de bugs críticos, como a cobrança de itens cancelados.

## 2. Estrutura e Tecnologias

O projeto é um monorepo com a seguinte estrutura de workspaces:

-   `backend/`: A API central que gerencia toda a lógica de negócios.
-   `admin-frontend/`: A interface web para a equipe do restaurante (caixa, gerente, cozinha).
-   `client-frontend/`: A interface web para o cliente final (acessada via QR Code).

### a. Backend

-   **Tecnologias:** Node.js, Fastify, TypeScript, Prisma (ORM), Zod (validação), `ws` (WebSockets).
-   **Banco de Dados:** PostgreSQL.
-   **Arquitetura:** Segue um padrão de camadas (Clean Architecture) para separação de responsabilidades:
    -   `src/routers/`: Define os endpoints da API, valida dados de entrada (payloads) e chama os `UseCases`.
    -   `src/usecases/`: Contém a lógica de negócio pura, orquestrando as operações e interagindo com a camada de dados.
    -   `src/repositories/`: Camada de abstração de dados, responsável por toda a comunicação com o banco de dados via Prisma.

### b. Admin Frontend

-   **Tecnologias:** React 19, Vite, TypeScript, TanStack Router (roteamento baseado em arquivos), TanStack Query (gerenciamento de estado do servidor), `shadcn/ui` (componentes) e Recharts (gráficos).
-   **Estrutura:** Organizado por rotas (`src/routes`) e componentes reutilizáveis (`src/components`). Hooks customizados (`src/hooks`) abstraem a lógica de busca de dados.

### c. Client Frontend

-   **Tecnologias:** React 19, Vite, TypeScript, TanStack Router.
-   **Estrutura:** Uma aplicação mais leve, também organizada por rotas, que se comunica com o backend para obter o cardápio e enviar/acompanhar pedidos. Utiliza um hook `useWebSocket` para atualizações em tempo real.

## 3. Como Continuar o Desenvolvimento

O projeto está estruturado e pronto para as próximas grandes evoluções.

### a. Próximo Passo Imediato: Migração para SaaS

A documentação (`ROADMAP.md`) indica que o próximo grande objetivo estratégico é transformar o AgilizAI em um produto **SaaS multi-tenant**. Isso envolve:
1.  **Atualizar o Banco de Dados:** Adicionar o conceito de `Tenant` (ou `Organization`) a todos os modelos de dados principais (`Product`, `Order`, `Table`, etc.) para garantir o isolamento de dados.
2.  **Refatorar o Backend:** Ajustar os UseCases e Repositórios para que todas as operações sejam "tenant-aware" (levem em conta o tenant do usuário autenticado).
3.  **Ajustar Autenticação:** Implementar um novo fluxo de autenticação que identifique o tenant do usuário no login.
4.  **Gerenciamento de Subdomínios/Rotas:** Decidir a estratégia de roteamento para os tenants (ex: `tenant.agilizai.app` ou `agilizai.app/tenant`).

### b. Visão Futura: O Chatbot com IA (AgilizAI)

A visão de longo prazo que definirá o futuro do produto é a implementação de um assistente de IA no `client-frontend`.

**Conceito:** Um chatbot composto por agentes especializados que atuam como um "concierge digital" para o cliente do restaurante.

**Agentes Planejados:**
-   **Especialista de Cozinha:** Sabe tudo sobre os pratos: ingredientes, modo de preparo, opções para alérgicos, etc.
-   **Especialista de Bebidas:** Conhece o cardápio de bebidas, sabe qual é a cerveja mais gelada, os drinks mais fortes, os ingredientes dos sucos, etc.
-   **Especialista de Eventos:** Informa sobre a agenda de eventos do local (shows, apresentações), horários, estilo, etc.

**Funcionalidades da IA:**
-   **Ajustar pedidos em tempo real:** "Quero essa pizza, mas sem cebola e com borda recheada."
-   **Criar combinações complexas:** "Pode ser meia calabresa, meia portuguesa?"
-   **Fazer upsell inteligente:** "Percebi que você pediu um hambúrguer. Gostaria de trocar a batata frita por onion rings por mais R$ 3,00?"
-   **Memorizar preferências:** Guardar as customizações de um cliente para facilitar pedidos futuros.
-   **Validar e Estruturar Pedidos:** Garantir que o pedido é válido e enviá-lo de forma limpa e estruturada para a cozinha, eliminando ambiguidades.

**Arquitetura da IA:**
-   As informações dos especialistas (ingredientes, eventos, etc.) seriam cadastradas pelo gerente em uma nova área do `admin-frontend`.
-   Essas informações seriam salvas em um novo conjunto de tabelas no banco de dados.
-   Ao interagir com o cliente, a LLM (Modelo de Linguagem Grande) faria uma chamada ao banco para buscar essas informações e usá-las como **contexto** para gerar respostas precisas e confiáveis.
