import { ConvexError, v } from "convex/values";
import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import {
  assertPermission,
  canManageDemoItems,
} from "@solid-configs-public/permissions";
import {
  getCurrentUserProfileForCtx,
  getCurrentUserSubjectForCtx,
} from "./auth";
import type { Doc, Id } from "./_generated/dataModel";

type TodoCtx = QueryCtx | MutationCtx;
type TodoItemDoc = Doc<"todoItems">;

const cleanTitle = (value: string) => value.trim().replace(/\s+/g, " ");
const cleanNotes = (value: string) => value.trim();
const creatorName = (user: { email: string; name: string }) =>
  user.name.trim() || user.email.trim();

const requireTodoUser = async (ctx: TodoCtx) => {
  const subject = await getCurrentUserSubjectForCtx(ctx);
  assertPermission(canManageDemoItems, subject);

  return await getCurrentUserProfileForCtx(ctx);
};

const compareTodoItems = (left: TodoItemDoc, right: TodoItemDoc) =>
  left.sortOrder - right.sortOrder ||
  left.createdAt - right.createdAt ||
  left._creationTime - right._creationTime;

const listOwnedTodoItems = async (ctx: TodoCtx, ownerId: string) => {
  const items = await ctx.db
    .query("todoItems")
    .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
    .collect();

  return items.sort(compareTodoItems);
};

const getOwnedTodoItem = async (
  ctx: MutationCtx,
  ownerId: string,
  id: Id<"todoItems">,
) => {
  const item = await ctx.db.get(id);
  if (!item || item.ownerId !== ownerId) {
    throw new ConvexError("Todo not found.");
  }

  return item;
};

const nextFirstSortOrder = (items: TodoItemDoc[]) =>
  items.length === 0 ? 0 : items[0].sortOrder - 1;

const insertTodo = async (
  ctx: MutationCtx,
  input: {
    notes: string;
    sortOrder: number;
    title: string;
  },
) => {
  const user = await requireTodoUser(ctx);
  const now = Date.now();

  return await ctx.db.insert("todoItems", {
    createdAt: now,
    createdByName: creatorName(user),
    createdByUserId: user._id,
    done: false,
    notes: input.notes,
    ownerId: user._id,
    sortOrder: input.sortOrder,
    title: input.title,
    updatedAt: now,
  });
};

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireTodoUser(ctx);
    return await listOwnedTodoItems(ctx, user._id);
  },
});

export const create = mutation({
  args: {
    notes: v.optional(v.string()),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireTodoUser(ctx);
    const title = cleanTitle(args.title);
    if (!title) {
      throw new ConvexError("Title is required.");
    }

    const items = await listOwnedTodoItems(ctx, user._id);
    return await insertTodo(ctx, {
      notes: cleanNotes(args.notes ?? ""),
      sortOrder: nextFirstSortOrder(items),
      title,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("todoItems"),
    notes: v.optional(v.string()),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireTodoUser(ctx);
    await getOwnedTodoItem(ctx, user._id, args.id);

    const title = cleanTitle(args.title);
    if (!title) {
      throw new ConvexError("Title is required.");
    }

    await ctx.db.patch(args.id, {
      notes: cleanNotes(args.notes ?? ""),
      title,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(args.id);
  },
});

export const toggle = mutation({
  args: {
    id: v.id("todoItems"),
  },
  handler: async (ctx, args) => {
    const user = await requireTodoUser(ctx);
    const item = await getOwnedTodoItem(ctx, user._id, args.id);

    await ctx.db.patch(args.id, {
      done: !item.done,
      updatedAt: Date.now(),
    });
    return { ok: true };
  },
});

export const remove = mutation({
  args: {
    id: v.id("todoItems"),
  },
  handler: async (ctx, args) => {
    const user = await requireTodoUser(ctx);
    await getOwnedTodoItem(ctx, user._id, args.id);

    await ctx.db.delete(args.id);
    return { ok: true };
  },
});

export const reorder = mutation({
  args: {
    ids: v.array(v.id("todoItems")),
  },
  handler: async (ctx, args) => {
    const user = await requireTodoUser(ctx);
    const items = await listOwnedTodoItems(ctx, user._id);
    const byId = new Map(items.map((item) => [item._id, item]));
    const uniqueIds = new Set(args.ids);

    if (
      uniqueIds.size !== args.ids.length ||
      args.ids.length !== items.length
    ) {
      throw new ConvexError("Todo order is stale.");
    }

    for (const id of args.ids) {
      if (!byId.has(id)) {
        throw new ConvexError("Todo order contains an unknown item.");
      }
    }

    const now = Date.now();
    for (const [sortOrder, id] of args.ids.entries()) {
      await ctx.db.patch(id, { sortOrder, updatedAt: now });
    }

    return await listOwnedTodoItems(ctx, user._id);
  },
});

export const resetMine = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await requireTodoUser(ctx);
    const items = await listOwnedTodoItems(ctx, user._id);

    for (const item of items) {
      await ctx.db.delete(item._id);
    }

    await insertTodo(ctx, {
      notes: "Kept server-side in Convex.",
      sortOrder: 0,
      title: "Ship the Solid Configs Public demo",
    });
    await insertTodo(ctx, {
      notes: "The list subscribes with @solid-configs-public/core.",
      sortOrder: 1,
      title: "Animate list mutations",
    });

    return { reset: true };
  },
});

export const replaceFirst = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await requireTodoUser(ctx);
    const items = await listOwnedTodoItems(ctx, user._id);
    const sortOrder = items[0]?.sortOrder ?? 0;

    if (items[0]) {
      await ctx.db.delete(items[0]._id);
    }

    return await insertTodo(ctx, {
      notes: "Created by the current auth user on the server.",
      sortOrder,
      title: "Replacement todo",
    });
  },
});
