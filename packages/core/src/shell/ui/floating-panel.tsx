import { FloatingPanel } from "@ark-ui/solid/floating-panel";
import { ArrowDownLeft, Maximize2, Minus, XIcon } from "lucide-solid";
import type { Accessor, Component, ComponentProps, Setter } from "solid-js";
import { createContext, createSignal, splitProps, useContext } from "solid-js";
import { Portal } from "solid-js/web";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

import { useBindSignal } from "../hooks/use-bind-signal";
import { cn } from "../lib/shadcn/utils";
import { SnapPreviewZones } from "./SnapPreviewZones";

// Debounce utility
// oxlint-disable-next-line typescript/no-explicit-any -- Generic constraint requires any[] for rest params to preserve parameter inference via Parameters<T>
function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Debounced loggers

const logPosition = debounce((_position: { x: number; y: number }) => {}, 500);

type FloatingPanelSize = {
  width: number;
  height: number;
};

type FloatingPanelStage = "default" | "minimized" | "maximized";

type FloatingPanelRootProps = ComponentProps<typeof FloatingPanel.Root> & {
  size?: FloatingPanelSize;
  onSizeChange?: (details: { size: FloatingPanelSize }) => void;
  open?: boolean;
  minSize?: { width: number; height: number };
  onOpenChange?: (defaults: { open: boolean }) => void;
  onStageChange?: (stage: FloatingPanelStage) => void;
  position?: { x: number; y: number };
  onPositionChange?: (position: { x: number; y: number }) => void;
};

type FloatingPanelContextType = {
  stage: Accessor<FloatingPanelStage>;
  setStage: Setter<FloatingPanelStage>;
  position: Accessor<{ x: number; y: number }>;
  setPosition: Setter<{ x: number; y: number }>;
  size: Accessor<FloatingPanelSize>;
  setSize: Setter<FloatingPanelSize>;
  open: Accessor<boolean>;
  setOpen: Setter<boolean>;
  headerHover: Accessor<boolean>;
  setHeaderHover: Setter<boolean>;
};

const FloatingPanelContext = createContext<FloatingPanelContextType>();

export const useFloatingPanel = () => {
  const context = useContext(FloatingPanelContext);
  if (!context) {
    throw new Error("useFloatingPanel must be used within a FloatingPanel");
  }
  return context;
};

const FloatingPanelRoot: Component<FloatingPanelRootProps> = (props) => {
  const [stage, setStage] = createSignal<"default" | "minimized" | "maximized">(
    "default",
  );
  const [size, setSize] = createSignal<FloatingPanelSize>(
    props.size || {
      width: 400,
      height: 300,
    },
  );

  const [open, setOpen] = useBindSignal({
    value: () => props.open ?? false,
    setValue: (value: boolean) => {
      props.onOpenChange?.({ open: value });
    },
  });

  const [position, setPosition] = useBindSignal<{ x: number; y: number }>({
    value: () => props.position || { x: 0, y: 0 },
    setValue: (value: { x: number; y: number }) => {
      props.onPositionChange?.(value);
    },
  });

  const [headerHover, setHeaderHover] = createSignal(false);

  return (
    <FloatingPanelContext.Provider
      value={{
        headerHover,
        setHeaderHover,
        stage,
        setStage,
        position,
        setPosition,
        size,
        setSize,
        open,
        setOpen,
      }}
    >
      <FloatingPanel.Root
        {...props}
        minSize={props.minSize || { width: 400, height: 300 }}
        onOpenChange={(e: { open: boolean }) => {
          setOpen(e.open);
        }}
        onPositionChange={(e: { position: { x: number; y: number } }) => {
          logPosition(e.position);
          setPosition(e.position);
        }}
        onSizeChange={(e: { size: FloatingPanelSize }) => {
          setSize(e.size);
        }}
        onStageChange={(e: { stage: FloatingPanelStage }) => {
          setStage(e.stage);
          props.onStageChange?.(e.stage);
        }}
        open={open()}
        position={position()}
        size={size()}
      />
    </FloatingPanelContext.Provider>
  );
};

const FloatingPanelTrigger = FloatingPanel.Trigger;

const FloatingPanelTitle: Component<ComponentProps<"h2">> = (props) => {
  const [, rest] = splitProps(props, ["class"]);

  return (
    <FloatingPanel.Title
      class={cn(
        "font-semibold text-lg leading-none tracking-tight",
        props.class,
      )}
      {...rest}
    />
  );
};

const FloatingPanelBody: Component<ComponentProps<"div">> = (props) => {
  const [, rest] = splitProps(props, ["class"]);
  return (
    <FloatingPanel.Body
      class={cn("relative flex-1 overflow-auto", props.class)}
      {...rest}
    />
  );
};

