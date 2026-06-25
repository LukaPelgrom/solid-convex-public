import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/solid-router";
import { createEffect } from "solid-js";
import {
  DemoLoginForm,
  type AuthLinkRenderer,
} from "@solid-configs-public/core";
import {
  authRedirectHref,
  parseAuthRedirectSearch,
} from "../demo/auth-redirect";

export const Route = createFileRoute("/")({
  validateSearch: parseAuthRedirectSearch,
  component: Login,
});

const renderAuthLink: AuthLinkRenderer = (props) => (
  <a href={props.href} class={props.class}>
    {props.children}
  </a>
);

function Login() {
  const router = useRouter();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const auth = router.options.context.auth;
  const redirectTo = () => search().redirect;

  createEffect(() => {
    if (!auth.isReady() || !auth.user()) {
      return;
    }

    void navigate({ to: redirectTo(), replace: true });
  });

  return (
    <DemoLoginForm
      onSubmit={async (input) => {
        await auth.signIn(input);
        await navigate({ to: redirectTo(), replace: true });
      }}
      registerHref={authRedirectHref("/register", redirectTo())}
      renderLink={renderAuthLink}
    />
  );
}
