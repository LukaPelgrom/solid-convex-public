import {
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
} from "@tanstack/solid-router";
import { TanStackDemoShell } from "../demo-shell";
import { normalizeAuthRedirect } from "../demo/auth-redirect";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context, location }) => {
    await context.auth.waitUntilReady();

    if (!context.auth.user()) {
      throw redirect({
        to: "/",
        search: { redirect: normalizeAuthRedirect(location.pathname) },
        replace: true,
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const context = Route.useRouteContext();
  const navigate = useNavigate({ from: Route.fullPath });
  const auth = () => context().auth;
  const user = () => auth().user() ?? null;
  const signOut = async () => {
    await auth().signOut();
    await navigate({
      to: "/",
      search: { redirect: "/todos" },
      replace: true,
    });
  };

  return (
    <TanStackDemoShell auth={auth()} onSignOut={signOut} user={user}>
      <Outlet />
    </TanStackDemoShell>
  );
}
