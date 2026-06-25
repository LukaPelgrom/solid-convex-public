import { createForm } from "@tanstack/solid-form";
import { For, Show, createSignal, onMount, type JSX } from "solid-js";
import {
  demoRoleLabels,
  demoRoles,
  parseDemoRole,
  type DemoRole,
} from "@solid-convex-public/permissions";
import { m, msg } from "./i18n";
import { Icon } from "./icons";
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  PasswordInput,
  cn,
} from "./ui";

export type AuthLinkRenderProps = {
  href: string;
  class?: string;
  children: JSX.Element;
};

export type AuthLinkRenderer = (props: AuthLinkRenderProps) => JSX.Element;

export type SignInInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  email: string;
  name: string;
  password: string;
  role?: DemoRole;
};

function defaultLink(props: AuthLinkRenderProps) {
  return (
    <a href={props.href} class={props.class}>
      {props.children}
    </a>
  );
}

export function AuthPage(props: {
  title: () => string;
  description: () => string;
  children: JSX.Element;
}) {
  return (
    <main class="auth-page">
      <Card class="auth-card">
        <CardHeader class="auth-card-header">
          <div class="auth-brand">
            <span class="auth-brand-mark">S</span>
            <span>{msg(m.auth_brand)}</span>
          </div>
          <CardTitle>{props.title()}</CardTitle>
          <CardDescription>{props.description()}</CardDescription>
        </CardHeader>
        <CardContent>{props.children}</CardContent>
      </Card>
    </main>
  );
}

export function DemoLoginForm(props: {
  onSubmit: (input: SignInInput) => Promise<void> | void;
  registerHref?: string;
  renderLink?: AuthLinkRenderer;
}) {
  const [error, setError] = createSignal<string>();
  const [mounted, setMounted] = createSignal(false);
  const renderLink = () => props.renderLink ?? defaultLink;
  const form = createForm(() => ({
    defaultValues: {
      email: "",
      password: "",
    } satisfies SignInInput,
    onSubmit: async ({ value }) => {
      setError(undefined);
      try {
        await props.onSubmit({
          email: value.email,
          password: value.password,
        });
      } catch (caughtError: unknown) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : msg(m.auth_sign_in_failed),
        );
      }
    },
  }));
  onMount(() => setMounted(true));

  return (
    <AuthPage
      title={() => msg(m.auth_sign_in_title)}
      description={() => msg(m.auth_sign_in_description)}
    >
      <form
        class="auth-form"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          const formData = new FormData(event.currentTarget);
          form.setFieldValue("email", String(formData.get("email") ?? ""));
          form.setFieldValue(
            "password",
            String(formData.get("password") ?? ""),
          );
          void form.handleSubmit();
        }}
      >
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) =>
              value.trim() ? undefined : msg(m.auth_email),
          }}
          children={(field) => (
            <FormField id={field().name} label={msg(m.auth_email)}>
              <Input
                autocomplete="email"
                id={field().name}
                name={field().name}
                onBlur={field().handleBlur}
                onInput={(event) =>
                  field().handleChange(event.currentTarget.value)
                }
                placeholder="admin@test.com"
                required
                type="email"
                value={field().state.value}
              />
            </FormField>
          )}
        />
        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) =>
              value.trim() ? undefined : msg(m.auth_password),
          }}
          children={(field) => (
            <FormField id={field().name} label={msg(m.auth_password)}>
              <PasswordInput
                autocomplete="current-password"
                hideLabel={msg(m.auth_hide_password)}
                id={field().name}
                name={field().name}
                onBlur={field().handleBlur}
                onInput={(event) =>
                  field().handleChange(event.currentTarget.value)
                }
                placeholder="Welcome01!"
                required
                showLabel={msg(m.auth_show_password)}
                value={field().state.value}
              />
            </FormField>
          )}
        />
        <Show when={error()}>
          {(message) => (
            <Alert variant="destructive" data-testid="auth-error">
              <AlertDescription>{message()}</AlertDescription>
            </Alert>
          )}
        </Show>
        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
          children={(state) => (
            <Button
              class="auth-submit"
              disabled={!mounted() || !state().canSubmit}
              isLoading={state().isSubmitting}
              type="submit"
            >
              {msg(m.auth_sign_in)}
            </Button>
          )}
        />
        <Show when={props.registerHref}>
          {(href) => (
            <p class="auth-footer">
              {msg(m.auth_need_user)}{" "}
              {renderLink()({
                href: href(),
                children: msg(m.auth_create_one),
              })}
            </p>
          )}
        </Show>
      </form>
    </AuthPage>
  );
}

