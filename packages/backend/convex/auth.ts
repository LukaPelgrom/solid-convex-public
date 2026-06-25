import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import {
  parseDemoRole,
  subjectFromRole,
  type DemoRole,
} from "@solid-convex-public/permissions";
import { betterAuth, type BetterAuthOptions } from "better-auth/minimal";
import { v } from "convex/values";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import authConfig from "./auth.config";

const defaultSiteUrls = [
  "http://localhost:3200",
  "http://localhost:3201",
  "http://127.0.0.1:3200",
  "http://127.0.0.1:3201",
];

const siteUrls = () =>
  (process.env.SITE_URLS ?? process.env.SITE_URL ?? defaultSiteUrls.join(","))
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);

type AppDbCtx = QueryCtx | MutationCtx;

export const authComponent = createClient<DataModel>(components.betterAuth);

export const demoRoleValidator = v.union(
  v.literal("employee"),
  v.literal("employee_plus"),
  v.literal("admin"),
);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  const trustedOrigins = siteUrls();
  const siteUrl = trustedOrigins[0] ?? defaultSiteUrls[0];

  return betterAuth({
    appName: "solid-convex-public",
    baseURL: process.env.CONVEX_SITE_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [crossDomain({ siteUrl }), convex({ authConfig })],
  } satisfies BetterAuthOptions);
};

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => await authComponent.safeGetAuthUser(ctx),
});

const getDemoProfile = async (ctx: AppDbCtx, userId: string) =>
  await ctx.db
    .query("demoProfiles")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .unique();

const toDemoUser = (
  user: Awaited<ReturnType<typeof authComponent.getAuthUser>>,
  role: DemoRole,
) => ({
  _id: user._id,
  email: user.email,
  name: user.name,
  image: user.image ?? null,
  emailVerified: user.emailVerified,
  role,
  roles: [role],
});

export const getCurrentUserProfileForCtx = async (ctx: AppDbCtx) => {
  const user = await authComponent.getAuthUser(ctx);
  const profile = await getDemoProfile(ctx, user._id);
  const role = parseDemoRole(profile?.role);

  return toDemoUser(user, role);
};

export const getCurrentUserSubjectForCtx = async (ctx: AppDbCtx) => {
  const currentUser = await getCurrentUserProfileForCtx(ctx);
  return subjectFromRole(currentUser.role);
};

export const getCurrentUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      return null;
    }

    const profile = await getDemoProfile(ctx, user._id);
    return toDemoUser(user, parseDemoRole(profile?.role));
  },
});

export const upsertDemoProfile = mutation({
  args: {
    role: demoRoleValidator,
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const existing = await getDemoProfile(ctx, user._id);
    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        role: args.role,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("demoProfiles", {
        userId: user._id,
        role: args.role,
        createdAt: now,
        updatedAt: now,
      });
    }

    return toDemoUser(user, args.role);
  },
});
