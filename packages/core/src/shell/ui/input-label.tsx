import { Show } from "solid-js";
import { cn } from "../lib/shadcn/utils";

type InputLabelProps = {
  /**
   * The ID of the form control this label is associated with.
   * This must match the id attribute of the form control.
   */
  name: string;
  /**
   * The visible label text
   */
  label?: string;
  /**
   * Whether the associated form control is required
   */
  required?: boolean;
  /**
   * Additional CSS classes for the label element
   */
  class?: string;
  /**
   * Additional CSS classes for the required indicator
   */
  requiredClass?: string;
  /**
   * Whether the associated form control is disabled
   */
  disabled?: boolean;
};

/**
 * Accessible input label for a form field.
 *
 * @example
 * ```tsx
 * <InputLabel
 *   for="email"
 *   label="Email Address"
 *   required={true}
 * />
 * <input
 *   id="email"
 *   name="email"
 * />
 * <div id="email-hint">Please enter your work email</div>
 * ```
 */
export function InputLabel(props: InputLabelProps) {
  return (
    <Show when={props.label}>
      <label
        class={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center",
          props.disabled && "text-muted-foreground",
          props.class,
        )}
        aria-disabled={props.disabled}
        for={props.name}
      >
        {props.label}

        <Show when={props.required}>
          <span
            aria-hidden="true" // since it's decorative (screen readers will use aria-required on the label instead)
            class={cn(
              "text-red-600 dark:text-red-400 cursor-help p-1",
              props.requiredClass,
            )}
            title="Verplicht veld"
          >
            *
          </span>
        </Show>
      </label>
    </Show>
  );
}
