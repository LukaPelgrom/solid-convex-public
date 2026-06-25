import { createKeyHold } from "@solid-primitives/keyboard";
import { createMousePosition } from "@solid-primitives/mouse";
import {
  type Component,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  Show,
} from "solid-js";
import { cn } from "../lib/shadcn/utils";

type SnapPreviewZonesProps = {
  isDragging: boolean;
  onSnap: (props: {
    left: number;
    top: number;
    width: number;
    height: number;
  }) => void;
};

export const SnapPreviewZones: Component<SnapPreviewZonesProps> = (props) => {
  const pos = createMousePosition(window);
  const isShiftPressed = createKeyHold("Shift", { preventDefault: false });

  // Debounce the resize handler
  const [dimensions, setDimensions] = createSignal({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Memoize half width calculation
  const halfWidth = createMemo(() => dimensions().width / 2);

  // Memoize zone checks
  const isMouseInLeftZone = createMemo(() => pos.x < halfWidth());
  const isMouseInRightZone = createMemo(() => pos.x >= halfWidth());

  // Memoize styles for better performance
  const leftZoneStyle = createMemo(() => ({
    left: "0",
    top: "0",
    width: `${halfWidth()}px`,
    height: "100%",
  }));

  const rightZoneStyle = createMemo(() => ({
    left: `${halfWidth()}px`,
    top: "0",
    width: `${halfWidth()}px`,
    height: "100%",
  }));

  // Left mouse button event handler
  createEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0 && isShiftPressed() && props.isDragging) {
        // Left mouse button released
        if (isMouseInLeftZone()) {
          props.onSnap({
            left: 0,
            top: 0,
            width: halfWidth(),
            height: dimensions().height,
          });
        }
        if (isMouseInRightZone()) {
          props.onSnap({
            left: halfWidth(),
            top: 0,
            width: halfWidth(),
            height: dimensions().height,
          });
        }
      }
    };

    window.addEventListener("mouseup", handleMouseUp);

    onCleanup(() => {
      window.removeEventListener("mouseup", handleMouseUp);
    });
  });

  // Optimize resize handler with debounce
  createEffect(() => {
    let timeoutId: number;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 100); // 100ms debounce
    };

    window.addEventListener("resize", handleResize, { passive: true });
    onCleanup(() => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    });
  });

  return (
    <Show when={props.isDragging && isShiftPressed()}>
      <div class="pointer-events-none fixed inset-0">
        {/* Left half zone */}
        <div
          class={cn(
            "absolute border-2 border-primary/30 border-dashed transition-colors duration-200",
            isMouseInLeftZone() ? "bg-primary/30" : "bg-primary/10",
          )}
          style={leftZoneStyle()}
        />
        {/* Right half zone */}
        <div
          class={cn(
            "absolute border-2 border-primary/30 border-dashed transition-colors duration-200",
            isMouseInRightZone() ? "bg-primary/30" : "bg-primary/10",
          )}
          style={rightZoneStyle()}
        />
      </div>
    </Show>
  );
};
