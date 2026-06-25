import { render } from "solid-js/web";
import { RouterProvider, createRouter } from "@tanstack/solid-router";
import { SolidConvexProvider } from "@solid-convex-public/core";
import { subjectFromRole } from "@solid-convex-public/permissions";
import { routeTree } from "./routeTree.gen";
import { createDemoConvex, createSolidConvexAuth } from "./demo";
import type { SolidConvexAuth } from "./demo";
import type { RouterContext } from "./routes/__root";
import "./styles.css";

const convex = createDemoConvex();

const missingRouterAuth = () => {
  throw new Error("Router auth context is not available yet.");
};

const placeholderAuth = {
  session: () => ({
    data: null,
    error: null,
    isPending: false,
    isRefetching: false,
    refetch: async () => undefined,
  }),
  user: () => null,
  subject: () => subjectFromRole(null),
  isReady: () => false,
  refreshVersion: () => 0,
  waitUntilReady: async () => missingRouterAuth(),
  signIn: async () => missingRouterAuth(),
  register: async () => missingRouterAuth(),
  signOut: async () => missingRouterAuth(),
} satisfies SolidConvexAuth;

const placeholderRouterContext = {
  auth: placeholderAuth,
  convex,
} satisfies RouterContext;

function DemoRoutePending() {
  return <main class="page-content">Loading route...</main>;
}

function DemoRouteError(props: { error: Error }) {
  return (
    <main class="page-content" role="alert">
      {props.error.message || "Unable to load route."}
    </main>
  );
}

const router = createRouter({
  routeTree,
  context: placeholderRouterContext,
  defaultErrorComponent: DemoRouteError,
  defaultPendingComponent: DemoRoutePending,
  defaultPendingMs: 0,
  defaultPreload: "intent",
});

declare module "@tanstack/solid-router" {
  interface Register {
    router: typeof router;
  }
}

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing root element");
}

function App() {
  return (
    <SolidConvexProvider convex={convex}>
      <DemoRouter />
    </SolidConvexProvider>
  );
}

function DemoRouter() {
  const auth = createSolidConvexAuth();

  return (
    <RouterProvider
      router={router}
      context={{
        auth,
        convex,
      }}
    />
  );
}

render(() => <App />, root);
