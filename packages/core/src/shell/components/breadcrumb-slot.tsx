import {
  createEffect,
  createSignal,
  For,
  Show,
  onCleanup,
  type JSX,
} from "solid-js";
import {
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

const [breadcrumbContent, setBreadcrumbContent] =
  createSignal<JSX.Element | null>(null);

export { breadcrumbContent };

export function BreadcrumbSlot(props: {
  children?: JSX.Element;
  text?: string;
}) {
  return (
    <SideNavBarBreadcrumb text={props.text}>
      {props.children}
    </SideNavBarBreadcrumb>
  );
}

export function SideNavBarBreadcrumb(props: {
  children?: JSX.Element;
  text?: string;
}) {
  createEffect(() => {
    const content = props.children ?? props.text;
    setBreadcrumbContent(() => renderBreadcrumbContent(content));
  });

  onCleanup(() => {
    setBreadcrumbContent(null);
  });

  return null;
}

function renderBreadcrumbContent(content: JSX.Element) {
  if (typeof content !== "string") {
    return content;
  }

  const segments = content
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  return (
    <For each={segments}>
      {(segment, index) => (
        <>
          <Show when={index() > 0}>
            <BreadcrumbSeparator />
          </Show>
          <BreadcrumbItem>
            <BreadcrumbPage>{segment}</BreadcrumbPage>
          </BreadcrumbItem>
        </>
      )}
    </For>
  );
}
