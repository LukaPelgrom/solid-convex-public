import { For } from "solid-js";
import { cn } from "../lib/shadcn/utils";

export type StepIndicatorProps = {
  steps: string[];
  currentStep: number;
};

export default function StepIndicator(props: StepIndicatorProps) {
  return (
    <div class="flex items-center gap-2">
      <For each={props.steps}>
        {(label, index) => {
          const stepNumber = () => index() + 1;
          const isActive = () => stepNumber() === props.currentStep;
          const isCompleted = () => stepNumber() < props.currentStep;

          return (
            <>
              {index() > 0 && (
                <div
                  class={cn(
                    "h-px flex-1 max-w-8",
                    isCompleted() || isActive()
                      ? "bg-primary"
                      : "bg-muted-foreground/30",
                  )}
                />
              )}
              <div class="flex items-center gap-1.5">
                <div
                  class={cn(
                    "flex size-6 items-center justify-center rounded-full text-xs font-medium transition-colors",
                    isActive() && "bg-primary text-primary-foreground",
                    isCompleted() && "bg-primary text-primary-foreground",
                    !isActive() &&
                      !isCompleted() &&
                      "bg-muted text-muted-foreground",
                  )}
                >
                  {stepNumber()}
                </div>
                <span
                  class={cn(
                    "text-sm transition-colors",
                    isActive()
                      ? "font-medium text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </div>
            </>
          );
        }}
      </For>
    </div>
  );
}
