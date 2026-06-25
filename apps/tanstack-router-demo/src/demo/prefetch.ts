import { api } from "@solid-convex-public/backend/convex/_generated/api";
import type { SolidConvexReader } from "@solid-convex-public/core";
import type { DemoUser, PrefetchedDemoData } from "./types";

export const prefetchCurrentUser = async (
  convex: SolidConvexReader,
): Promise<DemoUser | null> => {
  try {
    return (await convex.prefetch(api.auth.getCurrentUserProfile)) ?? null;
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
