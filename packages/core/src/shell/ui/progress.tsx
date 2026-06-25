import { type Component, type JSX, splitProps } from "solid-js";
import { cn } from "../lib/shadcn/utils";

export interface ProgressProps extends JSX.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}

const Progress: Component<ProgressProps> = (props) => {
  const [local, others] = splitProps(props, ["value", "max", "class"]);

  const value = () => local.value ?? 0;
  const max = () => local.max ?? 100;
  const percentage = () => Math.min(100, Math.max(0, (value() / max()) * 100));

  return (
    <div
      class={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
        local.class,
      )}
      {...others}
    >
      <div
        class="h-full w-full flex-1 bg-primary transition-all duration-300 ease-in-out"
        style={{ width: `${percentage()}%` }}
      />
    </div>
  );
};

export { Progress };
