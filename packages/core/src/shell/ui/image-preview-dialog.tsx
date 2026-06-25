import { createShortcut } from "@solid-primitives/keyboard";
import { ZoomIn, ZoomOut } from "lucide-solid";
import { createEffect, createSignal, type JSX, Show } from "solid-js";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { useBindSignal } from "../hooks/use-bind-signal";
import { cn } from "../lib/shadcn/utils";

export default function ImagePreviewDialog(props: {
  imageUrl?: string;
  name?: string;
  imgClass?: string;
  fallbackClass?: string;
  children?: JSX.Element;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  // eslint-disable-next-line no-unassigned-vars -- assigned via JSX ref
  let zoomInButtonRef: HTMLButtonElement | undefined;
  // eslint-disable-next-line no-unassigned-vars -- assigned via JSX ref
  let zoomOutButtonRef: HTMLButtonElement | undefined;
  // eslint-disable-next-line no-unassigned-vars -- assigned via JSX ref
  let resetZoomButtonRef: HTMLButtonElement | undefined;
  // eslint-disable-next-line no-unassigned-vars -- assigned via JSX ref
  let scrollContainer: HTMLDivElement | undefined;

  const [open, setOpen] = useBindSignal({
    value: () => props.open,
    setValue: (value) => {
      props.onOpenChange?.(value ?? false);
    },
  });
  const [imageError, setImageError] = useBindSignal({
    value: () => !props.imageUrl,
  });
  const [zoom, setZoom] = createSignal(1);

  const zoomIn = () => {
    zoomInButtonRef?.focus();
    setZoom((prev) => Math.min(prev + 0.25, 5));
  };

  const zoomOut = () => {
    zoomOutButtonRef?.focus();
    setZoom((prev) => Math.max(prev - 0.25, 0.25));
  };

  const resetZoom = () => {
    resetZoomButtonRef?.focus();
    setZoom(1);
    if (scrollContainer) {
      scrollContainer.scrollLeft = 0;
      scrollContainer.scrollTop = 0;
    }
  };

  const scrollStep = 100; // pixels to scroll per arrow key press
  let scrollInterval: ReturnType<typeof setInterval> | undefined;

  const scrollLeft = () => {
    if (scrollContainer && zoom() > 1) {
      scrollContainer.scrollTo({
        left: scrollContainer.scrollLeft - scrollStep,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainer && zoom() > 1) {
      scrollContainer.scrollTo({
        left: scrollContainer.scrollLeft + scrollStep,
        behavior: "smooth",
      });
    }
  };

  const scrollUp = () => {
    if (scrollContainer && zoom() > 1) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollTop - scrollStep,
        behavior: "smooth",
      });
    }
  };

  const scrollDown = () => {
    if (scrollContainer && zoom() > 1) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollTop + scrollStep,
        behavior: "smooth",
      });
    }
  };

  const startContinuousScroll = (scrollFunction: () => void) => {
    if (scrollInterval) {
      clearInterval(scrollInterval);
    }
    scrollFunction(); // Initial scroll
    scrollInterval = setInterval(scrollFunction, 100); // Continue every 100ms
  };

  const stopContinuousScroll = () => {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      scrollInterval = undefined;
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!open()) return;

    switch (e.key) {
      case "ArrowLeft": {
        e.preventDefault();
        startContinuousScroll(scrollLeft);
        break;
      }
      case "ArrowRight": {
        e.preventDefault();
        startContinuousScroll(scrollRight);
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        startContinuousScroll(scrollUp);
        break;
      }
      case "ArrowDown": {
        e.preventDefault();
        startContinuousScroll(scrollDown);
        break;
      }
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (!open()) return;

    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      stopContinuousScroll();
    }
  };

  // Add keyboard event listeners when dialog is open
  createEffect(() => {
    if (open()) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
        stopContinuousScroll();
      };
    }
  });

  // Keyboard shortcuts using solid-primitives (excluding arrow keys)
  createShortcut(["+"], zoomIn, { preventDefault: false });
  createShortcut(["="], zoomIn, { preventDefault: false });
  createShortcut(["-"], zoomOut, { preventDefault: false });
  createShortcut(["0"], resetZoom, { preventDefault: false });

  return (
    <Dialog
      open={open()}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          resetZoom();
        }
      }}
    >
      <DialogTrigger>
        <Show when={!props.children} fallback={props.children}>
          <div class="cursor-pointer hover:opacity-75 transition-opacity">
            <Show
              when={!imageError()}
              fallback={
                <div
                  class={cn(
                    "w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500",
                    props.fallbackClass,
                  )}
                >
                  Geen afbeelding
                </div>
              }
            >
              <img
                src={props.imageUrl}
                alt={props.name}
                class={cn("w-12 h-12 object-cover rounded ", props.imgClass)}
                onError={(_err) => {
                  setImageError(true);
                }}
              />
            </Show>
          </div>
        </Show>
      </DialogTrigger>
      <DialogContent class="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Afbeelding - {props.name}</DialogTitle>
        </DialogHeader>

        {/* Zoom Controls */}
        <div class="flex justify-center gap-2 mb-4">
          <Button
            ref={zoomOutButtonRef}
            variant="outline"
            size="sm"
            onClick={zoomOut}
            disabled={zoom() <= 0.25}
          >
            <ZoomOut size={16} />
          </Button>

          <Button
            ref={resetZoomButtonRef}
            variant="outline"
            size="sm"
            onClick={resetZoom}
          >
            {Math.round(zoom() * 100)}%
          </Button>

          <Button
            ref={zoomInButtonRef}
            variant="outline"
            size="sm"
            onClick={zoomIn}
            disabled={zoom() >= 5}
          >
            <ZoomIn size={16} />
          </Button>
        </div>

        <div
          ref={scrollContainer}
          class="flex justify-center overflow-auto max-h-[60vh] p-4"
        >
          <Show
            when={!imageError()}
            fallback={
              <div class="w-96 h-96 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                Afbeelding kan niet geladen worden
              </div>
            }
          >
            <img
              src={props.imageUrl}
              alt={props.name}
              class="max-w-full max-h-full object-contain rounded transition-transform duration-200"
              style={`transform: scale(${zoom()});`}
              onError={() => setImageError(true)}
            />
          </Show>
        </div>

        <div class="text-center text-sm text-muted-foreground mt-2">
          Gebruik +/- toetsen om in/uit te zoomen, 0 om te resetten
          <Show when={zoom() > 1}>
            <span>, pijltjestoetsen om te scrollen of scroll met de muis</span>
          </Show>
        </div>
      </DialogContent>
    </Dialog>
  );
}
