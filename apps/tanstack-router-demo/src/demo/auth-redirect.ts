export type AuthRedirectPath = "/todos";

export type AuthRedirectSearch = {
  redirect: AuthRedirectPath;
};

export const defaultAuthRedirect: AuthRedirectPath = "/todos";

export function normalizeAuthRedirect(value: unknown): AuthRedirectPath {
  return value === "/todos" ? value : defaultAuthRedirect;
}

export function parseAuthRedirectSearch(search: Record<string, unknown>) {
  return {
    redirect: normalizeAuthRedirect(search.redirect),
  } satisfies AuthRedirectSearch;
}

export function authRedirectHref(
  path: "/" | "/register",
  redirect: AuthRedirectPath,
) {
  return `${path}?redirect=${encodeURIComponent(redirect)}`;
}
