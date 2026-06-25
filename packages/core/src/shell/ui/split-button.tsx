import * as ButtonPrimitive from "@kobalte/core/button";
import type { VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-solid";
import { type JSX, splitProps } from "solid-js";
import { cn } from "../lib/shadcn/utils";
import { buttonVariants } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";

type SplitButtonVariant = VariantProps<typeof buttonVariants>["variant"];
type SplitButtonSize = VariantProps<typeof buttonVariants>["size"];

type SplitButtonProps = {
  /** Content of the main button */
  children: JSX.Element;
  /** Dropdown menu items (DropdownMenuItem, DropdownMenuSeparator, etc.) */
  menuContent: JSX.Element;
  /** Click handler for the main button */
  onClick?: () => void;
  /** Button variant — applied to both halves */
  variant?: SplitButtonVariant;
  /** Button size — applied to both halves */
  size?: SplitButtonSize;
  /** Disable both buttons */
  disabled?: boolean;
  /** Type attribute for the main button */
  type?: "button" | "submit" | "reset";
  /** Additional class for the root container */
  class?: string;
  /** Additional class for the main button */
  buttonClass?: string;
  /** Additional class for the dropdown trigger */
  triggerClass?: string;
  /** Additional class for the dropdown content */
  contentClass?: string;
  /** Test ID for Playwright */
  testId?: string;
};

const splitTriggerSize: Record<string, string> = {
  default: "size-10",
  sm: "size-9",
  lg: "size-11",
  icon: "size-10",
};

export function SplitButton(props: SplitButtonProps) {
  const [local] = splitProps(props, [
    "children",
    "menuContent",
    "onClick",
    "variant",
    "size",
    "disabled",
    "type",
    "class",
    "buttonClass",
    "triggerClass",
    "contentClass",
    "testId",
  ]);

  const sizeKey = () => local.size ?? "default";

  return (
    <div class={cn("inline-flex", local.class)} data-testid={local.testId}>
      {/* Main action button */}
      <ButtonPrimitive.Root
        type={local.type ?? "button"}
        disabled={local.disabled}
        onClick={local.onClick}
        class={cn(
          buttonVariants({ variant: local.variant, size: local.size }),
          "rounded-r-none border-r-0",
          local.buttonClass,
        )}
        data-testid={local.testId ? `${local.testId}-action` : undefined}
      >
        {local.children}
      </ButtonPrimitive.Root>

      {/* Dropdown trigger */}
      <DropdownMenu>
        <DropdownMenuTrigger
          as="button"
          type="button"
          disabled={local.disabled}
          class={cn(
            buttonVariants({ variant: local.variant }),
            "rounded-l-none border-l border-l-current/20 px-0",
            splitTriggerSize[sizeKey()],
            local.triggerClass,
          )}
          data-testid={local.testId ? `${local.testId}-trigger` : undefined}
        >
          <ChevronDown class="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent class={local.contentClass}>
          {local.menuContent}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
