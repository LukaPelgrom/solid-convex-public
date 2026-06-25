# @solid-convex-public/permissions

Small CLP-style permission package for Solid + Convex demos.

Exports:

- `demoRoles`, `DemoRole`, and `demoRoleLabels`
- `createRolePolicy`, `evaluatePolicy`, `hasPermission`, and `assertPermission`
- `canManageDemoItems`, `canViewAdminRoute`, and `canAccessAdminRoute`
- Solid helpers from `@solid-convex-public/permissions/solid`: `PermissionProvider`, `useRolePermission`, and `Protected`

The demo intentionally separates visibility from access:

- `employee` cannot see or access admin.
- `employee_plus` can see admin navigation but cannot enter or load admin data.
- `admin` can see, enter, and load server-protected admin data.
