import {
  onCleanup,
  onMount,
  type Component,
  type ComponentProps,
} from "solid-js";

import { Toaster as Sonner, toast } from "solid-sonner";

type ToasterProps = ComponentProps<typeof Sonner>;

const Toaster: Component<ToasterProps> = (props) => {
  onMount(() => {
    const attachedToasts = new WeakSet<Element>();
    const closeToastOnBodyClick = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (
        target.closest("button, a, input, textarea, select, [role='button']")
      ) {
        return;
      }

      if (target.closest("[data-sonner-toast]")) {
        window.setTimeout(() => toast.dismiss(), 0);
      }
    };
    const bindToastClickHandlers = () => {
      for (const toastElement of document.querySelectorAll(
        "[data-sonner-toast]",
      )) {
        if (attachedToasts.has(toastElement)) continue;
        attachedToasts.add(toastElement);
        toastElement.addEventListener("click", closeToastOnBodyClick);
        toastElement.addEventListener("pointerup", closeToastOnBodyClick);
      }
    };
    const observer = new MutationObserver(bindToastClickHandlers);

    bindToastClickHandlers();
    observer.observe(document.body, { childList: true, subtree: true });
    onCleanup(() => observer.disconnect());
  });

  return (
    <Sonner
      class="toaster group"
      toastOptions={{
        classes: {
          toast:
            "group toast cursor-pointer group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
