import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as TooltipPrimitive from "@kobalte/core/tooltip";
import type { ValidComponent } from "solid-js";
import { type Component, Show, splitProps } from "solid-js";

import { cn } from "../lib/shadcn/utils";

const TooltipTrigger = TooltipPrimitive.Trigger;

const Tooltip: Component<TooltipPrimitive.TooltipRootProps> = (props) => (
  <TooltipPrimitive.Root gutter={4} {...props} />
);
type TooltipContentProps = TooltipPrimitive.TooltipContentProps & {
  class?: string | undefined;
};

const TooltipContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, TooltipContentProps> & {
    show?: boolean;
  },
) => {
  const [local, others] = splitProps(props as TooltipContentProps, ["class"]);
  return (
    <TooltipPrimitive.Portal>
      <Show when={props?.show ?? true}>
        <TooltipPrimitive.Content
          class={cn(
            "fade-in-0 zoom-in-95 z-50 origin-[var(--kb-popover-content-transform-origin)] animate-in overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-popover-foreground text-sm shadow-md",
            local.class,
          )}
          {...others}
        />
      </Show>
    </TooltipPrimitive.Portal>
  );
};
export { Tooltip, TooltipTrigger, TooltipContent };
