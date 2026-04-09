# Learning App

Learning platform built with Next.js, Clerk, Drizzle, Neon/Postgres, Stripe, and Mux.

## Current State

The repository is in early scaffolding stage. The architecture has been defined and the codebase has been reorganized to support feature-based growth, but most product features are not implemented yet.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Clerk
- Drizzle ORM
- Neon / PostgreSQL
- Stripe
- Mux

## Project Documents

- [Architecture](./ARCHITECTURE.md)
- [Branch Protection](./BRANCH_PROTECTION.md)

## Repository Structure

```text
app/
components/
db/
features/
lib/
server/
public/
```

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Available Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Notes

- `db/schema.ts` re-exports the split schema modules under `db/schema/`.
- The current homepage is still the default starter page and should be replaced as feature work begins.
- Production builds currently depend on fetching Google-hosted fonts from `next/font/google`.

## Next Steps

- implement initial Drizzle schema
- add validated environment handling
- build course, chapter, enrollment, and progress features
- add CI so `lint` and `build` can become required branch checks
