import {
  createSolidConvex,
  createSolidConvexServer,
} from "@solid-convex-public/core";
import {
  createBetterAuthConvexClient,
  createBetterAuthConvexTokenProvider,
} from "@solid-convex-public/core/better-auth";

const configuredConvexUrl =
  import.meta.env.VITE_CONVEX_URL ?? import.meta.env.PUBLIC_CONVEX_URL;
const configuredConvexSiteUrl =
  import.meta.env.VITE_CONVEX_SITE_URL ??
  import.meta.env.PUBLIC_CONVEX_SITE_URL;

const convexUrl = configuredConvexUrl ?? "http://127.0.0.1:3210";
const convexSiteUrl = configuredConvexSiteUrl ?? "http://127.0.0.1:3211";

export const isConvexConfigured = () => Boolean(configuredConvexUrl);

export const authClient = createBetterAuthConvexClient({
  siteUrl: convexSiteUrl,
  storagePrefix: "solid-convex-public",
});

export const getConvexAuthToken =
  createBetterAuthConvexTokenProvider(authClient);

export const createDemoConvex = () =>
  createSolidConvex({
    url: convexUrl,
    getAuthToken: getConvexAuthToken,
  });

export const createDemoServerConvex = (authToken?: string | null) =>
  createSolidConvexServer({
    url: convexUrl,
    authToken,
  });
