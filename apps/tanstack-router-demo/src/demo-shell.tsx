import { Link, useLocation } from "@tanstack/solid-router";
import { createMemo, type Accessor, type JSX } from "solid-js";
import {
  FeedbackKitAppShell,
  type FeedbackKitLinkRenderer,
  type FeedbackKitNavItem,
} from "@solid-configs-public/core/shell";
import type { DemoUser, SolidConvexAuth } from "./demo";

const renderLink: FeedbackKitLinkRenderer = (props) => (
  <Link
    to={props.href as "/" | "/register" | "/todos"}
    class={props.class}
    onClick={props.onClick}
  >
    {props.children}
  </Link>
);

export function TanStackDemoShell(props: {
  auth: SolidConvexAuth;
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
      onSignOut={props.auth.signOut}
      renderLink={renderLink}
      subtitle="public todo demo"
      title="solid-configs-public"
      user={props.user}
    >
      {props.children}
    </FeedbackKitAppShell>
  );
}
