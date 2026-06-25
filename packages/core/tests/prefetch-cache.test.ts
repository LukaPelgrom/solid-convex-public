import { describe, expect, test } from "bun:test";
import { createRoot } from "solid-js";
import { api } from "../../backend/convex/_generated/api.js";
import type { Id } from "../../backend/convex/_generated/dataModel.js";
import {
  convexQueryKey,
  createSolidConvex,
  createSolidConvexServer,
  prefetchBatch,
  prefetchConvexBatch,
} from "../src/lib/solid-convex-public";

type BrowserClient = NonNullable<
  Parameters<typeof createSolidConvex>[0]["client"]
>;
type ServerClient = NonNullable<
  Parameters<typeof createSolidConvexServer>[0]["client"]
>;
type Subscription = {
  args: unknown;
  error: (error: Error) => void;
  success: (result: unknown) => void;
};

const prefetchedItems = [
  {
    _creationTime: 1,
    _id: "todoItems:prefetched",
    createdAt: 1,
    createdByName: "Test User",
    createdByUserId: "users:test",
    done: false,
    notes: "",
    ownerId: "users:test",
    sortOrder: 0,
    title: "Prefetched item",
    updatedAt: 1,
  },
];
type Item = (typeof prefetchedItems)[number];

const nextItems = [
  {
    ...prefetchedItems[0],
    _id: "todoItems:next",
    title: "Next item",
  },
];

const createDeferred = <Value>() => {
  let resolve!: (value: Value) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<Value>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return { promise, reject, resolve };
};

const flushEffects = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

const itemsCacheSnapshot = (items: Item[]) =>
  [
    [
      convexQueryKey([api.todos.list, {}, {}]),
      {
        data: items,
        source: "ssr-prefetch" as const,
        timestamp: 1,
      },
    ],
  ] satisfies ReturnType<ReturnType<typeof createSolidConvex>["dehydrate"]>;

const createBrowserClient = (
  queryResult: unknown,
  options?: {
    mutation?: (args: unknown) => Promise<unknown>;
  },
) => {
  const queryCalls: unknown[] = [];
  const mutationCalls: unknown[] = [];
  const subscriptions: Subscription[] = [];
  let unsubscribeCount = 0;

  return {
    client: {
      action: async () => undefined,
      mutation: async (_mutation: unknown, args: unknown) => {
        mutationCalls.push(args);
        return await (options?.mutation?.(args) ?? { ok: true });
      },
      onUpdate: (
        _query: unknown,
        args: unknown,
        success: (result: unknown) => void,
        error: (error: Error) => void,
      ) => {
        subscriptions.push({ args, error, success });
        return () => {
          unsubscribeCount += 1;
        };
      },
      query: async (_query: unknown, args: unknown) => {
        queryCalls.push(args);
        return queryResult;
      },
      setAuth: () => {},
    } as unknown as BrowserClient,
    get unsubscribeCount() {
      return unsubscribeCount;
    },
    mutationCalls,
    queryCalls,
    subscriptions,
  };
};

const createServerClient = (queryResult: unknown) => {
  const queryCalls: unknown[] = [];

  return {
    client: {
      query: async (_query: unknown, args: unknown) => {
        queryCalls.push(args);
        return queryResult;
      },
      setAuth: () => {},
    } as unknown as ServerClient,
    queryCalls,
  };
};

