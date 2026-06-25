import { Outlet, createRootRouteWithContext } from "@tanstack/solid-router";
import type { SolidConvex } from "@solid-convex-public/core";
import { PermissionProvider } from "@solid-convex-public/permissions/solid";
import type { SolidConvexAuth } from "../demo";

export type RouterContext = {
  auth: SolidConvexAuth;
  convex: SolidConvex;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
});

function Root() {
  const context = Route.useRouteContext();
  const auth = () => context().auth;

  return (
    <PermissionProvider subject={auth().subject}>
      <Outlet />
    </PermissionProvider>
  );
}
