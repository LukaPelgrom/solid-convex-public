import * as AlertDialogPrimitive from "@kobalte/core/alert-dialog";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { Component, ComponentProps, JSX, ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

import { buttonVariants } from "./button";
import { cn } from "../lib/shadcn/utils";

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal: Component<
  AlertDialogPrimitive.AlertDialogPortalProps
> = (props) => {
  const [, rest] = splitProps(props, ["children"]);
  return (
    <AlertDialogPrimitive.Portal {...rest}>
      <div class="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
        {props.children}
      </div>
    </AlertDialogPrimitive.Portal>
  );
};

type AlertDialogOverlayProps = AlertDialogPrimitive.AlertDialogOverlayProps & {
  class?: string | undefined;
};

const AlertDialogOverlay = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AlertDialogOverlayProps>,
) => {
  const [, rest] = splitProps(props as AlertDialogOverlayProps, ["class"]);
  return (
    <AlertDialogPrimitive.Overlay
      class={cn(
        "data-[closed]:fade-out-0 data-[expanded]:fade-in-0 fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[closed]:animate-out data-[expanded]:animate-in",
        props.class,
      )}
      {...rest}
    />
  );
};

type AlertDialogContentProps = AlertDialogPrimitive.AlertDialogContentProps & {
  class?: string | undefined;
  children?: JSX.Element;
};

const AlertDialogContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AlertDialogContentProps>,
) => {
  const [, rest] = splitProps(props as AlertDialogContentProps, [
    "class",
    "children",
  ]);
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        class={cn(
          "-translate-x-1/2 -translate-y-1/2 data-[closed]:fade-out-0 data-[expanded]:fade-in-0 data-[closed]:zoom-out-95 data-[expanded]:zoom-in-95 data-[closed]:slide-out-to-left-1/2 data-[closed]:slide-out-to-top-[48%] data-[expanded]:slide-in-from-left-1/2 data-[expanded]:slide-in-from-top-[48%] fixed top-1/2 left-1/2 z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 data-[closed]:animate-out data-[expanded]:animate-in sm:rounded-lg",
          props.class,
        )}
        {...rest}
      >
        {props.children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  );
};

const AlertDialogHeader: Component<ComponentProps<"div">> = (props) => {
  const [, rest] = splitProps(props, ["class"]);
  return (
    <div
      class={cn("flex flex-col items-start space-y-1.5 text-left", props.class)}
      {...rest}
    />
  );
};

const AlertDialogFooter: Component<ComponentProps<"div">> = (props) => {
  const [, rest] = splitProps(props, ["class"]);
  return (
    <div
      class={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        props.class,
      )}
      {...rest}
    />
  );
};

type AlertDialogTitleProps = AlertDialogPrimitive.AlertDialogTitleProps & {
  class?: string | undefined;
};

const AlertDialogTitle = <T extends ValidComponent = "h2">(
  props: PolymorphicProps<T, AlertDialogTitleProps>,
) => {
  const [, rest] = splitProps(props as AlertDialogTitleProps, ["class"]);
  return (
    <AlertDialogPrimitive.Title
      class={cn(
        "font-semibold text-lg leading-none tracking-tight",
        props.class,
      )}
      {...rest}
    />
  );
};

type AlertDialogDescriptionProps =
  AlertDialogPrimitive.AlertDialogDescriptionProps & {
    class?: string | undefined;
  };

const AlertDialogDescription = <T extends ValidComponent = "p">(
  props: PolymorphicProps<T, AlertDialogDescriptionProps>,
) => {
  const [, rest] = splitProps(props as AlertDialogDescriptionProps, ["class"]);
  return (
    <AlertDialogPrimitive.Description
      class={cn("text-muted-foreground text-sm", props.class)}
      {...rest}
    />
  );
};

type AlertDialogCancelProps =
  AlertDialogPrimitive.AlertDialogCloseButtonProps & {
    class?: string | undefined;
  };

const AlertDialogCancel = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, AlertDialogCancelProps>,
) => {
  const [, rest] = splitProps(props as AlertDialogCancelProps, ["class"]);
  return (
    <AlertDialogPrimitive.CloseButton
      class={cn(buttonVariants({ variant: "outline" }), props.class)}
      {...rest}
    />
  );
};

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
};
