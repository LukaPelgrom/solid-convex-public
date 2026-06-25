import type { Component, ComponentProps } from "solid-js";
import { splitProps } from "solid-js";

import { cn } from "../lib/shadcn/utils";

const Input: Component<ComponentProps<"input">> = (props) => {
  const [local, others] = splitProps(props, ["type", "class"]);
  return (
    <input
      class={cn(
        "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        local.class,
      )}
      type={local.type}
      {...others}
    />
  );
};

export { Input };
