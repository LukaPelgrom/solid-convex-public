import type { CollapsibleContentProps } from "@kobalte/core/collapsible";
import { Collapsible as CollapsiblePrimitive } from "@kobalte/core/collapsible";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { ValidComponent } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "../lib/shadcn/utils";

const Collapsible = CollapsiblePrimitive;

const CollapsibleTrigger = CollapsiblePrimitive.Trigger;

type collapsibleContentProps<T extends ValidComponent = "div"> =
  CollapsibleContentProps<T> & {
    class?: string;
  };

const CollapsibleContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, collapsibleContentProps<T>>,
) => {
  const [local, rest] = splitProps(props as collapsibleContentProps, ["class"]);

  return (
    <CollapsiblePrimitive.Content
      class={cn("collapsible-content overflow-hidden", local.class)}
      {...rest}
    />
  );
};

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
