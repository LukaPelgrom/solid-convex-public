# Solid Convex Public

A small public Solid + Convex reference repo focused on a server-backed Todo app.

This repository keeps the useful Solid/Convex primitives from the original
project and removes the Kanban board surface. The app demonstrates Better Auth,
Convex queries and mutations, optimistic Todo updates, route-level composition,
and focused tests.

## What is inside

- `packages/backend` - Convex backend with Better Auth, demo roles, and authenticated Todo functions.
- `packages/permissions` - small role-policy package plus Solid helpers.
- `packages/core` - reusable Solid helpers for Convex clients, query state, mutations, prefetching, Better Auth token handoff, shared UI, and the app shell.
- `apps/tanstack-router-demo` - Solid + Vite + TanStack Router Todo demo.

## Quick Start

```bash
bun install
bun run check-types
bun run test:unit
bun run test:convex
bun run build
```

Run the Todo demo locally:

```bash
bun run dev:convex
bun run dev:todo
```

The Todo app runs at http://localhost:3201.

## Connect Convex

Configure one Convex deployment for `packages/backend`:

```bash
bun run dev:convex
```

The Convex CLI will ask for the project name/team the first time. After it
creates or selects a dev deployment, copy the generated deployment URL into
`.env.local` at the repo root:

```bash
VITE_CONVEX_URL=https://your-dev-deployment.convex.cloud
PUBLIC_CONVEX_URL=https://your-dev-deployment.convex.cloud
VITE_CONVEX_SITE_URL=https://your-dev-deployment.convex.site
PUBLIC_CONVEX_SITE_URL=https://your-dev-deployment.convex.site
```

Better Auth also needs Convex deployment env vars:

```bash
bun run --cwd packages/backend convex env set BETTER_AUTH_SECRET "$(openssl rand -base64 32)"
bun run --cwd packages/backend convex env set SITE_URLS "http://localhost:3201"
bun run --cwd packages/backend convex env set SITE_URL "http://localhost:3201"
```

## Use As Source

Copy or subtree these folders into another Solid project:

```text
packages/core
packages/permissions
```

Then add the dependency from that app:

```json
{
  "dependencies": {
    "@solid-convex-public/core": "workspace:*",
    "@solid-convex-public/permissions": "workspace:*"
  }
}
```

## Notes

- `packages/backend/convex/_generated` contains a tiny checked-in shim so the repo typechecks before a Convex project is configured. Running `bun run dev:convex` can replace it with Convex generated files.
- Better Auth runs inside Convex through `@convex-dev/better-auth`; app code talks to the Convex site URL for `/api/auth/*` and to the Convex deployment URL for queries and mutations.
- The public app surface is intentionally Todo-only; Kanban board routes, backend functions, tests, and package exports have been removed.
