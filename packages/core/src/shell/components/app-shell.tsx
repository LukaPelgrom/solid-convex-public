import {
  BellIcon,
  BlocksIcon,
  BotIcon,
  Building2Icon,
  LaptopIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MoonIcon,
  SendIcon,
  ShieldIcon,
  SunIcon,
  UserIcon,
} from "lucide-solid";
import {
  createEffect,
  createSignal,
  For,
  Show,
  type Accessor,
  type JSX,
} from "solid-js";
import { breadcrumbContent } from "./breadcrumb-slot";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Button, buttonVariants } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { cn } from "../lib/shadcn/utils";

type IconComponent = typeof LayoutDashboardIcon;

export type FeedbackKitNavItem = {
  href: string;
  label: string;
  icon?: IconComponent;
  visible?: boolean | Accessor<boolean>;
};

export type FeedbackKitShellUser = {
  email?: string | null;
  image?: string | null;
  name?: string | null;
};

export type FeedbackKitLinkRenderProps = {
  href: string;
  class?: string;
  children: JSX.Element;
  onClick?: () => void;
};

export type FeedbackKitLinkRenderer = (
  props: FeedbackKitLinkRenderProps,
) => JSX.Element;

export type FeedbackKitAppShellProps = {
  children: JSX.Element;
  currentPath?: Accessor<string>;
  navItems?: Accessor<FeedbackKitNavItem[]>;
  onSignOut?: () => Promise<void> | void;
  renderLink?: FeedbackKitLinkRenderer;
  subtitle?: string;
  title?: string;
  user?: Accessor<FeedbackKitShellUser | null>;
};

const defaultNavItems: FeedbackKitNavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/board", label: "Board", icon: LayoutDashboardIcon },
  { href: "/admin", label: "Admin", icon: ShieldIcon },
];

