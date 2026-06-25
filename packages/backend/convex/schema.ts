import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  demoProfiles: defineTable({
    userId: v.string(),
    role: v.union(
      v.literal("employee"),
      v.literal("employee_plus"),
      v.literal("admin"),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),
  todoItems: defineTable({
    ownerId: v.string(),
    createdByUserId: v.string(),
    createdByName: v.string(),
    title: v.string(),
    notes: v.string(),
    done: v.boolean(),
    sortOrder: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_owner", ["ownerId"]),
});
