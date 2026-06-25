import { api } from "@solid-configs-public/backend/convex/_generated/api";
import type { SolidConvexReader } from "@solid-configs-public/core";
import { isConvexConfigured } from "./runtime";
import type { DemoUser, PrefetchedDemoData } from "./types";

export const prefetchCurrentUser = async (
  convex: SolidConvexReader,
): Promise<DemoUser | null> => {
  if (!isConvexConfigured()) return null;

  try {
    return (
      ((await convex.prefetch(api.auth.getCurrentUserProfile)) as
        | DemoUser
        | undefined) ?? null
    );
  } catch (error) {
    console.warn("Could not prefetch current user.", error);
    return null;
  }
};

export const prefetchDemoData = async (
  convex: SolidConvexReader,
): Promise<PrefetchedDemoData> => {
  return { user: await prefetchCurrentUser(convex) };
};