describe("Solid Convex Public prefetch cache", () => {
  test("server prefetch snapshots hydrate the browser cache for useQuery", async () => {
    const serverClient = createServerClient(prefetchedItems);
    const server = createSolidConvexServer({
      client: serverClient.client,
    });

    await expect(server.prefetch(api.todos.list)).resolves.toEqual(
      prefetchedItems,
    );
    expect(serverClient.queryCalls).toHaveLength(1);
    expect(server.dehydrate()[0]?.[1].source).toBe("ssr-prefetch");

    const browserClient = createBrowserClient([]);
    const convex = createSolidConvex({
      client: browserClient.client,
      initialCache: server.dehydrate(),
    });
    const root = createRoot((dispose) => {
      const items = convex.useQuery(api.todos.list);
      const [tupleItems, tupleState] = items;

      return {
        dispose,
        items,
        tupleItems,
        tupleState,
      };
    });

    try {
      expect(root.items()).toEqual(prefetchedItems);
      expect(root.items.state.status()).toBe("success");
      expect(root.items.state.isLoading()).toBe(false);
      expect(root.items.state.isSuccess()).toBe(true);
      expect(root.tupleItems()).toEqual(prefetchedItems);
      expect(root.tupleState).toBe(root.items.state);
      expect(browserClient.queryCalls).toHaveLength(0);
    } finally {
      root.dispose();
    }
  });

  test("server prefetch returns cached data on repeated calls", async () => {
    const serverClient = createServerClient(prefetchedItems);
    const server = createSolidConvexServer({
      client: serverClient.client,
    });

    await expect(server.prefetch(api.todos.list)).resolves.toEqual(
      prefetchedItems,
    );
    await expect(server.prefetch(api.todos.list)).resolves.toEqual(
      prefetchedItems,
    );

    expect(serverClient.queryCalls).toHaveLength(1);
  });

  test("concurrent prefetches share the same inflight request", async () => {
    const deferred = createDeferred<typeof prefetchedItems>();
    const serverClient = createServerClient(deferred.promise);
    const server = createSolidConvexServer({
      client: serverClient.client,
    });

    const first = server.prefetch(api.todos.list);
    const second = server.prefetch(api.todos.list);

    await flushEffects();
    expect(serverClient.queryCalls).toHaveLength(1);
    deferred.resolve(prefetchedItems);

    await expect(first).resolves.toEqual(prefetchedItems);
    await expect(second).resolves.toEqual(prefetchedItems);
    expect(serverClient.queryCalls).toHaveLength(1);
  });

  test("prefetchBatch returns keyed object results", async () => {
    const serverClient = createServerClient(prefetchedItems);
    const server = createSolidConvexServer({
      client: serverClient.client,
    });

    const { items, todos } = await prefetchBatch(server, [
      ["items", api.todos.list],
      ["todos", api.todos.list],
    ]);

    expect(items).toEqual(prefetchedItems);
    expect(todos).toEqual(prefetchedItems);
    expect(serverClient.queryCalls).toEqual([{}]);
    expect(server.dehydrate()).toHaveLength(1);
  });

  test("prefetchConvexBatch returns tuple results when entries are unkeyed", async () => {
    const serverClient = createServerClient(prefetchedItems);
    const server = createSolidConvexServer({
      client: serverClient.client,
    });

    const [items, todos] = await prefetchConvexBatch(server, [
      [api.todos.list],
      [api.todos.list],
    ]);

    expect(items).toEqual(prefetchedItems);
    expect(todos).toEqual(prefetchedItems);
    expect(serverClient.queryCalls).toEqual([{}]);
  });

  test("without hydrated data, useQuery exposes a loading state", () => {
    const browserClient = createBrowserClient([]);
    const convex = createSolidConvex({ client: browserClient.client });
    const root = createRoot((dispose) => {
      const items = convex.useQuery(api.todos.list);

      return { dispose, items };
    });

    try {
      expect(root.items()).toBeUndefined();
      expect(root.items.state.status()).toBe("loading");
      expect(root.items.state.isLoading()).toBe(true);
      expect(root.items.state.isFetching()).toBe(true);
      expect(root.items.state.error()).toBeUndefined();
      expect(browserClient.queryCalls).toHaveLength(0);
    } finally {
      root.dispose();
    }
  });

  test("disabled queries are idle and do not subscribe", async () => {
    const browserClient = createBrowserClient([]);
    const convex = createSolidConvex({ client: browserClient.client });
    const root = createRoot((dispose) => {
      const items = convex.useQuery(api.todos.list, { enabled: false });

      return { dispose, items };
    });

    try {
      await flushEffects();
      expect(root.items()).toBeUndefined();
      expect(root.items.state.status()).toBe("idle");
      expect(root.items.state.isIdle()).toBe(true);
      expect(browserClient.subscriptions).toHaveLength(0);
    } finally {
      root.dispose();
    }
  });

  test("hydrating an active query moves it from loading to success", () => {
    const browserClient = createBrowserClient([]);
    const convex = createSolidConvex({ client: browserClient.client });
    const root = createRoot((dispose) => {
      const items = convex.useQuery(api.todos.list);

      return { dispose, items };
    });

    try {
      expect(root.items.state.status()).toBe("loading");
      convex.hydrate(itemsCacheSnapshot(prefetchedItems));
      expect(root.items()).toEqual(prefetchedItems);
      expect(root.items.state.status()).toBe("success");
      expect(root.items.state.data()).toEqual(prefetchedItems);
    } finally {
      root.dispose();
    }
  });

  test("browser subscription updates cache, callbacks, error state, and cleanup", async () => {
    const browserClient = createBrowserClient([]);
    const successes: unknown[] = [];
    const errors: Error[] = [];
    const convex = createSolidConvex({ client: browserClient.client });
    const root = createRoot((dispose) => {
      const items = convex.useQuery(api.todos.list, {
        onError: (error) => errors.push(error),
        onSuccess: (result) => successes.push(result),
      });

      return { dispose, items };
    });

    try {
      await flushEffects();
      expect(browserClient.subscriptions).toHaveLength(1);
      expect(browserClient.subscriptions[0]?.args).toEqual({});
      expect(root.items.state.status()).toBe("loading");

      browserClient.subscriptions[0]?.success(prefetchedItems);
      expect(root.items()).toEqual(prefetchedItems);
      expect(root.items.state.status()).toBe("success");
      expect(successes).toEqual([prefetchedItems]);

      const error = new Error("Subscription failed");
      browserClient.subscriptions[0]?.error(error);
      expect(root.items()).toEqual(prefetchedItems);
      expect(root.items.state.error()).toBe(error);
      expect(root.items.state.status()).toBe("error");
      expect(errors).toEqual([error]);

      browserClient.subscriptions[0]?.success(nextItems);
      expect(root.items()).toEqual(nextItems);
      expect(root.items.state.error()).toBeUndefined();
      expect(root.items.state.status()).toBe("success");
      expect(successes).toEqual([prefetchedItems, nextItems]);
    } finally {
      root.dispose();
    }

    expect(browserClient.unsubscribeCount).toBe(1);
  });
});

