import { describe, expect, test } from "bun:test";
import { createBetterAuthConvexTokenProvider } from "../../packages/core/src/better-auth";

describe("createBetterAuthConvexTokenProvider", () => {
  test("returns a Convex token when Better Auth provides one", async () => {
    const getToken = createBetterAuthConvexTokenProvider({
      convex: {
        token: async () => ({ data: { token: "convex-token" } }),
      },
    } as Parameters<typeof createBetterAuthConvexTokenProvider>[0]);

    await expect(getToken()).resolves.toBe("convex-token");
  });

  test("returns null when the token request fails", async () => {
    const getToken = createBetterAuthConvexTokenProvider({
      convex: {
        token: async () => {
          throw new Error("offline");
        },
      },
    } as Parameters<typeof createBetterAuthConvexTokenProvider>[0]);

    await expect(getToken()).resolves.toBeNull();
  });
});
