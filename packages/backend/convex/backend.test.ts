import { describe, expect, test } from "vitest";
import { api } from "./_generated/api";
import { createBackendTest, createTestUser } from "./test.setup";

const withLocalConvexSite = async <Result>(
  run: () => Promise<Result>,
): Promise<Result> => {
  const originalSiteUrl = process.env.CONVEX_SITE_URL;
  process.env.CONVEX_SITE_URL = "http://127.0.0.1:3211";

  try {
    return await run();
  } finally {
    if (originalSiteUrl === undefined) {
      delete process.env.CONVEX_SITE_URL;
    } else {
      process.env.CONVEX_SITE_URL = originalSiteUrl;
    }
  }
};

describe("backend Convex functions", () => {
  test("returns empty public demo items for an unauthenticated user", async () => {
    const t = createBackendTest();

    await expect(t.query(api.auth.getCurrentUserProfile)).resolves.toBeNull();
  });

  test("hydrates the current user profile and persists demo role changes", async () => {
    const t = createBackendTest();
    const { authed, email, name, user } = await createTestUser(t, {
      email: "sarah@example.com",
      name: "Sarah",
    });

    await expect(
      authed.query(api.auth.getCurrentUserProfile),
    ).resolves.toMatchObject({
      _id: user._id,
      email,
      name,
      role: "employee",
      roles: ["employee"],
    });

    await expect(
      authed.mutation(api.auth.upsertDemoProfile, { role: "admin" }),
    ).resolves.toMatchObject({
      _id: user._id,
      role: "admin",
      roles: ["admin"],
    });

    await expect(
      authed.query(api.auth.getCurrentUserProfile),
    ).resolves.toMatchObject({
      _id: user._id,
      role: "admin",
      roles: ["admin"],
    });
  });

  test("seeds the local demo admin user idempotently", async () => {
    const t = createBackendTest();

    await withLocalConvexSite(async () => {
      await expect(t.mutation(api.auth.seedAdmin)).resolves.toMatchObject({
        email: "admin@test.com",
        role: "admin",
        status: "created",
      });

      await expect(t.mutation(api.auth.seedAdmin)).resolves.toMatchObject({
        email: "admin@test.com",
        role: "admin",
        status: "already-existed",
      });
    });

    await expect(
      t.run(async (ctx) => await ctx.db.query("demoProfiles").first()),
    ).resolves.toMatchObject({
      role: "admin",
    });
  });

  test("keeps todo ownership isolated and reorders complete owned lists", async () => {
    const t = createBackendTest();
    const sarah = await createTestUser(t, {
      email: "sarah@example.com",
      name: "Sarah",
    });
    const lee = await createTestUser(t, {
      email: "lee@example.com",
      name: "Lee",
    });

    const firstId = await sarah.authed.mutation(api.todos.create, {
      notes: "  notes  ",
      title: " First   todo ",
    });
    const secondId = await sarah.authed.mutation(api.todos.create, {
      title: "Second todo",
    });

    await expect(lee.authed.query(api.todos.list)).resolves.toEqual([]);

    const initial = await sarah.authed.query(api.todos.list);
    expect(initial.map((item) => item.title)).toEqual([
      "Second todo",
      "First todo",
    ]);
    expect(initial.map((item) => item.ownerId)).toEqual([
      sarah.user._id,
      sarah.user._id,
    ]);

    await expect(
      sarah.authed.mutation(api.todos.reorder, {
        ids: [secondId],
      }),
    ).rejects.toThrow("Todo order is stale.");

    await expect(
      sarah.authed.mutation(api.todos.reorder, {
        ids: [firstId, secondId],
      }),
    ).resolves.toMatchObject([
      { title: "First todo" },
      { title: "Second todo" },
    ]);
  });
});
