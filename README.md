# SS Module

Ask questions. Get answers.

## Apps

| App           | Description                                | Port |
| ------------- | ------------------------------------------ | ---- |
| `app-api`     | Express REST API + SSE streaming           | 8080 |
| `app-webapp`  | React SPA — authenticated user experience  | 3000 |
| `app-website` | Next.js public site — browse community Q&A | 3001 |

## Stack

- **Runtime** — Bun
- **API** — Express, Prisma, PostgreSQL (Supabase)
- **AI** — OpenRouter (LLM streaming) + Tavily (web image search)
- **Auth** — Google OAuth, JWT via cookie
- **Frontend** — React + Vite (webapp), Next.js (website), Tailwind CSS

## Getting Started

```bash
cp .env-example .env   # fill in all values
bun install
bun run dev            # starts all apps via Turborepo
```

To run a single app:

```bash
bun run api      # app-api only
bun run webapp   # app-webapp only
bun run website  # app-website only
```

## Environment

See `.env-example` for all required variables. Key ones:

## Database

```bash
cd app-api
bun run migrate   # run migrations
bun run generate  # regenerate Prisma client
bun run studio    # open Prisma Studio
```
