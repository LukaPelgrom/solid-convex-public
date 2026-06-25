import {
  createFileRoute,
  redirect,
  useNavigate,
} from "@tanstack/solid-router";
import {
  DemoRegisterForm,
  type AuthLinkRenderer,
} from "@solid-convex-public/core";
import {
  authRedirectHref,
  parseAuthRedirectSearch,
} from "../demo/auth-redirect";

export const Route = createFileRoute("/register")({
  validateSearch: parseAuthRedirectSearch,
  beforeLoad: async ({ context, search }) => {
    await context.auth.waitUntilReady();

    if (context.auth.user()) {
      throw redirect({ to: search.redirect, replace: true });
    }
  },
  component: Register,
});

const renderAuthLink: AuthLinkRenderer = (props) => (
  <a href={props.href} class={props.class}>
    {props.children}
  </a>
);

function Register() {
  const context = Route.useRouteContext();
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const auth = () => context().auth;
  const redirectTo = () => search().redirect;

  return (
    <DemoRegisterForm
      onSubmit={async (input) => {
        await auth().register(input);
        await navigate({ to: redirectTo(), replace: true });
      }}
      signInHref={authRedirectHref("/", redirectTo())}
      renderLink={renderAuthLink}
    />
  );
}
