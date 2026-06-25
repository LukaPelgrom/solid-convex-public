import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "../lib/shadcn/utils";

export type TextareaProps = JSX.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  class?: string;
};

export function Textarea(props: TextareaProps) {
  const [local, others] = splitProps(props, ["class"]);

  return <textarea class={cn("textarea", local.class)} {...others} />;
}
