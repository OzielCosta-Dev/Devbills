# DevBills API

API REST para controle financeiro pessoal (receitas, despesas e categorias), construída com Fastify, Prisma e MongoDB.

## Tecnologias

- [Fastify](https://fastify.dev/) — servidor HTTP
- [Prisma ORM](https://www.prisma.io/) + MongoDB — persistência de dados
- Firebase Admin — autenticação (verificação do ID token)
- [Zod](https://zod.dev/) — validação de schemas (body, query e params)
- TypeScript

## Pré-requisitos

- Node.js 18+
- Uma instância MongoDB (local ou Atlas)

## Configuração

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Gere o client do Prisma:

   ```bash
   npx prisma generate
   ```

3. Crie um arquivo `.env` na raiz do projeto com as variáveis:

   ```env
   PORT=3001
   NODE_ENV=dev
   DATABASE_URL="mongodb+srv://usuario:senha@cluster/banco"
   CORS_ORIGIN=http://localhost:5173
   FIREBASE_PROJECT_ID=
   FIREBASE_CLIENTE_EMAIL=
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

   Veja também o arquivo `.env.example`. Se usar MongoDB Atlas, libere o seu IP em **Network Access**.

4. Inicie o servidor em modo desenvolvimento:

   ```bash
   npm run dev
   ```

   O servidor sobe em `http://localhost:3001` (ou na porta definida em `PORT`) e as rotas ficam disponíveis sob o prefixo `/api`.

## Estrutura do projeto

```
src/
├── app.ts                     # instância do Fastify
├── server.ts                  # bootstrap (conexão Prisma + start do servidor)
├── config/                    # env, conexão com o Prisma
├── controllers/
│   ├── category.controller.ts
│   └── transactions/
├── routes/                    # definição das rotas por recurso
├── schemas/                   # schemas Zod de validação
├── services/                  # regras auxiliares (ex: categorias globais)
└── types/                     # tipos TypeScript compartilhados
prisma/
└── schema.prisma              # modelos Category e Transaction
```

## Endpoints

Base URL: `/api`

Todas as rotas de `/categories` e `/transactions` exigem o header `Authorization: Bearer <ID token do Firebase>`.

### Health check

| Método | Rota      | Descrição               |
| ------ | --------- | ------------------------ |
| GET    | `/health` | Status da API             |

### Categorias (`/categories`)

| Método | Rota | Descrição              |
| ------ | ---- | ------------------------ |
| GET    | `/`  | Lista todas as categorias |

### Transações (`/transactions`)

| Método | Rota       | Descrição                                              |
| ------ | ---------- | -------------------------------------------------------- |
| POST   | `/`        | Cria uma transação                                        |
| GET    | `/`        | Lista transações (filtros opcionais: `month`, `year`, `type`, `categoryId`) |
| GET    | `/summary` | Retorna o resumo do período (`month` e `year` obrigatórios) |
| GET    | `/historical` | Totais mensais de receitas e despesas (`month`, `year`; `months` opcional, padrão 6) |
| GET    | `/:id`     | Busca uma transação pelo ID                               |
| PUT    | `/:id`     | Atualiza uma transação                                    |
| DELETE | `/:id`     | Remove uma transação                                      |

## Modelo de dados

- **Category**: `name`, `color`, `type` (`expense` \| `income`)
- **Transaction**: `description`, `amount`, `date`, `type`, `userId`, `categoryId`

## Scripts

| Comando       | Descrição                          |
| ------------- | ------------------------------------ |
| `npm run dev` | Inicia o servidor com hot reload (`tsx watch`) |
| `npm start` | Inicia o servidor sem hot reload |
| `npm run typecheck` | Checagem de tipos |
| `npm run db:push` | Sincroniza schema e índices do Prisma com o MongoDB |
| `npm run lint` | Biome (lint + formatação) |