const FloatingPanelControl: Component<ComponentProps<"div">> = (props) => {
  const [, rest] = splitProps(props, ["class"]);

  return (
    <FloatingPanel.Control
      class={cn("flex items-center gap-2", props.class)}
      {...rest}
    >
      <Tooltip>
        <TooltipTrigger>
          {" "}
          <FloatingPanel.StageTrigger
            class="inline-flex h-6 w-6 appearance-none items-center justify-center rounded-sm bg-background p-0 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            stage="minimized"
          >
            <Minus class="h-4 w-4" />
          </FloatingPanel.StageTrigger>
        </TooltipTrigger>
        <TooltipContent>Minimize</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <FloatingPanel.StageTrigger
            class="inline-flex h-6 w-6 appearance-none items-center justify-center rounded-sm bg-background p-0 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            stage="maximized"
          >
            <Maximize2 class="h-4 w-4" />
          </FloatingPanel.StageTrigger>
        </TooltipTrigger>
        <TooltipContent>Maximize</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <FloatingPanel.StageTrigger
            class="inline-flex h-6 w-6 appearance-none items-center justify-center rounded-sm bg-background p-0 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            stage={"default"}
          >
            <ArrowDownLeft class="h-4 w-4" />
          </FloatingPanel.StageTrigger>
        </TooltipTrigger>
        <TooltipContent>Restore</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <FloatingPanel.CloseTrigger class="inline-flex h-6 w-6 appearance-none items-center justify-center rounded-sm bg-background p-0 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <XIcon class="h-4 w-4" />
          </FloatingPanel.CloseTrigger>
        </TooltipTrigger>
        <TooltipContent>Close</TooltipContent>
      </Tooltip>

      {props.children}
    </FloatingPanel.Control>
  );
};

const FloatingPanelHeader: Component<
  ComponentProps<"div"> & { title?: string }
> = (props) => {
  const [, rest] = splitProps(props, ["class", "title", "children"]);
  const { stage, setHeaderHover } = useFloatingPanel();
  return (
    <FloatingPanel.DragTrigger
      onMouseEnter={() => setHeaderHover(true)}
      onMouseLeave={() => setHeaderHover(false)}
    >
      <div class="floating-panel-header">
        <FloatingPanel.Header
          class={cn(
            "flex flex-col space-y-1.5",
            stage() === "minimized" && "pb-12",
            props.class,
          )}
          {...rest}
        >
          <div class="flex items-center justify-between">
            <FloatingPanelTitle>
              {props.title || "Floating Panel"}
            </FloatingPanelTitle>
            <FloatingPanelControl />
          </div>
          {props.children}
        </FloatingPanel.Header>
      </div>
    </FloatingPanel.DragTrigger>
  );
};

const FloatingPanelFooter: Component<ComponentProps<"div">> = (props) => {
  const [, rest] = splitProps(props, ["class"]);
  return <div class={cn("mt-auto", props.class)} {...rest} />;
};

const FloatingPanelContent: Component<ComponentProps<"div">> = (props) => {
  const [, rest] = splitProps(props, ["class", "children"]);
  const { setPosition, setSize, headerHover } = useFloatingPanel();

  return (
    <Portal>
      <SnapPreviewZones
        isDragging={headerHover()}
        onSnap={(props) => {
          setPosition({
            x: props.left,
            y: props.top,
          });
          setSize({
            width: props.width,
            height: props.height,
          });
        }}
      />
      <FloatingPanel.Positioner class="z-50">
        <FloatingPanel.Content
          class={cn(
            "relative flex flex-col gap-4 overflow-hidden rounded-md border bg-background outline-none",
            "p-6",
            "data-[topmost]:z-50 data-[behind]:opacity-40 data-[topmost]:shadow-lg",
            "z-50",
            props.class,
          )}
          {...rest}
        >
          {props.children}

          {/* @ts-ignore */}
          <FloatingPanel.ResizeTrigger axis="n" />
          {/* @ts-ignore */}
          <FloatingPanel.ResizeTrigger axis="e" />
          {/* @ts-ignore */}
          <FloatingPanel.ResizeTrigger axis="w" />
          {/* @ts-ignore */}
          <FloatingPanel.ResizeTrigger axis="s" />
          {/* @ts-ignore */}
          <FloatingPanel.ResizeTrigger axis="ne" />
          {/* @ts-ignore */}
          <FloatingPanel.ResizeTrigger axis="se" />
          {/* @ts-ignore */}
          <FloatingPanel.ResizeTrigger axis="sw" />
          {/* @ts-ignore */}
          <FloatingPanel.ResizeTrigger axis="nw" />
        </FloatingPanel.Content>
      </FloatingPanel.Positioner>
    </Portal>
  );
};

export {
  FloatingPanelRoot as FloatingPanel,
  FloatingPanelBody,
  FloatingPanelContent,
  FloatingPanelControl,
  FloatingPanelFooter,
  FloatingPanelHeader,
  FloatingPanelTitle,
  FloatingPanelTrigger,
};
