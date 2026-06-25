import { Search } from "lucide-solid";
import {
  type Component,
  type ComponentProps,
  type JSX,
  Show,
  splitProps,
} from "solid-js";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { cn } from "../lib/shadcn/utils";
import { Input } from "./input";

export type SearchInputProps = ComponentProps<"input"> & {
  wrapperClass?: string;
  tooltipText?: JSX.Element;
};
const SearchInput: Component<SearchInputProps> = (props) => {
  const [local, others] = splitProps(props, [
    "type",
    "class",
    "wrapperClass",
    "tooltipText",
  ]);
  return (
    <div class={cn("relative h-fit", local.wrapperClass)}>
      <Show
        fallback={
          <Search class="absolute top-[50%] left-2 h-4 w-4 translate-y-[-50%] text-muted-foreground" />
        }
        when={local.tooltipText}
      >
        <Tooltip placement="top-end">
          <TooltipTrigger
            class={cn(
              "absolute top-[50%] left-1 h-4 w-4 translate-y-[-50%] text-muted-foreground",
            )}
          >
            <Search class="absolute top-[50%] left-2 h-4 w-4 translate-y-[-50%] text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>{local.tooltipText}</TooltipContent>
        </Tooltip>
      </Show>
      <Input
        class={cn("w-full pl-8", local.class)}
        placeholder="Zoeken"
        type={local.type}
        {...others}
      />
    </div>
  );
};

export default SearchInput;
