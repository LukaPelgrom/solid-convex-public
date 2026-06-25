import { describe, expect, test } from "vitest";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { createBackendTest, createTestUser } from "./test.setup";

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
        ids: [secondId as Id<"todoItems">],
      }),
    ).rejects.toThrow("Todo order is stale.");

    await expect(
      sarah.authed.mutation(api.todos.reorder, {
        ids: [firstId as Id<"todoItems">, secondId as Id<"todoItems">],
      }),
    ).resolves.toMatchObject([
      { title: "First todo" },
      { title: "Second todo" },
    ]);
  });
});
