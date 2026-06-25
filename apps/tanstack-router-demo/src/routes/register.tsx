import {
  Link,
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/solid-router";
import {
  DemoRegisterForm,
  type AuthLinkRenderer,
} from "@solid-configs-public/core";

export const Route = createFileRoute("/register")({
  component: Register,
});

const renderAuthLink: AuthLinkRenderer = (props) => (
  <Link to={props.href as "/" | "/register"} class={props.class}>
    {props.children}
  </Link>
);

function Register() {
  const router = useRouter();
  const navigate = useNavigate();
  const auth = router.options.context.auth;

  return (
    <DemoRegisterForm
      onSubmit={async (input) => {
        await auth.register(input);
        await navigate({ to: "/todos" });
      }}
      signInHref="/"
      renderLink={renderAuthLink}
    />
  );
}