describe("Solid Convex Public optimistic mutation cache", () => {
  test("optimistic updates write through to subscribed query cache", async () => {
    const deferred = createDeferred<{ ok: true }>();
    const browserClient = createBrowserClient([], {
      mutation: async () => await deferred.promise,
    });
    const convex = createSolidConvex({
      client: browserClient.client,
      initialCache: itemsCacheSnapshot(prefetchedItems),
    });
    const root = createRoot((dispose) => {
      const items = convex.useQuery(api.todos.list);

      return { dispose, items };
    });
    const toggle = convex.useMutation(api.todos.toggle, {
      optimistic: {
        apply: (current, mutationArgs) =>
          current?.map((item) =>
            item._id === mutationArgs.id ? { ...item, done: !item.done } : item,
          ),
        query: api.todos.list,
      },
    });

    try {
      const promise = toggle({
        id: prefetchedItems[0]._id as Id<"todoItems">,
      });

      expect(root.items()?.[0]?.done).toBe(true);
      expect(convex.dehydrate()[0]?.[1].source).toBe("csr-optimistic");

      deferred.resolve({ ok: true });
      await expect(promise).resolves.toEqual({ ok: true });
      expect(browserClient.mutationCalls).toEqual([
        { id: prefetchedItems[0]._id },
      ]);
      expect(root.items()?.[0]?.done).toBe(true);
    } finally {
      root.dispose();
    }
  });

  test("failed optimistic updates roll back and expose userMessage", async () => {
    const mutationError = new Error("Todo not found.");
    const browserClient = createBrowserClient([], {
      mutation: async () => {
        throw mutationError;
      },
    });
    const errors: Error[] = [];
    const convex = createSolidConvex({
      client: browserClient.client,
      initialCache: itemsCacheSnapshot(prefetchedItems),
    });
    const root = createRoot((dispose) => {
      const items = convex.useQuery(api.todos.list);

      return { dispose, items };
    });
    const toggle = convex.useMutation(api.todos.toggle, {
      onError: (error) => errors.push(error),
      optimistic: {
        apply: (current, mutationArgs) =>
          current?.map((item) =>
            item._id === mutationArgs.id ? { ...item, done: !item.done } : item,
          ),
        query: api.todos.list,
      },
    });

    try {
      const promise = toggle({
        id: prefetchedItems[0]._id as Id<"todoItems">,
      });

      expect(root.items()?.[0]?.done).toBe(true);
      await expect(promise).rejects.toThrow("Todo not found.");
      expect(root.items()).toEqual(prefetchedItems);
      expect(errors[0]).toMatchObject({
        message: "Todo not found.",
        userMessage: "Todo not found.",
      });
    } finally {
      root.dispose();
    }
  });
});
