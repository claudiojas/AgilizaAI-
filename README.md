# AgilizAI - Monorepo

Sistema completo de comanda digital para restaurantes e bares, construído como monorepo com Turbo.

## 📦 Estrutura do Projeto

```
agilizai-monorepo/
├── backend/              # API Backend (Fastify + Prisma + PostgreSQL)
├── agilizai-admin/       # Painel Administrativo (React + Vite)
├── agilizai-order/       # Aplicação do Cliente (React + Vite)
└── package.json          # Configuração do monorepo
```

## 🚀 Tecnologias

### Backend
- **Fastify** - Framework web rápido
- **Prisma** - ORM para PostgreSQL
- **TypeScript** - Tipagem estática
- **WebSockets (ws)** - Comunicação em tempo real
- **Zod** - Validação de schemas

### Frontend (Admin & Order)
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **React Router** - Roteamento
- **TanStack Query** - Gerenciamento de estado servidor
- **shadcn/ui** - Componentes UI
- **Tailwind CSS** - Estilização
- **Axios** - Cliente HTTP

### Ferramentas
- **Turbo** - Build system para monorepos
- **npm workspaces** - Gerenciamento de dependências

## 📋 Pré-requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker (para PostgreSQL)

## 🛠️ Instalação

1. **Clone o repositório:**
```bash
git clone <repository-url>
cd AgilizaAI-
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**

   **Backend:**
   ```bash
   cd backend
   cp .env.example .env
   # Edite o .env com suas configurações
   ```

   **Admin:**
   ```bash
   cd agilizai-admin
   cp .env.example .env
   # Edite o .env se necessário
   ```

   **Order:**
   ```bash
   cd agilizai-order
   cp .env.example .env
   # Edite o .env se necessário
   ```

4. **Configure o banco de dados:**
```bash
cd backend
docker-compose up -d
npx prisma migrate dev
npx prisma generate
```

## 🎯 Scripts Disponíveis

### Na raiz do projeto:

```bash
# Desenvolver todos os projetos em paralelo
npm run dev

# Desenvolver apenas o backend
npm run backend:dev

# Desenvolver apenas o admin
npm run admin:dev

# Desenvolver apenas o order
npm run order:dev

# Build de todos os projetos
npm run build

# Lint de todos os projetos
npm run lint

# Limpar node_modules e dist
npm run clean
```

### Scripts individuais:

**Backend:**
```bash
cd backend
npm run dev          # Inicia servidor em desenvolvimento
npm run build        # Compila TypeScript
npm run test         # Executa testes
npm run db:migrate   # Executa migrações
npm run db:seed      # Popula banco com dados iniciais
```

**Admin:**
```bash
cd agilizai-admin
npm run dev          # Inicia dev server na porta 3001
npm run build        # Build para produção
npm run preview      # Preview do build
```

**Order:**
```bash
cd agilizai-order
npm run dev          # Inicia dev server na porta 3002
npm run build        # Build para produção
npm run preview      # Preview do build
```

## 🌐 Portas

- **Backend API:** `http://localhost:3000`
- **Admin Frontend:** `http://localhost:3001`
- **Order Frontend:** `http://localhost:3002`
- **PostgreSQL:** `localhost:5482`

## 📁 Estrutura Detalhada

### Backend (`/backend`)
- `src/routers/` - Endpoints da API
- `src/usecases/` - Lógica de negócio
- `src/repositories/` - Acesso a dados
- `src/interfaces/` - Tipos TypeScript
- `prisma/` - Schema e migrações do banco

### Admin (`/agilizai-admin`)
- `src/pages/` - Páginas (Dashboard, Kitchen, Tables)
- `src/components/` - Componentes React
- `src/services/` - Serviços de API
- `src/hooks/` - Hooks customizados

### Order (`/agilizai-order`)
- `src/pages/` - Páginas (Menu, Cart, Orders, Bill)
- `src/components/` - Componentes React mobile-first
- `src/services/` - Serviços de API
- `src/contexts/` - Contextos React (Session, Cart)

## 🔌 Integração Frontend-Backend

### Variáveis de Ambiente

**Admin e Order:**
```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

**Backend:**
```env
DATABASE_URL=postgresql://user:password@localhost:5482/dbname
PORT=3000
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=agilizai_db
```

## 🧪 Desenvolvimento

1. **Inicie o banco de dados:**
```bash
cd backend
docker-compose up -d
```

2. **Execute migrações:**
```bash
cd backend
npm run db:migrate
```

3. **Inicie todos os serviços:**
```bash
# Na raiz do projeto
npm run dev
```

Isso iniciará:
- Backend na porta 3000
- Admin na porta 3001
- Order na porta 3002

## 📝 Notas Importantes

- O monorepo usa **npm workspaces** para gerenciar dependências
- **Turbo** é usado para cache e execução paralela de tarefas
- Cada projeto pode ser executado independentemente
- As variáveis de ambiente devem ser configuradas em cada projeto

## 🤝 Contribuindo

1. Crie uma branch para sua feature
2. Faça suas alterações
3. Teste localmente
4. Abra um Pull Request

## 📄 Licença

ISC

