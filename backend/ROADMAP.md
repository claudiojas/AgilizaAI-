# Roadmap de Desenvolvimento - AgilizAI

Este documento descreve as fases de desenvolvimento do sistema AgilizAI, desde a sua concepção como um MVP de instância única até a sua evolução para uma plataforma SaaS multi-tenant.

---

## Fase 1: Base do Backend (MVP Inicial - Concluído)

O objetivo desta fase foi construir o alicerce da API, com um ambiente de desenvolvimento funcional e as operações CRUD básicas para as entidades principais do sistema.

---

## Fase 2: Lógica de Negócio Essencial (MVP Inicial - Concluído)

O foco desta fase foi implementar a lógica de negócio principal que torna o sistema funcional para um cenário real de bar/restaurante, incluindo o gerenciamento de caixa, fechamento de conta, e as funcionalidades de exclusão de pedidos e desativação de mesas para flexibilidade operacional.

---

## Fase 3: Expansão para Cozinha e Garçom (Concluído)

**Visão:** Evoluir o sistema para suportar um fluxo de trabalho completo, desde o pedido até a entrega, envolvendo a cozinha e os garçons.

**Arquitetura de Backend:** A principal mudança foi a introdução de um sistema de status para os pedidos e a comunicação em tempo real para notificar a cozinha.

### Itens Desenvolvidos:

1.  **Implementada Comunicação em Tempo Real (WebSockets):
    **
    *   **Status:** Concluído.
    *   **Ação:** O endpoint `/ws/kitchen` foi implementado para permitir que o painel da cozinha receba notificações de novos pedidos instantaneamente.

2.  **Sistema de Status de Pedido:
    **
    *   **Status:** Concluído.
    *   **Ação:** O modelo `Order` agora possui um campo `status` (com os estados `PENDING`, `PREPARING`, `READY`, `DELIVERED`, etc.).
    *   Foi criado o endpoint `PATCH /orders/:id/status` para permitir a transição entre os status.

3.  **Melhorias nos Endpoints de Consulta:
    **
    *   **Status:** Concluído.
    *   **Ação:** O endpoint `GET /orders` agora suporta filtragem por status (ex: `?status=READY`), permitindo que diferentes painéis (cozinha, garçom) busquem apenas os pedidos que lhes interessam.

4.  **Gerenciamento de Produtos e Estoque:
    **
    *   **Status:** Concluído.
    *   **Ação:** Foram criados endpoints para edição de produtos (`PATCH /products/:id`) e para adição de estoque (`PATCH /products/:id/add-stock`), dando flexibilidade total ao gerente.

---

## Fase 4: Transição para Arquitetura SaaS Multi-Tenant

**Visão:** Transformar o AgilizAI (já com as funcionalidades de garçom automatizado) em uma plataforma SaaS (Software as a Service), onde múltiplos clientes (tenants) possam usar a mesma aplicação de forma segura e isolada.

**Arquitetura Escolhida:** **Banco de Dados por Tenant.**

*Esta fase mantém os mesmos itens de desenvolvimento descritos anteriormente (criação de banco de dados mestre, lógica multi-tenant, provisionamento), mas será executada após a conclusão da Fase 3.*

---

## Fase 6: Implementação de Autenticação (Concluído)

**Visão:** Proteger o painel administrativo para garantir que apenas usuários autorizados possam acessar e gerenciar os dados do restaurante.

### Itens Desenvolvidos:

1.  **Modelo de Usuário:**
    *   **Status:** Concluído.
    *   **Ação:** Adicionado o modelo `User` ao schema do Prisma, com campos para email, senha (criptografada) e nível de acesso (`role`).

2.  **Autenticação com JWT:**
    *   **Status:** Concluído.
    *   **Ação:** Implementadas as rotas `/auth/login`, `/auth/logout` e `/auth/me`. O login gera um token JWT que é armazenado em um cookie `HttpOnly` no navegador.

3.  **Proteção de Rotas:**
    *   **Status:** Concluído.
    *   **Ação:** Um hook global foi implementado para proteger todas as rotas da API, exceto as de autenticação, garantindo que apenas requisições com um token JWT válido sejam processadas.

---

## Fase 5: Relatórios e Integrações (Em Andamento)

Esta fase foca em agregar valor ao negócio através da análise de dados e da integração com serviços externos.

1.  **Criar Endpoints de Relatórios (Concluído):
    **
    *   `GET /reports/sales-by-table`: Para analisar vendas por mesa.
    *   `GET /reports/sales-by-payment-method`: Para analisar vendas por forma de pagamento.
    *   `GET /reports/product-performance`: Para listar os produtos mais vendidos.
    *   `GET /reports/sales-over-time`: Para analisar o faturamento ao longo de um período.

2.  **Integrar com Gateways de Pagamento Reais (Fluxo Ideal):**
    *   O objetivo é automatizar o processo de pagamento com PIX e Cartão, utilizando webhooks para confirmação automática, tanto no fluxo do operador quanto no autoatendimento do cliente.