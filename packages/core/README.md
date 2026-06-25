# @solid-convex-public/core

Reusable Solid helpers for Convex-backed apps.

Exports:

- Solid/Convex client factories and provider setup.
- `useQuery`, `useMutation`, and `useAction` primitives.
- `prefetchBatch` and `prefetchConvexBatch` for related route/server reads.
- Better Auth token-provider helpers for Convex auth.
- Shared UI primitives and the app shell used by the Todo demo.

Use `@solid-convex-public/permissions` alongside this package for shared role
policies and Solid helpers like `PermissionProvider`, `useRolePermission`, and
`Protected`.

This package is source-first: copy it into another workspace or use it through a
workspace dependency.
