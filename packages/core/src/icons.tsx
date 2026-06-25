import {
  Show,
  createSignal,
  onCleanup,
  onMount,
  splitProps,
  type Component,
  type JSX,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import { cn } from "./ui";

export type IconName =
  | "arrow-left"
  | "arrow-right"
  | "chevron-right"
  | "laptop"
  | "layout-dashboard"
  | "log-out"
  | "menu"
  | "moon"
  | "panel-left"
  | "panel-left-close"
  | "pencil"
  | "plus"
  | "shield"
  | "sun"
  | "trash";

type IconComponent = Component<JSX.SvgSVGAttributes<SVGSVGElement>>;

const iconLoaders = {
  "arrow-left": async () => (await import("lucide-solid")).ArrowLeftIcon,
  "arrow-right": async () => (await import("lucide-solid")).ArrowRightIcon,
  "chevron-right": async () => (await import("lucide-solid")).ChevronRightIcon,
  laptop: async () => (await import("lucide-solid")).LaptopIcon,
  "layout-dashboard": async () =>
    (await import("lucide-solid")).LayoutDashboardIcon,
  "log-out": async () => (await import("lucide-solid")).LogOutIcon,
  menu: async () => (await import("lucide-solid")).MenuIcon,
  moon: async () => (await import("lucide-solid")).MoonIcon,
  "panel-left": async () => (await import("lucide-solid")).PanelLeftIcon,
  "panel-left-close": async () =>
    (await import("lucide-solid")).PanelLeftCloseIcon,
  pencil: async () => (await import("lucide-solid")).PencilIcon,
  plus: async () => (await import("lucide-solid")).PlusIcon,
  shield: async () => (await import("lucide-solid")).ShieldIcon,
  sun: async () => (await import("lucide-solid")).SunIcon,
  trash: async () => (await import("lucide-solid")).Trash2Icon,
} satisfies Record<IconName, () => Promise<IconComponent>>;

export type IconProps = JSX.SvgSVGAttributes<SVGSVGElement> & {
  name: IconName;
};

export function Icon(props: IconProps) {
  const [local, others] = splitProps(props, ["name", "class", "aria-hidden"]);
  const [LoadedIcon, setLoadedIcon] = createSignal<IconComponent>();

  onMount(() => {
    let mounted = true;

    void iconLoaders[local.name]().then((icon) => {
      if (mounted) {
        setLoadedIcon(() => icon);
      }
    });

    onCleanup(() => {
      mounted = false;
    });
  });

  return (
    <Show
      when={LoadedIcon()}
      fallback={
        <span
          aria-hidden={local["aria-hidden"] ?? "true"}
          class={cn("ui-icon", local.class)}
        />
      }
    >
      {(Loaded) => (
        <Dynamic
          component={Loaded()}
          aria-hidden={local["aria-hidden"] ?? "true"}
          class={cn("ui-icon", local.class)}
          {...others}
        />
      )}
    </Show>
  );
}
