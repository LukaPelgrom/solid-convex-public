import * as AlertPrimitive from "@kobalte/core/alert";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { Component, ComponentProps, ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

import { cn } from "../lib/shadcn/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:top-4 [&>svg]:left-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "border-border bg-background text-foreground",
        destructive:
          "border-destructive/50 bg-destructive/5 text-destructive dark:border-destructive dark:bg-destructive/10 [&>svg]:text-destructive",
        success:
          "border-green-500/50 bg-green-50 text-green-700 dark:border-green-400 dark:bg-green-950/20 dark:text-green-400 [&>svg]:text-green-600 dark:[&>svg]:text-green-400",
        warning:
          "border-yellow-500/50 bg-yellow-50 text-yellow-700 dark:border-yellow-400 dark:bg-yellow-950/20 dark:text-yellow-400 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400",
        info: "border-blue-500/50 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/20 dark:text-blue-400 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400",
        secondary:
          "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/20 dark:text-slate-300 [&>svg]:text-slate-600 dark:[&>svg]:text-slate-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type AlertRootProps<T extends ValidComponent = "div"> =
  AlertPrimitive.AlertRootProps<T> &
    VariantProps<typeof alertVariants> & { class?: string | undefined };

const Alert = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AlertRootProps<T>>,
) => {
  const [local, others] = splitProps(props as AlertRootProps, [
    "class",
    "variant",
  ]);
  return (
    <AlertPrimitive.Root
      class={cn(alertVariants({ variant: props.variant }), local.class)}
      {...others}
    />
  );
};

const AlertTitle: Component<ComponentProps<"h5">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <h5
      class={cn("mb-1 font-medium leading-none tracking-tight", local.class)}
      {...others}
    />
  );
};

const AlertDescription: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div class={cn("text-sm [&_p]:leading-relaxed", local.class)} {...others} />
  );
};

export { Alert, AlertTitle, AlertDescription };
