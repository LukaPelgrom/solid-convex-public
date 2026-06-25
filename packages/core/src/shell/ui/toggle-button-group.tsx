import * as ButtonPrimitive from "@kobalte/core/button";
import { type Component, createMemo, For, type JSX, Show } from "solid-js";
import { cn } from "../lib/shadcn/utils";
import { getContrastTextColor, isValidColor } from "../lib/utils/color";

// Test ID prefix for Playwright
const TEST_ID_PREFIX = "toggle-button-group";

export type ToggleButtonGroupOption<T> = T;

export type ToggleButtonGroupProps<T> = {
  /** Array of options to display */
  options: T[];
  /** Current selected value (single mode) or values (multiple mode) */
  value?: T | T[];
  /** Callback when selection changes */
  onChange?: (value: T | T[] | undefined) => void;

  /** Key to use as the unique identifier for each option */
  optionValue?: keyof T;
  /** Key to use as the display label for each option */
  optionLabel?: keyof T;
  /** Key to use for button color when selected (hex, rgb, hsl) */
  optionColor?: keyof T;
  /** Key to check if option is disabled */
  optionDisabled?: keyof T;
  /** Key to use for icon component */
  optionIcon?: keyof T;

  /** Enable multiple selection mode (default: false for single-select) */
  multiple?: boolean;
  /** Disabled state for entire group */
  disabled?: boolean;

  /** Button variant style */
  variant?: "default" | "outline" | "ghost" | "secondary";
  /** Button size */
  size?: "default" | "sm" | "lg" | "icon";
  /** Layout orientation */
  orientation?: "horizontal" | "vertical";

  /** Custom render function for option content */
  renderOption?: (option: T, isSelected: boolean) => JSX.Element;

  /** Additional class for the root container */
  class?: string;

  /** Base test ID for Playwright (will be prefixed with toggle-button-group-) */
  testId?: string;
};

