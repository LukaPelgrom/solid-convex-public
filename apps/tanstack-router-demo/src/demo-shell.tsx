import { Link, useLocation } from "@tanstack/solid-router";
import { Show, createMemo, type Accessor, type JSX } from "solid-js";
import {
  FeedbackKitAppShell,
  type FeedbackKitLinkRenderer,
  type FeedbackKitNavItem,
} from "@solid-convex-public/core/shell";
import type { DemoUser, SolidConvexAuth } from "./demo";

const renderLink: FeedbackKitLinkRenderer = (props) => (
  <Show
    when={props.href === "/todos"}
    fallback={
      <a href={props.href} class={props.class} onClick={props.onClick}>
        {props.children}
      </a>
    }
  >
    <Link to="/todos" class={props.class} onClick={props.onClick}>
      {props.children}
    </Link>
  </Show>
);

export function TanStackDemoShell(props: {
  auth: SolidConvexAuth;
  onSignOut?: () => Promise<void>;
  user: Accessor<DemoUser | null>;
  children: JSX.Element;
}) {
  const location = useLocation();
  const navItems = createMemo<FeedbackKitNavItem[]>(() => [
    { href: "/todos", label: "Todos" },
  ]);

  return (
    <FeedbackKitAppShell
      currentPath={() => location().pathname}
      navItems={navItems}
      onSignOut={props.onSignOut ?? props.auth.signOut}
      renderLink={renderLink}
      subtitle="public todo demo"
      title="solid-convex-public"
      user={props.user}
    >
      {props.children}
    </FeedbackKitAppShell>
  );
}
