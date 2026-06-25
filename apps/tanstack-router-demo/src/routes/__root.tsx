import {
  Outlet,
  createRootRouteWithContext,
  useLocation,
  useRouter,
} from "@tanstack/solid-router";
import { Show } from "solid-js";
import type { SolidConvex } from "@solid-configs-public/core";
import { PermissionProvider } from "@solid-configs-public/permissions/solid";
import type { SolidConvexAuth } from "../demo";
import { TanStackDemoShell } from "../demo-shell";

export type RouterContext = {
  auth: SolidConvexAuth;
  convex: SolidConvex;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
});

function Root() {
  const router = useRouter();
  const location = useLocation();
  const auth = router.options.context.auth;
  const user = () => auth.user() ?? null;
  const isAuthRoute = () => location().pathname === "/register";
  const shouldRenderShell = () =>
    !isAuthRoute() && (!auth.isReady() || Boolean(auth.user()));

  return (
    <PermissionProvider subject={auth.subject}>
      <Show when={shouldRenderShell()} fallback={<Outlet />}>
        <TanStackDemoShell auth={auth} user={user}>
          <Outlet />
        </TanStackDemoShell>
      </Show>
    </PermissionProvider>
  );
}
