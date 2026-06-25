import {
  Show,
  createSignal,
  splitProps,
  type Component,
  type ComponentProps,
  type JSX,
} from "solid-js";

export type ClassValue =
  | string
  | false
  | null
  | undefined
  | Record<string, boolean | undefined>;

export function cn(...inputs: ClassValue[]) {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string") {
      classes.push(input);
      continue;
    }

    for (const [className, enabled] of Object.entries(input)) {
      if (enabled) {
        classes.push(className);
      }
    }
  }

  return classes.join(" ");
}

export type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";
export type ButtonSize = "default" | "sm" | "lg" | "icon";

export type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
};

export function buttonClass(props?: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  class?: string;
}) {
  return cn(
    "ui-button",
    `ui-button--${props?.variant ?? "default"}`,
    `ui-button-size--${props?.size ?? "default"}`,
    props?.class,
  );
}

export const Button: Component<ButtonProps> = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "variant",
    "size",
    "isLoading",
    "children",
    "disabled",
    "type",
  ]);

  return (
    <button
      class={buttonClass({
        variant: local.variant,
        size: local.size,
        class: local.class,
      })}
      disabled={local.disabled || local.isLoading}
      type={local.type ?? "button"}
      {...others}
    >
      <Show when={local.isLoading}>
        <span class="ui-spinner" aria-hidden="true" />
      </Show>
      {local.children}
    </button>
  );
};

export type ButtonGroupProps = ComponentProps<"div"> & {
  header?: JSX.Element;
  orientation?: "horizontal" | "vertical";
};

export const ButtonGroup: Component<ButtonGroupProps> = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "children",
    "header",
    "orientation",
  ]);

  return (
    <div class={cn("ui-button-group-shell", local.class)} {...others}>
      {local.header}
      <div
        class={cn(
          "ui-button-group",
          local.orientation === "vertical" && "ui-button-group--vertical",
        )}
      >
        {local.children}
      </div>
    </div>
  );
};

export const ButtonGroupHeader: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <div class={cn("ui-button-group-header", local.class)} {...others} />;
};

export const LoadingButton: Component<ButtonProps> = (props) => (
  <Button {...props} />
);

export const Card: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <div class={cn("ui-card", local.class)} {...others} />;
};

export const CardHeader: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <div class={cn("ui-card-header", local.class)} {...others} />;
};

export const CardTitle: Component<ComponentProps<"h2">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <h2 class={cn("ui-card-title", local.class)} {...others} />;
};

export const CardDescription: Component<ComponentProps<"p">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <p class={cn("ui-card-description", local.class)} {...others} />;
};

export const CardContent: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <div class={cn("ui-card-content", local.class)} {...others} />;
};

export const CardFooter: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <div class={cn("ui-card-footer", local.class)} {...others} />;
};

export const Input: Component<ComponentProps<"input">> = (props) => {
  const [local, others] = splitProps(props, ["class", "type"]);
  return (
    <input
      class={cn("ui-input", local.class)}
      type={local.type ?? "text"}
      {...others}
    />
  );
};

export const Textarea: Component<ComponentProps<"textarea">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <textarea class={cn("ui-input ui-textarea", local.class)} {...others} />
  );
};

export const InputLabel: Component<ComponentProps<"label">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <label class={cn("ui-input-label", local.class)} {...others} />;
};

export const InputError: Component<ComponentProps<"p">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <p class={cn("ui-input-error", local.class)} {...others} />;
};

export type BadgeProps = ComponentProps<"span"> & {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "success"
    | "warning"
    | "error";
  round?: boolean;
};

export const Badge: Component<BadgeProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "variant", "round"]);
  return (
    <span
      class={cn(
        "ui-badge",
        `ui-badge--${local.variant ?? "default"}`,
        local.round && "ui-badge--round",
        local.class,
      )}
      {...others}
    />
  );
};

export type SeparatorProps = ComponentProps<"hr"> & {
  orientation?: "horizontal" | "vertical";
};

export const Separator: Component<SeparatorProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "orientation"]);
  return (
    <hr
      class={cn(
        "ui-separator",
        local.orientation === "vertical" && "ui-separator--vertical",
        local.class,
      )}
      {...others}
    />
  );
};

export type AlertProps = ComponentProps<"div"> & {
  variant?: "default" | "destructive" | "success" | "warning" | "info";
};

export const Alert: Component<AlertProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "variant"]);
  return (
    <div
      class={cn(
        "ui-alert",
        `ui-alert--${local.variant ?? "default"}`,
        local.class,
      )}
      role={props.role ?? "status"}
      {...others}
    />
  );
};

export const AlertTitle: Component<ComponentProps<"h3">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <h3 class={cn("ui-alert-title", local.class)} {...others} />;
};

export const AlertDescription: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <div class={cn("ui-alert-description", local.class)} {...others} />;
};

export type AvatarProps = ComponentProps<"span"> & {
  fallback?: JSX.Element;
};

export const Avatar: Component<AvatarProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "fallback", "children"]);
  return (
    <span class={cn("ui-avatar", local.class)} {...others}>
      {local.children ?? <AvatarFallback>{local.fallback}</AvatarFallback>}
    </span>
  );
};

export const AvatarFallback: Component<ComponentProps<"span">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <span class={cn("ui-avatar-fallback", local.class)} {...others} />;
};

export const Skeleton: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <div class={cn("ui-skeleton", local.class)} {...others} />;
};

export type PasswordInputProps = ComponentProps<"input">;

export const PasswordInput: Component<
  PasswordInputProps & { showLabel?: string; hideLabel?: string }
> = (props) => {
  const [showPassword, setShowPassword] = createSignal(false);
  const [local, others] = splitProps(props, [
    "class",
    "disabled",
    "showLabel",
    "hideLabel",
  ]);
  const showLabel = () => local.showLabel ?? "Show";
  const hideLabel = () => local.hideLabel ?? "Hide";
  const toggleLabel = () => (showPassword() ? hideLabel() : showLabel());

  return (
    <div class="ui-password-input">
      <Input
        class={cn("hide-password-toggle", local.class)}
        type={showPassword() ? "text" : "password"}
        disabled={local.disabled}
        {...others}
      />
      <Button
        class="ui-password-toggle"
        disabled={local.disabled}
        onClick={() => setShowPassword((value) => !value)}
        size="sm"
        type="button"
        variant="ghost"
      >
        <span aria-hidden="true">{toggleLabel()}</span>
        <span class="sr-only">{toggleLabel()}</span>
      </Button>
    </div>
  );
};
