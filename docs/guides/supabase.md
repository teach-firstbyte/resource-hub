# Adding Supabase

[Supabase](https://supabase.com) gives you a Postgres database, login, and file
storage. It's what FirstByte workshops teach. This guide adds it to a project
made from the template, using the same setup as the FirstByte dashboard.

You'll end up with three databases:

| Where      | Database                             | Who changes it                    |
| ---------- | ------------------------------------ | --------------------------------- |
| Local      | Supabase in Docker on your computer  | You, as much as you like          |
| Preview    | A Supabase project for pull requests | CI, when a PR changes a migration |
| Production | The real Supabase project            | CI, after a lead approves         |

**Nobody changes the production database by hand.** Changes go in migration
files, get reviewed in a pull request, and CI applies them.

Parts 1-4 are for whoever adds Supabase to the project. Part 5 is for leads.

## Words used here

- **Migration:** a SQL file that changes the database, for example "create the
  resources table". Migrations live in `supabase/migrations/` and run in
  order. You never edit one after it has merged. Make a new one instead.
- **Seed:** fake data for local and preview databases (`supabase/seed.sql`).
- **Publishable key:** a key that is safe to send to the browser. Your
  database's row level security rules decide what it can do.
- **Secret key:** a key that skips every security rule. Server only, never
  in a `NEXT_PUBLIC_` variable, never committed.

## 1. Run Supabase on your computer

You need [Docker Desktop](https://www.docker.com/products/docker-desktop/)
installed and running.

```bash
pnpm add -D supabase
```

pnpm blocks install scripts unless you allow them, and the Supabase CLI needs
one to download itself. Add it to `pnpm-workspace.yaml`:

```yaml
allowBuilds:
  sharp: false
  supabase: true
  unrs-resolver: false
```

Then run `pnpm install` again, and:

```bash
pnpm supabase init     # makes the supabase/ folder. Commit it.
pnpm supabase start    # starts the local database in Docker (slow the first time)
pnpm supabase status   # shows the local URL and keys
```

Open the local dashboard (Studio) at the "Studio URL" that `status` prints.

## 2. Connect the app

```bash
pnpm add @supabase/supabase-js @supabase/ssr
```

Add these to `.env.example` (fake values) and to your `.env.local` (values
from `pnpm supabase status`: "API URL" and "Publishable key"):

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
```

Make three files.

`src/lib/supabase/server.ts`: for server components, server actions and
route handlers.

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set({ name, value, ...options });
            });
          } catch {
            // Runs during page render, where cookie writes aren't allowed.
            // Safe to ignore: src/proxy.ts already refreshed the session.
          }
        },
      },
    },
  );
}
```

`src/lib/supabase/client.ts`: for client components (`"use client"`).

```ts
import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);
```

`src/proxy.ts`: runs before every page and keeps people logged in. (Next.js
16 renamed `middleware.ts` to `proxy.ts`.)

```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refreshes the login session if it has expired.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

Add the two variables to the `pnpm build` step in `.github/workflows/ci.yml`
as placeholders, so CI can build without real secrets:

```yaml
- run: pnpm build
  env:
    NEXT_PUBLIC_SUPABASE_URL: https://placeholder.supabase.co
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: sb_publishable_placeholder
```

## 3. Change the database with migrations

```bash
pnpm supabase migration new create_resources   # makes an empty SQL file
```

Write your SQL in the new file under `supabase/migrations/`. **Turn on row
level security on every table** and add policies, or the publishable key can
read and change everything:

```sql
create table public.resources (
  id bigint generated always as identity primary key,
  title text not null,
  url text not null,
  created_at timestamptz not null default now()
);

alter table public.resources enable row level security;

create policy "Logged-in members can read resources"
  on public.resources for select
  to authenticated
  using (true);
```

Then apply it locally, with your seed data:

```bash
pnpm supabase db reset   # wipes the LOCAL database, runs every migration, then seed.sql
```

Make TypeScript types from your tables, so your editor knows every column:

```bash
pnpm supabase gen types typescript --local > src/lib/supabase/database.types.ts
```

Add it as a script in `package.json` so people don't need to remember it:
`"db:types": "supabase gen types typescript --local > src/lib/supabase/database.types.ts"`.
Run it after every migration and commit the result.

Then, in a server component:

```ts
import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();
const { data: resources, error } = await supabase.from("resources").select();
```

## 4. Login

Supabase has email, magic link, and Google login. Follow Supabase's guide:
[Server-side auth for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs).

Two rules:

- **Check who's logged in on the server, in every page and server action that
  needs it.** Hiding a button isn't security. Use `supabase.auth.getUser()` in
  `src/lib/supabase/server.ts` code, not `getSession()`.
- **Previews:** Google login needs every preview URL added to its allowed list,
  which doesn't work for per-PR links. The dashboard turns Google login off on
  previews and adds test accounts to the preview database's seed instead.

## 5. Preview and production databases (leads)

### Make the projects

- [ ] In Supabase, make **two** projects (Free plan): `<project>` (production)
      and `<project>-preview`.
- [ ] In each, go to **Authentication → URL Configuration** and set the Site
      URL (the production domain, or the Vercel preview URL pattern).
- [ ] In Vercel, add `NEXT_PUBLIC_SUPABASE_URL` and
      `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` twice: production values for the
      **Production** environment, preview values for **Preview**.

### GitHub environments

In the repo, go to **Settings → Environments**:

- [ ] **Production database**: add a **Required reviewer** (a lead), and a
      secret `DATABASE_URL`.
- [ ] **Preview database**: no reviewer, and a secret `DATABASE_URL`.

For `DATABASE_URL`, use the **Session pooler** connection string (Supabase:
**Connect → Session pooler**, port 5432). GitHub's runners have no IPv6, so
the direct `db.<ref>.supabase.co` address doesn't work from CI.

### Migration workflows

`.github/workflows/migrate.yml`: applies migrations to production after a
merge, once a lead approves.

```yaml
name: Database migrations

# Applies new files in supabase/migrations/ to the PRODUCTION database.
# `supabase db push` only runs migrations that haven't run yet. It never
# resets data. A lead must approve each run (the "Production database"
# environment has a required reviewer).
on:
  push:
    branches: [main]
    paths: ["supabase/migrations/**"]
  workflow_dispatch:

permissions:
  contents: read

jobs:
  migrate:
    runs-on: ubuntu-latest
    environment: Production database
    # Never run two at once, and never cancel one halfway.
    concurrency:
      group: migrate-production
      cancel-in-progress: false
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
      - name: Apply migrations
        run: supabase db push --db-url "$DATABASE_URL"
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

`.github/workflows/migrate-preview.yml`: the same, but on pull requests, to
the preview database, with no approval step. Copy `migrate.yml` and change:

```yaml
on:
  pull_request:
    paths: ["supabase/migrations/**"]
  workflow_dispatch:
    # ...
    # Pull requests from forks get no secrets.
    if: github.event_name == 'workflow_dispatch' || github.event.pull_request.head.repo.full_name == github.repository
    environment: Preview database
    concurrency:
      group: migrate-preview
      cancel-in-progress: false
```

All pull requests share one preview database. A migration from a pull request
that never merges stays in it. If the preview database gets messy, a lead can
wipe it and rebuild it from the migrations and seed:

```bash
pnpm supabase db reset --db-url "<the PREVIEW session pooler string>"
```

Read the URL twice before you press Enter. Run against production, this
deletes all real data.

### Keep the database awake

Supabase pauses Free plan projects after about a week with little database
activity, which takes the site offline until someone clicks **Resume**. This
happens most over breaks. A small daily query usually prevents it.

- [ ] In the production project's SQL editor, make a role that can log in but
      can't read any table:

  ```sql
  create role keepalive login password '<a long random password>';
  ```

- [ ] Add a **repository** secret (**Settings → Secrets and variables →
      Actions**) called `KEEPALIVE_DATABASE_URL`: the Session pooler string
      with the user `keepalive.<project-ref>` and that password. It's a
      repository secret, not an environment one, so it doesn't wait for a
      reviewer every day.
- [ ] Add `.github/workflows/keep-database-awake.yml`:

  ```yaml
  name: Keep database awake

  # Supabase pauses Free plan projects after about 7 days of low activity.
  # This runs one small query a day as `keepalive`, a role with no access to
  # any table. GitHub turns off scheduled workflows after 60 days with no
  # commits. After a long break: Actions -> Keep database awake -> Enable.
  on:
    schedule:
      - cron: "17 14 * * *" # off the hour: GitHub delays jobs at :00
    workflow_dispatch:

  permissions: {}

  jobs:
    ping:
      runs-on: ubuntu-latest
      timeout-minutes: 5
      steps:
        - run: psql "$KEEPALIVE_DATABASE_URL" --no-psqlrc --set ON_ERROR_STOP=1 --tuples-only --command "select now()"
          env:
            KEEPALIVE_DATABASE_URL: ${{ secrets.KEEPALIVE_DATABASE_URL }}
            PGCONNECT_TIMEOUT: "15"
  ```

- [ ] Run it once by hand (**Actions → Keep database awake → Run workflow**)
      to check it works.

### Claude Code skills

Supabase publishes two skills that teach Claude its current APIs and Postgres
best practices (for example, turning on row level security). Add them with:

```bash
pnpm dlx skills add supabase/agent-skills
```

Pick `supabase` and `supabase-postgres-best-practices`, and **Claude Code** as
the agent. Commit the files it adds (`.agents/skills/`, `.claude/skills/` and
`skills-lock.json`), and add a row for each to `.claude/skills/README.md`.

### Claude Code rules

Add these to `.claude/settings.json` under `permissions.deny`, so Claude can't
change a remote database:

```json
"Bash(supabase db push*)",
"Bash(pnpm supabase db push*)",
"Bash(pnpm supabase link*)"
```

And add this rule to `CLAUDE.md`:

```
- Never run `pnpm supabase db push` or change a remote database. Changes go in
  a migration file, and CI applies them after review.
```

Then add the Supabase commands (`supabase start`, `db reset`, `migration new`,
`db:types`) to the Commands list in `CLAUDE.md` and the README.