export function ToggleButtonGroup<T>(props: ToggleButtonGroupProps<T>) {
  // Generate test IDs
  const baseTestId = () =>
    props.testId ? `${TEST_ID_PREFIX}-${props.testId}` : TEST_ID_PREFIX;

  // Determine if options are objects or primitives
  const isObjectOptions = createMemo(() => {
    return (
      props.options.length > 0 &&
      typeof props.options[0] === "object" &&
      props.options[0] !== null
    );
  });

  // Get the value of an option
  const getOptionValue = (option: T): string => {
    if (isObjectOptions() && props.optionValue) {
      return String(option[props.optionValue]);
    }
    return String(option);
  };

  // Get the label of an option
  const getOptionLabel = (option: T): string => {
    if (isObjectOptions() && props.optionLabel) {
      return String(option[props.optionLabel]);
    }
    return String(option);
  };

  // Get the color of an option
  const getOptionColor = (option: T): string | undefined => {
    if (isObjectOptions() && props.optionColor) {
      const color = option[props.optionColor];
      return typeof color === "string" ? color : undefined;
    }
    return undefined;
  };

  // Get the icon component of an option
  const getOptionIcon = (
    option: T,
  ): Component<JSX.IntrinsicElements["svg"]> | undefined => {
    if (isObjectOptions() && props.optionIcon) {
      const icon = option[props.optionIcon];
      return typeof icon === "function"
        ? (icon as Component<JSX.IntrinsicElements["svg"]>)
        : undefined;
    }
    return undefined;
  };

  // Check if an option is disabled
  const isOptionDisabled = (option: T): boolean => {
    if (props.disabled) return true;
    if (isObjectOptions() && props.optionDisabled) {
      return Boolean(option[props.optionDisabled]);
    }
    return false;
  };

  // Check if an option is selected
  const isSelected = (option: T): boolean => {
    const optionVal = getOptionValue(option);

    if (props.multiple) {
      const values = props.value as T[] | undefined;
      if (!values || !Array.isArray(values)) return false;
      return values.some((v) => getOptionValue(v) === optionVal);
    }

    if (props.value === undefined || props.value === null) return false;
    return getOptionValue(props.value as T) === optionVal;
  };

  // Handle option selection
  const handleSelect = (option: T) => {
    if (isOptionDisabled(option)) return;

    if (props.multiple) {
      const currentValues = (props.value as T[] | undefined) || [];
      const optionVal = getOptionValue(option);
      const isCurrentlySelected = currentValues.some(
        (v) => getOptionValue(v) === optionVal,
      );

      if (isCurrentlySelected) {
        // Remove from selection
        const newValues = currentValues.filter(
          (v) => getOptionValue(v) !== optionVal,
        );
        props.onChange?.(newValues.length > 0 ? newValues : undefined);
      } else {
        // Add to selection
        props.onChange?.([...currentValues, option]);
      }
    } else {
      // Single select mode - toggle behavior
      const isCurrentlySelected = isSelected(option);
      if (isCurrentlySelected) {
        props.onChange?.(undefined);
      } else {
        props.onChange?.(option);
      }
    }
  };

  // Button variant classes
  const getButtonClasses = (isPressed: boolean, optionColor?: string) => {
    const base =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variant = props.variant ?? "outline";
    const size = props.size ?? "default";

    // If custom color and pressed, we'll apply it via style
    const hasCustomColor = isPressed && optionColor;

    const pressedClass = (
      customColorClass: string,
      defaultClass: string,
    ): string | undefined => {
      if (!isPressed) return undefined;
      if (hasCustomColor) return customColorClass;
      return defaultClass;
    };

    const variantClasses = {
      default:
        pressedClass(
          "",
          "bg-primary text-primary-foreground hover:bg-primary/90",
        ) ??
        "bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
      outline:
        pressedClass(
          "border",
          "border border-primary bg-primary text-primary-foreground hover:bg-primary/90",
        ) ?? "border border-input hover:bg-accent hover:text-accent-foreground",
      ghost:
        pressedClass("", "bg-accent text-accent-foreground") ??
        "hover:bg-accent hover:text-accent-foreground",
      secondary:
        pressedClass(
          "",
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ) ?? "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    };

    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3 text-xs",
      lg: "h-11 px-8",
      icon: "size-10",
    };

    return cn(base, variantClasses[variant], sizeClasses[size]);
  };

  // Container classes for button group styling
  const containerClasses = () => {
    const orientation = props.orientation ?? "horizontal";

    return cn(
      "flex overflow-auto flex-wrap gap-1",
      orientation === "vertical" ? "flex-col" : "flex-row",
      // All buttons get rounded corners when wrapping
      "[&>button]:rounded-md",
      props.class,
    );
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: custom toggle button group implementation
    <div class={containerClasses()} role="group" data-testid={baseTestId()}>
      <For each={props.options}>
        {(option) => {
          const selected = () => isSelected(option);
          const disabled = () => isOptionDisabled(option);
          const color = () => getOptionColor(option);
          const Icon = () => getOptionIcon(option);

          // Get color styles for selected state
          const colorStyles = () => {
            const c = color();
            if (!selected() || !c || !isValidColor(c)) return undefined;
            return {
              "background-color": c,
              "border-color": c,
              color: getContrastTextColor(c),
            };
          };

          return (
            <ButtonPrimitive.Root
              type="button"
              aria-pressed={selected()}
              disabled={disabled()}
              class={cn(
                getButtonClasses(selected(), color()),
                disabled() && "cursor-not-allowed opacity-50",
              )}
              style={colorStyles()}
              onClick={() => handleSelect(option)}
              data-testid={`${baseTestId()}-option-${getOptionValue(option)}`}
            >
              <Show
                when={props.renderOption}
                fallback={
                  <>
                    <Show when={Icon()}>
                      {(IconComponent) => {
                        const Comp = IconComponent() as Component<
                          JSX.IntrinsicElements["svg"]
                        >;
                        return <Comp class="size-4 shrink-0" />;
                      }}
                    </Show>
                    <Show when={!Icon() || props.size !== "icon"}>
                      <span>{getOptionLabel(option)}</span>
                    </Show>
                  </>
                }
              >
                {props.renderOption?.(option, selected())}
              </Show>
            </ButtonPrimitive.Root>
          );
        }}
      </For>
    </div>
  );
}

export default ToggleButtonGroup;