export function DemoRegisterForm(props: {
  onSubmit: (input: RegisterInput) => Promise<void> | void;
  signInHref?: string;
  renderLink?: AuthLinkRenderer;
}) {
  type RegisterFormValues = Required<Omit<RegisterInput, "role">> & {
    role: DemoRole;
  };
  const defaultValues: RegisterFormValues = {
    email: "",
    name: "",
    password: "",
    role: "employee",
  };

  const [error, setError] = createSignal<string>();
  const [mounted, setMounted] = createSignal(false);
  const renderLink = () => props.renderLink ?? defaultLink;
  const form = createForm(() => ({
    defaultValues,
    onSubmit: async ({ value }) => {
      setError(undefined);
      try {
        await props.onSubmit({
          email: value.email,
          name: value.name,
          password: value.password,
          role: parseDemoRole(value.role),
        });
      } catch (caughtError: unknown) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : msg(m.auth_registration_failed),
        );
      }
    },
  }));
  onMount(() => setMounted(true));

  return (
    <AuthPage
      title={() => msg(m.auth_register_title)}
      description={() => msg(m.auth_register_description)}
    >
      <form
        class="auth-form"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          const formData = new FormData(event.currentTarget);
          form.setFieldValue("name", String(formData.get("name") ?? ""));
          form.setFieldValue("email", String(formData.get("email") ?? ""));
          form.setFieldValue(
            "password",
            String(formData.get("password") ?? ""),
          );
          form.setFieldValue(
            "role",
            parseDemoRole(String(formData.get("role") ?? "")),
          );
          void form.handleSubmit();
        }}
      >
        <form.Field
          name="name"
          children={(field) => (
            <FormField id={field().name} label={msg(m.auth_name)}>
              <Input
                autocomplete="name"
                id={field().name}
                name={field().name}
                onBlur={field().handleBlur}
                onInput={(event) =>
                  field().handleChange(event.currentTarget.value)
                }
                placeholder="Demo Admin"
                required
                value={field().state.value}
              />
            </FormField>
          )}
        />
        <form.Field
          name="email"
          children={(field) => (
            <FormField id={field().name} label={msg(m.auth_email)}>
              <Input
                autocomplete="email"
                id={field().name}
                name={field().name}
                onBlur={field().handleBlur}
                onInput={(event) =>
                  field().handleChange(event.currentTarget.value)
                }
                placeholder="demo@example.com"
                required
                type="email"
                value={field().state.value}
              />
            </FormField>
          )}
        />
        <form.Field
          name="password"
          children={(field) => (
            <FormField id={field().name} label={msg(m.auth_password)}>
              <PasswordInput
                autocomplete="new-password"
                hideLabel={msg(m.auth_hide_password)}
                id={field().name}
                name={field().name}
                onBlur={field().handleBlur}
                onInput={(event) =>
                  field().handleChange(event.currentTarget.value)
                }
                placeholder="Welcome01!"
                required
                showLabel={msg(m.auth_show_password)}
                value={field().state.value}
              />
            </FormField>
          )}
        />
        <form.Field
          name="role"
          children={(field) => (
            <FormField id={field().name} label={msg(m.auth_role)}>
              <RoleDropdown
                id={field().name}
                label={msg(m.auth_role)}
                name={field().name}
                onChange={(role) => field().handleChange(role)}
                value={field().state.value}
              />
            </FormField>
          )}
        />
        <Show when={error()}>
          {(message) => (
            <Alert variant="destructive" data-testid="auth-error">
              <AlertDescription>{message()}</AlertDescription>
            </Alert>
          )}
        </Show>
        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
          children={(state) => (
            <Button
              class="auth-submit"
              disabled={!mounted() || !state().canSubmit}
              isLoading={state().isSubmitting}
              type="submit"
            >
              {msg(m.auth_create_account)}
            </Button>
          )}
        />
        <Show when={props.signInHref}>
          {(href) => (
            <p class="auth-footer">
              {msg(m.auth_have_account)}{" "}
              {renderLink()({
                href: href(),
                children: msg(m.auth_sign_in),
              })}
            </p>
          )}
        </Show>
      </form>
    </AuthPage>
  );
}

function RoleDropdown(props: {
  id: string;
  label: string;
  name: string;
  onChange: (role: DemoRole) => void;
  value: DemoRole;
}) {
  const [open, setOpen] = createSignal(false);
  const selectedLabel = () => demoRoleLabels[props.value];
  const selectRole = (role: DemoRole) => {
    props.onChange(role);
    setOpen(false);
  };

  return (
    <div class="role-dropdown">
      <input name={props.name} type="hidden" value={props.value} />
      <button
        aria-expanded={open()}
        id={props.id}
        onClick={() => setOpen((value) => !value)}
        type="button"
        class="ui-input role-dropdown-trigger"
        aria-label={props.label}
      >
        <span>{selectedLabel()}</span>
        <Icon name="chevron-right" class="rotate-90 opacity-60" />
      </button>
      <Show when={open()}>
        <div aria-label={props.label} class="role-dropdown-content" role="menu">
          <For each={demoRoles}>
            {(demoRole) => (
              <button
                class={cn(
                  "role-dropdown-item",
                  props.value === demoRole && "is-active",
                )}
                onClick={() => selectRole(demoRole)}
                role="menuitem"
                type="button"
              >
                {demoRoleLabels[demoRole]}
              </button>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}

export function FormField(props: {
  id: string;
  label: string;
  children: JSX.Element;
}) {
  return (
    <div class="form-field">
      <label for={props.id}>{props.label}</label>
      {props.children}
    </div>
  );
}

export function PageHeader(props: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <header class="page-header">
      <p class="eyebrow">{props.eyebrow}</p>
      <h1>{props.title}</h1>
      <Show when={props.description}>
        {(description) => <p>{description()}</p>}
      </Show>
    </header>
  );
}
