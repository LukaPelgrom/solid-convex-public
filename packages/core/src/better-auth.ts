import {
  convexClient,
  crossDomainClient,
} from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "better-auth/solid";

export type CreateBetterAuthConvexClientOptions = {
  siteUrl: string;
  storagePrefix?: string;
};

export const createBetterAuthConvexClient = (
  options: CreateBetterAuthConvexClientOptions,
) =>
  createAuthClient({
    baseURL: options.siteUrl,
    plugins: [
      convexClient(),
      crossDomainClient({
        storagePrefix: options.storagePrefix ?? "solid-configs-public",
      }),
    ],
  });

export type BetterAuthConvexClient = ReturnType<
  typeof createBetterAuthConvexClient
>;

export const createBetterAuthConvexTokenProvider =
  (authClient: BetterAuthConvexClient) => async () => {
    try {
      const result = await authClient.convex.token({
        fetchOptions: { throw: false },
      });

      return result.data?.token ?? null;
    } catch (error) {
      console.warn("Unable to fetch Convex auth token.", error);
      return null;
    }
  };
