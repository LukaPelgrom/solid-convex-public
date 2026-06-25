import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/solid-router";
import { createEffect } from "solid-js";
import {
  DemoRegisterForm,
  type AuthLinkRenderer,
} from "@solid-configs-public/core";
import {
  authRedirectHref,
  parseAuthRedirectSearch,
} from "../demo/auth-redirect";

export const Route = createFileRoute("/register")({
  validateSearch: parseAuthRedirectSearch,
  component: Register,
});

const renderAuthLink: AuthLinkRenderer = (props) => (
  <a href={props.href} class={props.class}>
    {props.children}
  </a>
);

function Register() {
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
    <DemoRegisterForm
      onSubmit={async (input) => {
        await auth.register(input);
        await navigate({ to: redirectTo(), replace: true });
      }}
      signInHref={authRedirectHref("/", redirectTo())}
      renderLink={renderAuthLink}
    />
  );
}
