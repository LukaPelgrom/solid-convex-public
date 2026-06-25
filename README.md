# Solid Convex Public

A small public Solid + Convex reference app built around a server-backed Todo
workflow.

The repository keeps the reusable Solid/Convex primitives from the original
workspace and narrows the product surface to one focused Todo app. It is meant
to be easy to read, easy to copy from, and useful as a baseline for Solid apps
that need Convex data, Better Auth, optimistic mutations, route composition, and
tests.

## What's Included

- `apps/tanstack-router-demo` - Solid + Vite + TanStack Router Todo app.
- `packages/backend` - Convex backend with Better Auth, demo roles, local admin
  seeding, and authenticated Todo functions.
- `packages/core` - Solid Convex primitives, Better Auth helpers, shared UI, and
  the app shell.
- `packages/permissions` - small role-policy package plus Solid provider
  helpers.

## Quick Start

```bash
bun install
bun run check-types
bun run test:unit
bun run test:convex
```

Run the app locally with two terminals:

```bash
bun run dev:convex
```

```bash
bun run dev:todo
```

The Todo app runs at [http://localhost:3201](http://localhost:3201).

## Setup Guide

1. Install dependencies.

   ```bash
   bun install
   ```

2. Start the Convex backend.

   ```bash
   bun run dev:convex
   ```

   The first run configures `packages/backend` with a Convex project. Local
   development uses `http://127.0.0.1:3210` for queries and mutations, and
   `http://127.0.0.1:3211` for the Better Auth HTTP routes.

3. Configure Better Auth environment variables for the Convex deployment.

   ```bash
   bun run --cwd packages/backend convex env set BETTER_AUTH_SECRET "$(openssl rand -base64 32)"
   bun run --cwd packages/backend convex env set SITE_URLS "http://localhost:3201,http://127.0.0.1:3201"
   bun run --cwd packages/backend convex env set SITE_URL "http://localhost:3201"
   ```

4. Start the Solid app.

   ```bash
   bun run dev:todo
   ```

5. Seed a local admin user and sign in.

   ```bash
   bun run seed:admin
   ```

   Use `admin@test.com` and `Welcome01!` on the login screen.

6. Verify the project.

   ```bash
   bun run check-types
   bun run test:unit
   bun run test:convex
   bun run test:e2e --project=chromium
   ```

## Demo Admin

For local testing, seed an admin user:

```bash
bun run seed:admin
```

Default credentials:

```text
admin@test.com
Welcome01!
```

The seed is idempotent. If the user already exists, it keeps the account and
ensures the demo profile has the `admin` role. The seed is guarded to run only
against local Convex site URLs such as `http://127.0.0.1:3211`.

## Convex Setup

Start Convex from the backend package:

```bash
bun run dev:convex
```

The Convex CLI will ask for the project and team the first time. For local dev,
the demo defaults to:

```bash
VITE_CONVEX_URL=http://127.0.0.1:3210
VITE_CONVEX_SITE_URL=http://127.0.0.1:3211
```

For a hosted dev deployment, set the frontend URLs in your app environment:

```bash
VITE_CONVEX_URL=https://your-dev-deployment.convex.cloud
VITE_CONVEX_SITE_URL=https://your-dev-deployment.convex.site
```

Better Auth also needs Convex deployment environment variables:

```bash
bun run --cwd packages/backend convex env set BETTER_AUTH_SECRET "$(openssl rand -base64 32)"
bun run --cwd packages/backend convex env set SITE_URLS "http://localhost:3201,http://127.0.0.1:3201"
bun run --cwd packages/backend convex env set SITE_URL "http://localhost:3201"
```

## Testing

```bash
bun run check-types
bun run test:unit
bun run test:convex
bun run test:e2e --project=chromium
```

The e2e suite starts the local Convex and Vite servers through Playwright's web
server config. The tests run serially because they share one local Convex
deployment.

## Architecture Notes

- App code uses `@solid-convex-public/core` primitives for Convex reads,
  mutations, cache hydration, and auth token handoff.
- Feature code should prefer `query`, `mutation`, `prefetchBatch`, and
  `prefetchConvexBatch` over ad hoc clients or `createResource` for Convex data.
- No-argument Convex functions are called without placeholder `{}` objects.
- Route files stay thin: they compose feature components and keep product state
  local to the route that owns it.
- The public app surface is intentionally Todo-only. Kanban board routes,
  backend functions, tests, and package exports were removed for this variant.

## Solid Convex Library

`@solid-convex-public/core` wraps Convex in Solid-friendly primitives. It keeps
client ownership, cache reads, subscriptions, optimistic writes, route
prefetching, and auth-token refresh logic in one package instead of scattering
Convex client code through feature components.

### Provider Setup

Create one Solid Convex client near the app root and pass it through context.

```tsx
import {
  SolidConvexProvider,
  createSolidConvex,
} from "@solid-convex-public/core";
import { getConvexAuthToken } from "./auth";

const convex = createSolidConvex({
  url: import.meta.env.VITE_CONVEX_URL,
  getAuthToken: getConvexAuthToken,
});

export function App() {
  return (
    <SolidConvexProvider convex={convex}>
      <Routes />
    </SolidConvexProvider>
  );
}
```

### Query Data And State

`useQuery` returns Solid accessors. Use the tuple form when the UI needs loading
or error state.

```tsx
import { useQuery } from "@solid-convex-public/core";
import { api } from "@solid-convex-public/backend/convex/_generated/api";

const [todos, todosState] = useQuery(api.todos.list, {
  enabled: () => Boolean(auth.user()),
  initialData: [],
});

todos();
todosState.isLoading();
todosState.error();
```

### Mutations And Optimistic Updates

Mutations can update the local query cache before the server responds. The
optimistic query and args should match the cached query that the UI reads.

```tsx
import { createSignal } from "solid-js";
import { useMutation } from "@solid-convex-public/core";
import { api } from "@solid-convex-public/backend/convex/_generated/api";

const [saveError, setSaveError] = createSignal<string | null>(null);

const [toggleTodo, toggleTodoState] = useMutation(api.todos.toggle, {
  optimistic: {
    query: api.todos.list,
    apply: (current, mutationArgs) =>
      current?.map((todo) =>
        todo._id === mutationArgs.id
          ? { ...todo, done: !todo.done, updatedAt: Date.now() }
          : todo,
      ),
  },
  onError: (error) => setSaveError(error.userMessage),
});

await toggleTodo({ id });
toggleTodoState.isPending();
toggleTodoState.error();
toggleTodoState.reset();
```

No-argument mutations can also be called directly.

```ts
const resetTodos = useMutation(api.todos.resetMine);

await resetTodos();
```

### Route And Server Prefetching

Use `prefetchBatch` for related route reads. Keyed batches return an object,
which keeps route loaders readable.

```ts
import { prefetchBatch } from "@solid-convex-public/core";
import { api } from "@solid-convex-public/backend/convex/_generated/api";

const { user, todos } = await prefetchBatch(convex, [
  ["user", api.auth.getCurrentUserProfile],
  ["todos", api.todos.list],
] as const);

return { user, todos };
```

The same cache powers `prefetch`, `useQuery`, hydration, and subscriptions, so
prefetched data is immediately available to subscribed components.

### Cache Hydration

Server or route code can dehydrate prefetched data and hydrate the browser
client before components subscribe.

```ts
import {
  createSolidConvex,
  createSolidConvexServer,
} from "@solid-convex-public/core";
import { api } from "@solid-convex-public/backend/convex/_generated/api";

const serverConvex = createSolidConvexServer({
  url: process.env.CONVEX_URL,
  authToken,
});

await serverConvex.prefetch(api.auth.getCurrentUserProfile);
const snapshot = serverConvex.dehydrate();

const browserConvex = createSolidConvex({
  url: import.meta.env.VITE_CONVEX_URL,
  initialCache: snapshot,
  getAuthToken,
});
```

### Better Auth Token Handoff

The Better Auth helper fetches Convex JWTs from the Convex site URL and plugs
them into `createSolidConvex`.

```ts
import {
  createBetterAuthConvexClient,
  createBetterAuthConvexTokenProvider,
} from "@solid-convex-public/core/better-auth";

export const authClient = createBetterAuthConvexClient({
  siteUrl: import.meta.env.VITE_CONVEX_SITE_URL,
  storagePrefix: "solid-convex-public",
});

export const getConvexAuthToken =
  createBetterAuthConvexTokenProvider(authClient);
```

## Copying From This Repo

The most reusable pieces are:

```text
packages/core
packages/permissions
```

In another workspace package, consume them as:

```json
{
  "dependencies": {
    "@solid-convex-public/core": "workspace:*",
    "@solid-convex-public/permissions": "workspace:*"
  }
}
```

## Generated Files

`packages/backend/convex/_generated` contains a checked-in shim so the repo can
typecheck before a Convex project is configured. Running `bun run dev:convex` or
`bun run --cwd packages/backend convex codegen` can replace it with generated
files for the configured deployment.
