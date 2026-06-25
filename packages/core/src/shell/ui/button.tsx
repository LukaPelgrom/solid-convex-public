import * as ButtonPrimitive from "@kobalte/core/button";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { LoaderCircle } from "lucide-solid";
import type { Component, JSX, ValidComponent } from "solid-js";
import { Show, splitProps } from "solid-js";
import { cn } from "../lib/shadcn/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        xs: "h-6 gap-1 rounded-md px-2 text-xs [&_svg]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3",
        lg: "h-10 rounded-md px-6",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps<T extends ValidComponent = "button"> =
  ButtonPrimitive.ButtonRootProps<T> &
    VariantProps<typeof buttonVariants> & {
      class?: string | undefined;
      children?: JSX.Element;
    };

const Button = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, ButtonProps<T>>,
) => {
  const [local, others] = splitProps(props as ButtonProps, [
    "variant",
    "size",
    "class",
  ]);
  return (
    <ButtonPrimitive.Root
      class={cn(
        buttonVariants({ variant: local.variant, size: local.size }),
        local.class,
      )}
      {...others}
    />
  );
};

type ButtonGroupHeaderProps = {
  class?: string;
  children: JSX.Element;
};

const ButtonGroupHeader = (props: ButtonGroupHeaderProps) => {
  const [local] = splitProps(props, ["class"]);

  return (
    <div
      class={cn(
        "flex items-center justify-center rounded-t-md bg-muted px-4 py-2 font-medium text-muted-foreground text-sm",
        local.class,
      )}
    >
      {props.children}
    </div>
  );
};

type ButtonGroupProps = {
  class?: string;
  children: JSX.Element;
  orientation?: "horizontal" | "vertical";
  header?: JSX.Element;
};

const ButtonGroup = (props: ButtonGroupProps) => {
  const [local, others] = splitProps(props, ["class", "orientation", "header"]);

  return (
    <div class={cn("inline-flex flex-col", local.class)} {...others}>
      {local.header}
      <div
        class={cn(
          "inline-flex overflow-auto",
          local.orientation === "vertical" ? "flex-col" : "flex-row",
          "[&>button]:rounded-none",
          "[&>button:first-child]:rounded-l-md",
          "[&>button:last-child]:rounded-r-md",
          local.orientation === "vertical" &&
            "[&>button:first-child]:rounded-t-md",
          local.orientation === "vertical" &&
            "[&>button:last-child]:rounded-b-md",
          local.orientation === "vertical" &&
            "[&>button:not(:last-child)]:rounded-b-none",
          local.orientation === "vertical" &&
            "[&>button:not(:first-child)]:rounded-t-none",
          local.orientation === "horizontal" &&
            "[&>button:not(:last-child)]:rounded-r-none",
          local.orientation === "horizontal" &&
            "[&>button:not(:first-child)]:rounded-l-none",
          local.header && "[&>button:first-child]:rounded-t-none",
          local.header && "[&>button:last-child]:rounded-t-none",
        )}
      >
        {props.children}
      </div>
    </div>
  );
};

type LoadingButtonProps = ButtonProps & {
  isLoading: boolean;
  loadingIcon?: Component<JSX.IntrinsicElements["svg"]>;
  icon?: Component<JSX.IntrinsicElements["svg"]>;
};
const LoadingButton = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, LoadingButtonProps>,
) => {
  const [local, others] = splitProps(props as LoadingButtonProps, [
    "variant",
    "size",
    "class",
    "isLoading",
    "children",
    "loadingIcon",
    "icon",
  ]);
  return (
    <ButtonPrimitive.Root
      class={cn(
        buttonVariants({ variant: local.variant, size: local.size }),
        local.class,
      )}
      {...others}
    >
      <Show
        fallback={
          <>
            {local.icon && (
              <local.icon
                class={cn("h-4 w-4", local.size !== "icon" && "mr-2")}
              />
            )}
            {local.children}
          </>
        }
        when={local.isLoading}
      >
        {local.loadingIcon ? (
          <local.loadingIcon
            class={cn("h-4 w-4 animate-spin", local.size !== "icon" && "mr-2")}
          />
        ) : (
          <LoaderCircle
            class={cn("h-4 w-4 animate-spin", local.size !== "icon" && "mr-2")}
          />
        )}

        {local.children}
      </Show>
    </ButtonPrimitive.Root>
  );
};

export type {
  ButtonProps,
  ButtonGroupProps,
  ButtonGroupHeaderProps,
  LoadingButtonProps,
};
export {
  Button,
  ButtonGroup,
  ButtonGroupHeader,
  buttonVariants,
  LoadingButton,
};
