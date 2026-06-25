import { register as registerBetterAuthComponent } from "@convex-dev/better-auth/test";
import { convexTest } from "convex-test";
import type { UserIdentity } from "convex/server";
import { components } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob("./**/!(*.*.*)*.*s");

export const createBackendTest = () => {
  const t = convexTest(schema, modules);
  registerBetterAuthComponent(t);
  return t;
};

type BackendTest = ReturnType<typeof createBackendTest>;

export const createTestUser = async (
  t: BackendTest,
  options: {
    email?: string;
    name?: string;
  } = {},
) => {
  const now = Date.now();
  const email =
    options.email ?? `user-${Math.random().toString(36).slice(2)}@example.com`;
  const name = options.name ?? "Test User";

  const user = await t.run(
    async (ctx) =>
      await ctx.runMutation(components.betterAuth.adapter.create, {
        input: {
          model: "user",
          data: {
            createdAt: now,
            email,
            emailVerified: true,
            image: null,
            name,
            updatedAt: now,
          },
        },
      }),
  );

  const session = await t.run(
    async (ctx) =>
      await ctx.runMutation(components.betterAuth.adapter.create, {
        input: {
          model: "session",
          data: {
            createdAt: now,
            expiresAt: now + 60 * 60 * 1000,
            token: `session-${user._id}`,
            updatedAt: now,
            userId: user._id,
          },
        },
      }),
  );

  const identity = {
    email,
    name,
    sessionId: session._id,
    subject: user._id,
    tokenIdentifier: `https://convex.test|${user._id}`,
  } as Partial<UserIdentity>;

  return {
    authed: t.withIdentity(identity),
    email,
    name,
    session,
    user,
  };
};
