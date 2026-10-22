# FirstByte project

<!-- TODO: Replace the line below with one sentence about what this project is. -->

A FirstByte web project made from firstbyte-template.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Vitest, pnpm.
Deployed on Vercel.

## Commands

```
pnpm dev           # run the app at http://localhost:3000
pnpm test          # run the tests
pnpm lint          # check the code
pnpm typecheck     # check the types
pnpm format        # fix formatting
pnpm build         # production build (CI runs this too)
```

## Where things go

- `src/app/` pages and routes. A folder is a URL: `src/app/about/page.tsx` is `/about`.
- `src/components/ui/` shadcn components. Add more with `pnpm dlx shadcn@latest add <name>`. Don't hand-edit them unless you have to.
- `src/components/` our own components.
- `src/lib/` helpers that are not components.
- Tests sit next to the file they test: `thing.ts` and `thing.test.ts`.

## Rules

- Use pnpm, never npm or yarn.
- Never read or edit `.env` files. To add a variable, add it to `.env.example` with a fake value and tell the person what to put in their `.env.local`.
- Follow the existing code. Before adding a new library, ask first.
- Explain your changes in simple English. We're learning: say what you changed, why, and how to check it works.
- Before saying a change is done, run `pnpm lint`, `pnpm typecheck` and `pnpm test`.

@AGENTS.md
