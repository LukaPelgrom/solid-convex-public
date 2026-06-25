import { ChevronLeftIcon, ChevronRightIcon } from "lucide-solid";
import { createSignal, onCleanup, onMount, Show } from "solid-js";

type HorizontalScrollControlsProps = {
  getScroller: () => HTMLElement | undefined;
  previousLabel?: string;
  nextLabel?: string;
};

export function HorizontalScrollControls(props: HorizontalScrollControlsProps) {
  const [canScrollLeft, setCanScrollLeft] = createSignal(false);
  const [canScrollRight, setCanScrollRight] = createSignal(false);

  const update = () => {
    const el = props.getScroller();
    if (!el) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  onMount(() => {
    const el = props.getScroller();
    if (!el) return;
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);

    const observeChildren = () => {
      for (const child of Array.from(el.children)) {
        ro.observe(child);
      }
    };
    observeChildren();

    const mo = new MutationObserver(() => {
      update();
      observeChildren();
    });
    mo.observe(el, { childList: true });

    el.addEventListener("scroll", update, { passive: true });

    onCleanup(() => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
      mo.disconnect();
    });
  });

  const scrollToNext = () => {
    const el = props.getScroller();
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    const next = children.find((c) => c.offsetLeft > el.scrollLeft + 4);
    el.scrollTo({
      left: next ? next.offsetLeft : el.scrollWidth,
      behavior: "smooth",
    });
  };

  const scrollToPrev = () => {
    const el = props.getScroller();
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    const prev = [...children]
      .reverse()
      .find((c) => c.offsetLeft < el.scrollLeft - 4);
    el.scrollTo({
      left: prev ? prev.offsetLeft : 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Show when={canScrollLeft()}>
        <div class="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-[5]" />
        <button
          type="button"
          aria-label={props.previousLabel ?? "Vorige"}
          onClick={scrollToPrev}
          class="absolute left-2 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border bg-background/90 shadow-sm transition-colors hover:bg-background"
        >
          <ChevronLeftIcon class="size-4" />
        </button>
      </Show>
      <Show when={canScrollRight()}>
        <div class="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-[5]" />
        <button
          type="button"
          aria-label={props.nextLabel ?? "Volgende"}
          onClick={scrollToNext}
          class="absolute right-2 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border bg-background/90 shadow-sm transition-colors hover:bg-background"
        >
          <ChevronRightIcon class="size-4" />
        </button>
      </Show>
    </>
  );
}
