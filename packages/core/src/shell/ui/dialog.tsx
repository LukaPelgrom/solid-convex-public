import * as DialogPrimitive from "@kobalte/core/dialog";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { Component, ComponentProps, JSX, ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

import { cn } from "../lib/shadcn/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal: Component<DialogPrimitive.DialogPortalProps> = (props) => {
  const [, rest] = splitProps(props, ["children"]);
  return (
    <DialogPrimitive.Portal {...rest}>
      <div class="dialog-portal">{props.children}</div>
    </DialogPrimitive.Portal>
  );
};

type DialogOverlayProps = DialogPrimitive.DialogOverlayProps & {
  class?: string | undefined;
};

const DialogOverlay = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DialogOverlayProps>,
) => {
  const [, rest] = splitProps(props as DialogOverlayProps, ["class"]);
  return (
    <DialogPrimitive.Overlay
      class={cn("dialog-overlay", props.class)}
      {...rest}
    />
  );
};

type DialogContentProps = DialogPrimitive.DialogContentProps & {
  class?: string | undefined;
  overflowY?: "auto" | "none" | undefined;
  children?: JSX.Element;
};

const DialogContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DialogContentProps>,
) => {
  const [, rest] = splitProps(props as DialogContentProps, [
    "class",
    "children",
    "overflowY",
  ]);
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        class={cn(
          "dialog-content",
          props.class,
          props.overflowY === "none"
            ? "dialog-content--overflow-none"
            : "dialog-content--overflow-auto",
        )}
        {...rest}
      >
        {props.children}
        <DialogPrimitive.CloseButton class="dialog-close-button">
          <svg
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
          </svg>
          <span class="sr-only">Sluiten</span>
        </DialogPrimitive.CloseButton>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
};

const DialogHeader: Component<ComponentProps<"div">> = (props) => {
  const [, rest] = splitProps(props, ["class"]);
  return (
    <div
      class={cn("flex flex-col items-start space-y-1.5 text-left", props.class)}
      {...rest}
    />
  );
};

const DialogFooter: Component<ComponentProps<"div">> = (props) => {
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

const DialogCloseButton: Component<ComponentProps<"div">> = (props) => {
  return (
    <DialogPrimitive.CloseButton>{props.children}</DialogPrimitive.CloseButton>
  );
};

type DialogTitleProps = DialogPrimitive.DialogTitleProps & {
  class?: string | undefined;
};

const DialogTitle = <T extends ValidComponent = "h2">(
  props: PolymorphicProps<T, DialogTitleProps>,
) => {
  const [, rest] = splitProps(props as DialogTitleProps, ["class"]);
  return (
    <DialogPrimitive.Title
      class={cn(
        "font-semibold text-lg leading-none tracking-tight",
        props.class,
      )}
      {...rest}
    />
  );
};

type DialogDescriptionProps = DialogPrimitive.DialogDescriptionProps & {
  class?: string | undefined;
};

const DialogDescription = <T extends ValidComponent = "p">(
  props: PolymorphicProps<T, DialogDescriptionProps>,
) => {
  const [, rest] = splitProps(props as DialogDescriptionProps, ["class"]);
  return (
    <DialogPrimitive.Description
      class={cn("text-muted-foreground text-sm", props.class)}
      {...rest}
    />
  );
};

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogCloseButton,
  DialogTitle,
  DialogDescription,
};