export function FeedbackKitAppShell(props: FeedbackKitAppShellProps) {
  const navItems = () =>
    (props.navItems?.() ?? defaultNavItems).filter(isVisible);

  return (
    <div class="fk-app-shell flex bg-[var(--fk-app-bg)] text-foreground">
      <aside
        class="fk-app-shell-sidebar hidden w-72 shrink-0 border-r border-border/70 bg-[var(--fk-sidebar-bg)] md:flex md:flex-col"
        data-testid="web-solid-sidebar"
      >
        <SidebarContent
          items={navItems}
          onSignOut={props.onSignOut}
          renderLink={props.renderLink}
          subtitle={props.subtitle ?? "web-solid"}
          title={props.title ?? "FeedbackKit"}
          user={props.user ?? (() => null)}
        />
      </aside>
      <div class="fk-app-shell-main flex min-w-0 flex-1 flex-col">
        <header class="sticky top-0 z-10 flex h-16 items-center gap-2 border-b border-border/70 bg-[var(--fk-header-bg)] px-3 backdrop-blur md:px-4">
          <div class="flex min-w-0 flex-1 items-center gap-4">
            <Breadcrumb class="min-w-0 shrink-0 overflow-hidden">
              <BreadcrumbList class="min-w-0 flex-nowrap overflow-hidden">
                {breadcrumbContent() ?? (
                  <DefaultBreadcrumbItems
                    pathname={() => props.currentPath?.() ?? "/board"}
                  />
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div class="ml-auto flex shrink-0 items-center">
            <ModeToggle />
          </div>
        </header>
        <div class="border-b border-border/70 bg-[var(--fk-header-bg)] px-3 py-2 backdrop-blur md:hidden">
          <div class="flex gap-2 overflow-x-auto pb-1">
            <For each={navItems()}>
              {(item) => {
                const Icon = item.icon ?? LayoutDashboardIcon;

                return (
                  <ShellLink
                    href={item.href}
                    renderLink={props.renderLink}
                    class={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "shrink-0",
                    )}
                  >
                    <Icon />
                    {item.label}
                  </ShellLink>
                );
              }}
            </For>
          </div>
        </div>
        <main
          class="fk-app-shell-scroll min-w-0 flex-1 p-4"
          data-testid="web-solid-main-scroll"
        >
          {props.children}
        </main>
      </div>
    </div>
  );
}

export const AppShell = FeedbackKitAppShell;

function SidebarContent(props: {
  items: Accessor<FeedbackKitNavItem[]>;
  onSignOut?: () => Promise<void> | void;
  renderLink?: FeedbackKitLinkRenderer;
  subtitle: string;
  title: string;
  user: Accessor<FeedbackKitShellUser | null>;
}) {
  return (
    <>
      <div class="flex h-16 items-center gap-2 border-border/70 border-b px-4">
        <div class="flex size-9 items-center justify-center rounded-md bg-primary font-semibold text-primary-foreground">
          F
        </div>
        <div class="min-w-0">
          <div class="truncate font-semibold">{props.title}</div>
          <div class="truncate text-muted-foreground text-xs">
            {props.subtitle}
          </div>
        </div>
      </div>
      <nav class="fk-app-shell-sidebar-nav flex flex-1 flex-col gap-1 p-3">
        <For each={props.items()}>
          {(item) => {
            const Icon = item.icon ?? iconForNavItem(item);

            return (
              <ShellLink
                href={item.href}
                renderLink={props.renderLink}
                class={cn(
                  buttonVariants({ variant: "ghost" }),
                  "w-full justify-start gap-2",
                )}
              >
                <Icon />
                <span>{item.label}</span>
              </ShellLink>
            );
          }}
        </For>
      </nav>
      <Separator />
      <div class="p-3" data-testid="web-solid-sidebar-user">
        <div class="flex items-center gap-2">
          <SidebarUserAvatar user={props.user} />
          <div class="min-w-0 flex-1">
            <div class="truncate text-sm font-medium">
              {props.user()?.name ?? "Signed in"}
            </div>
            <div class="truncate text-muted-foreground text-xs">
              {props.user()?.email ?? ""}
            </div>
          </div>
          <Show when={props.onSignOut}>
            {(onSignOut) => (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Sign out"
                title="Sign out"
                onClick={() => void onSignOut()()}
              >
                <LogOutIcon />
              </Button>
            )}
          </Show>
        </div>
      </div>
    </>
  );
}

export function SidebarUserAvatar(props: {
  user: Accessor<FeedbackKitShellUser | null>;
}) {
  const [imageLoadFailed, setImageLoadFailed] = createSignal(false);

  createEffect(() => {
    props.user()?.image;
    setImageLoadFailed(false);
  });

  const image = () => {
    const src = props.user()?.image;
    return src && !imageLoadFailed() ? src : null;
  };

  return (
    <div class="grid size-9 shrink-0 place-items-center overflow-hidden rounded-md bg-muted font-semibold text-muted-foreground text-xs">
      <Show
        when={image()}
        fallback={
          props.user()?.name ? (
            initials(props.user()!.name!)
          ) : (
            <UserIcon class="size-4" />
          )
        }
      >
        {(src) => (
          <img
            src={src()}
            alt={props.user()?.name ?? ""}
            class="h-full w-full object-cover"
            onError={() => setImageLoadFailed(true)}
          />
        )}
      </Show>
    </div>
  );
}

function ShellLink(
  props: FeedbackKitLinkRenderProps & {
    renderLink?: FeedbackKitLinkRenderer;
  },
) {
  const renderLink = () => props.renderLink ?? defaultLink;

  return (
    <>
      {renderLink()({
        href: props.href,
        class: props.class,
        onClick: props.onClick,
        children: props.children,
      })}
    </>
  );
}

function defaultLink(props: FeedbackKitLinkRenderProps) {
  return (
    <a href={props.href} class={props.class} onClick={props.onClick}>
      {props.children}
    </a>
  );
}

function isVisible(item: FeedbackKitNavItem) {
  if (typeof item.visible === "function") return item.visible();
  return item.visible !== false;
}

function iconForNavItem(item: FeedbackKitNavItem): IconComponent {
  const label = item.label.toLowerCase();
  if (label === "admin") return ShieldIcon;
  if (label === "bridges") return BotIcon;
  if (label === "dev harness") return BlocksIcon;
  if (label === "notifications") return BellIcon;
  if (label === "organizations") return Building2Icon;
  if (label === "profile") return UserIcon;
  if (label === "telegram") return SendIcon;
  return LayoutDashboardIcon;
}

type Theme = "light" | "dark" | "system";

const themeStorageKey = "feedbackkit-ui-theme";

export function ModeToggle() {
  const [theme, setThemeSignal] = createSignal<Theme>(readStoredTheme());

  createEffect(() => {
    applyTheme(theme());
  });

  function setTheme(nextTheme: Theme) {
    setThemeSignal(nextTheme);
    localStorage.setItem(themeStorageKey, nextTheme);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        as={Button}
        variant="ghost"
        size="icon"
        class="relative"
      >
        <SunIcon class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <MoonIcon class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span class="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => setTheme("light")}>
          <SunIcon class="mr-2 size-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setTheme("dark")}>
          <MoonIcon class="mr-2 size-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setTheme("system")}>
          <LaptopIcon class="mr-2 size-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function readStoredTheme(): Theme {
  if (typeof localStorage === "undefined") return "system";
  const stored = localStorage.getItem(themeStorageKey);
  return stored === "light" || stored === "dark" || stored === "system"
    ? stored
    : "system";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved = theme === "system" ? (systemDark ? "dark" : "light") : theme;

  root.classList.toggle("dark", resolved === "dark");
  root.dataset.kbTheme = resolved;
  root.style.colorScheme = resolved;
}

function DefaultBreadcrumbItems(props: { pathname: Accessor<string> }) {
  const crumbs = () => buildBreadcrumbs(props.pathname());

  return (
    <For each={crumbs()}>
      {(crumb, index) => (
        <>
          <Show when={index() > 0}>
            <BreadcrumbSeparator />
          </Show>
          <BreadcrumbItem>
            {crumb.href && index() < crumbs().length - 1 ? (
              <a
                class="transition-colors hover:text-foreground"
                href={crumb.href}
              >
                {crumb.label}
              </a>
            ) : (
              <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        </>
      )}
    </For>
  );
}

type BreadcrumbCrumb = {
  href?: string;
  label: string;
};

function buildBreadcrumbs(pathname: string): BreadcrumbCrumb[] {
  const normalized = pathname.replace(/\/+$/g, "") || "/";

  if (normalized === "/") {
    return [{ label: "Home" }];
  }

  if (normalized === "/board") {
    return [{ label: "Board" }];
  }

  return buildPathBreadcrumbs(normalized);
}

function buildPathBreadcrumbs(pathname: string): BreadcrumbCrumb[] {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const isLast = index === segments.length - 1;

    return {
      href: isLast ? undefined : href,
      label: routeSegmentLabel(segment, segments, index),
    };
  });
}

function routeSegmentLabel(segment: string, segments: string[], index: number) {
  if (segments[index - 1] === "issues" && index === 1) {
    return segment;
  }

  if (segments[index - 1] === "issues" && index === 2) {
    return segment;
  }

  if (segments[index - 1] === "invite") {
    return "Invitation";
  }

  const segmentLabels: Record<string, string> = {
    admin: "Admin",
    "api-keys": "API keys",
    board: "Board",
    dashboard: "Dashboard",
    dev: "Developer",
    "employee-plus": "Employee Plus",
    invite: "Invite",
    issues: "Issues",
    local: "Local Board",
    notifications: "Notifications",
    organizations: "Organizations",
    profile: "Profile",
    register: "Register",
    setup: "Setup",
    workspace: "Workspace",
    webhooks: "Webhooks",
  };

  return segmentLabels[segment] ?? titleFromSlug(segment);
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0]!}${parts[parts.length - 1]![0]!}`.toUpperCase();
}
