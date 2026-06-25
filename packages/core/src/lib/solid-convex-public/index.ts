import type {
  FunctionArgs,
  FunctionReference,
  FunctionReturnType,
} from "convex/server";
import { getFunctionName } from "convex/server";
import { convexToJson } from "convex/values";
import {
  type Accessor,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  useContext,
} from "solid-js";
import { isServer } from "solid-js/web";
import { ConvexClient, ConvexHttpClient } from "convex/browser";

type Awaitable<T> = T | Promise<T>;

export type AuthTokenProvider = (opts: {
  forceRefreshToken: boolean;
}) => Awaitable<string | null | undefined>;

export type CreateSolidConvexOptions =
  | {
      client: ConvexClient;
      getAuthToken?: AuthTokenProvider;
      initialCache?: ConvexCacheSnapshot;
      url?: never;
    }
  | {
      client?: never;
      getAuthToken?: AuthTokenProvider;
      initialCache?: ConvexCacheSnapshot;
      url?: string;
    };

export type CreateSolidConvexServerOptions =
  | {
      authToken?: string | null;
      client: ConvexHttpClient;
      getAuthToken?: () => Awaitable<string | null | undefined>;
      initialCache?: ConvexCacheSnapshot;
      url?: never;
    }
  | {
      authToken?: string | null;
      client?: never;
      getAuthToken?: () => Awaitable<string | null | undefined>;
      initialCache?: ConvexCacheSnapshot;
      url?: string;
    };

type NoArgs<Args> = keyof Args extends never ? true : false;

export type QueryArgsTuple<Query extends FunctionReference<"query">> =
  NoArgs<FunctionArgs<Query>> extends true
    ? [args?: FunctionArgs<Query>]
    : [args: FunctionArgs<Query>];

export type SolidConvexPrefetchReader = {
  prefetch<Query extends FunctionReference<"query">>(
    query: Query,
    ...argsTuple: QueryArgsTuple<Query>
  ): Promise<FunctionReturnType<Query> | undefined>;
};

export type TuplePrefetchEntry<
  Query extends FunctionReference<"query"> = FunctionReference<"query">,
> =
  | readonly [query: Query]
  | readonly [query: Query, args: FunctionArgs<Query>];

export type KeyedPrefetchEntry<
  Key extends string = string,
  Query extends FunctionReference<"query"> = FunctionReference<"query">,
> =
  | readonly [key: Key, query: Query]
  | readonly [key: Key, query: Query, args: FunctionArgs<Query>];

export type PrefetchBatchEntry = TuplePrefetchEntry | KeyedPrefetchEntry;

type PrefetchEntryData<Entry> = Entry extends readonly [
  string,
  infer Query extends FunctionReference<"query">,
  ...unknown[],
]
  ? FunctionReturnType<Query> | undefined
  : Entry extends readonly [
        infer Query extends FunctionReference<"query">,
        ...unknown[],
      ]
    ? FunctionReturnType<Query> | undefined
    : never;

export type PrefetchBatchResult<Entries extends readonly PrefetchBatchEntry[]> =
  Entries extends readonly KeyedPrefetchEntry[]
    ? {
        [Entry in Entries[number] as Entry extends readonly [
          infer Key extends string,
          ...unknown[],
        ]
          ? Key
          : never]: PrefetchEntryData<Entry>;
      }
    : {
        [Index in keyof Entries]: PrefetchEntryData<Entries[Index]>;
      };

export type MutationArgsTuple<Mutation extends FunctionReference<"mutation">> =
  NoArgs<FunctionArgs<Mutation>> extends true
    ? [args?: FunctionArgs<Mutation>]
    : [args: FunctionArgs<Mutation>];

export type ActionArgsTuple<Action extends FunctionReference<"action">> =
  NoArgs<FunctionArgs<Action>> extends true
    ? [args?: FunctionArgs<Action>]
    : [args: FunctionArgs<Action>];

export type QueryArgsSource<Query extends FunctionReference<"query">> =
  | (() => FunctionArgs<Query>)
  | FunctionArgs<Query>
  | undefined;

type UseQueryBaseOptions<Query extends FunctionReference<"query">> = {
  onSuccess?: (result: FunctionReturnType<Query>) => void;
  onError?: (error: Error) => void;
  debug?: boolean;
  enabled?: boolean | (() => boolean);
  initialData?: FunctionReturnType<Query> | (() => FunctionReturnType<Query>);
};

export type UseQueryOptions<Query extends FunctionReference<"query">> =
  UseQueryBaseOptions<Query> &
    (NoArgs<FunctionArgs<Query>> extends true
      ? { args?: () => FunctionArgs<Query> }
      : { args: () => FunctionArgs<Query> });

export type UseQueryOptionsTuple<Query extends FunctionReference<"query">> =
  NoArgs<FunctionArgs<Query>> extends true
    ? [options?: UseQueryOptions<Query>]
    : [options: UseQueryOptions<Query>];

type UseQueryOptionsWithInitialDataTuple<
  Query extends FunctionReference<"query">,
> =
  NoArgs<FunctionArgs<Query>> extends true
    ? [options: UseQueryOptionsWithInitialData<Query>]
    : [options: UseQueryOptionsWithInitialData<Query>];

export type QueryStatus = "idle" | "loading" | "success" | "error";
export type MutationStatus = "idle" | "pending" | "success" | "error";

type QueryDataAccessorValue<
  Data,
  HasInitialData extends boolean,
> = HasInitialData extends true ? Data : Data | undefined;

export type UseQueryState<Data, HasInitialData extends boolean = false> = {
  data: Accessor<QueryDataAccessorValue<Data, HasInitialData>>;
  error: Accessor<Error | undefined>;
  isError: Accessor<boolean>;
  isFetching: Accessor<boolean>;
  isIdle: Accessor<boolean>;
  isLoading: Accessor<boolean>;
  isSuccess: Accessor<boolean>;
  status: Accessor<QueryStatus>;
};

export type UseQueryResult<
  Data,
  HasInitialData extends boolean = false,
> = Accessor<QueryDataAccessorValue<Data, HasInitialData>> &
  readonly [
    Accessor<QueryDataAccessorValue<Data, HasInitialData>>,
    UseQueryState<Data, HasInitialData>,
  ] & {
    state: UseQueryState<Data, HasInitialData>;
  };

export type UseMutationState<Result, Variables> = {
  data: Accessor<Result | undefined>;
  error: Accessor<ConvexError | undefined>;
  isError: Accessor<boolean>;
  isIdle: Accessor<boolean>;
  isLoading: Accessor<boolean>;
  isPending: Accessor<boolean>;
  isSuccess: Accessor<boolean>;
  reset: () => void;
  status: Accessor<MutationStatus>;
  variables: Accessor<Variables | undefined>;
};

type MutationFunction<Mutation extends FunctionReference<"mutation">> = (
  ...argsTuple: MutationArgsTuple<Mutation>
) => Promise<FunctionReturnType<Mutation>>;

export type UseMutationResult<Mutation extends FunctionReference<"mutation">> =
  MutationFunction<Mutation> &
    readonly [
      MutationFunction<Mutation>,
      UseMutationState<FunctionReturnType<Mutation>, FunctionArgs<Mutation>>,
    ] & {
      state: UseMutationState<
        FunctionReturnType<Mutation>,
        FunctionArgs<Mutation>
      >;
    };

type UseQueryOptionsWithInitialData<Query extends FunctionReference<"query">> =
  UseQueryOptions<Query> & {
    initialData: FunctionReturnType<Query> | (() => FunctionReturnType<Query>);
  };

type CacheSource =
  | "ssr-prefetch"
  | "csr-prefetch"
  | "csr-optimistic"
  | "subscription";

export type ConvexError = Error & { userMessage: string };

export type CacheEntry<T = unknown> = {
  data: T;
  source: CacheSource;
  timestamp: number;
};

export type ConvexCacheSnapshot = Array<[string, CacheEntry]>;

export type OptimisticUpdate<
  Mutation extends FunctionReference<"mutation">,
  Query extends FunctionReference<"query">,
> = {
  query: Query;
  args?: QueryArgsSource<Query>;
  apply: (
    currentData: FunctionReturnType<Query> | undefined,
    mutationArgs: FunctionArgs<Mutation>,
  ) => FunctionReturnType<Query> | undefined;
  rollbackOnError?: boolean;
};

export type UseMutationOptions<
  Mutation extends FunctionReference<"mutation">,
  Query extends FunctionReference<"query"> = FunctionReference<"query">,
> = {
  onSuccess?: (result: FunctionReturnType<Mutation>) => void;
  onError?: (error: ConvexError) => void;
  optimistic?:
    | OptimisticUpdate<Mutation, Query>
    | OptimisticUpdate<Mutation, Query>[];
  debounce?: number;
};

class ReactiveCacheMap<K, V> implements Map<K, V> {
  readonly [Symbol.toStringTag] = "ReactiveCacheMap";

  private readonly map = new Map<K, V>();
  private readonly version: () => number;
  private readonly setVersion: (next: (version: number) => number) => number;

  constructor() {
    const [version, setVersion] = createSignal(0);
    this.version = version;
    this.setVersion = setVersion;
  }

  get size() {
    this.version();
    return this.map.size;
  }

  clear() {
    if (this.map.size === 0) {
      return;
    }

    this.map.clear();
    this.bump();
  }

  delete(key: K) {
    const deleted = this.map.delete(key);
    if (deleted) {
      this.bump();
    }

    return deleted;
  }

  entries() {
    this.version();
    return this.map.entries();
  }

  forEach(
    callbackfn: (value: V, key: K, map: Map<K, V>) => void,
    thisArg?: unknown,
  ) {
    this.version();
    this.map.forEach((value, key) =>
      callbackfn.call(thisArg, value, key, this),
    );
  }

  get(key: K) {
    this.version();
    return this.map.get(key);
  }

  has(key: K) {
    this.version();
    return this.map.has(key);
  }

  keys() {
    this.version();
    return this.map.keys();
  }

  set(key: K, value: V) {
    this.map.set(key, value);
    this.bump();
    return this;
  }

  values() {
    this.version();
    return this.map.values();
  }

  [Symbol.iterator]() {
    this.version();
    return this.map[Symbol.iterator]();
  }

  private bump() {
    this.setVersion((version) => version + 1);
  }
}

const createConvexCache = () => new ReactiveCacheMap<string, CacheEntry>();

const createQueryResult = <Data, HasInitialData extends boolean = false>(
  data: Accessor<QueryDataAccessorValue<Data, HasInitialData>>,
  state: UseQueryState<Data, HasInitialData>,
): UseQueryResult<Data, HasInitialData> => {
  const result = data as UseQueryResult<Data, HasInitialData>;

  Object.defineProperties(result, {
    0: { value: data },
    1: { value: state },
    state: { value: state },
    [Symbol.iterator]: {
      value: function* iterator() {
        yield data;
        yield state;
      },
    },
  });

  return result;
};

const createMutationResult = <Mutation extends FunctionReference<"mutation">>(
  mutate: MutationFunction<Mutation>,
  state: UseMutationState<FunctionReturnType<Mutation>, FunctionArgs<Mutation>>,
): UseMutationResult<Mutation> => {
  const result = mutate as UseMutationResult<Mutation>;

  Object.defineProperties(result, {
    0: { value: mutate },
    1: { value: state },
    state: { value: state },
    [Symbol.iterator]: {
      value: function* iterator() {
        yield mutate;
        yield state;
      },
    },
  });

  return result;
};

const hydrateCache = (
  cache: ReactiveCacheMap<string, CacheEntry>,
  snapshot?: ConvexCacheSnapshot,
) => {
  if (!snapshot) {
    return;
  }

  for (const [key, entry] of snapshot) {
    cache.set(key, entry);
  }
};

const emptyQueryArgs = <Query extends FunctionReference<"query">>() =>
  ({}) as FunctionArgs<Query>;

const emptyMutationArgs = <Mutation extends FunctionReference<"mutation">>() =>
  ({}) as FunctionArgs<Mutation>;

const emptyActionArgs = <Action extends FunctionReference<"action">>() =>
  ({}) as FunctionArgs<Action>;

const normalizeQueryArgs = <Query extends FunctionReference<"query">>(
  args?: FunctionArgs<Query>,
): FunctionArgs<Query> => args ?? emptyQueryArgs<Query>();

const normalizeQueryArgsSource = <Query extends FunctionReference<"query">>(
  argsSource: QueryArgsSource<Query>,
): FunctionArgs<Query> => {
  if (typeof argsSource === "function") {
    return (argsSource as () => FunctionArgs<Query>)();
  }

  return argsSource ?? emptyQueryArgs<Query>();
};

const normalizeOptimistic = <
  Mutation extends FunctionReference<"mutation">,
  Query extends FunctionReference<"query">,
>(
  optimistic?:
    | OptimisticUpdate<Mutation, Query>
    | OptimisticUpdate<Mutation, Query>[],
): OptimisticUpdate<Mutation, Query>[] => {
  if (!optimistic) {
    return [];
  }

  return Array.isArray(optimistic) ? optimistic : [optimistic];
};

export function getUserErrorMessage(error: Error, fallback?: string): string {
  const defaultMessage = fallback ?? "Er is een onverwachte fout opgetreden";

  if (!error.message) {
    return defaultMessage;
  }

  const match = error.message.match(
    /(?:Uncaught\s+)?(?:Error:\s*)?(.+?)(?:\s+at\s+|$)/i,
  );
  const extracted = match?.[1]?.trim();

  return extracted && extracted.length > 0 ? extracted : defaultMessage;
}

export function convexQueryKey(
  queryKey: [
    FunctionReference<"query">,
    Record<string, unknown>,
    NonNullable<unknown>,
  ],
): string {
  const jsonArgs = convexToJson(
    queryKey[1] as Parameters<typeof convexToJson>[0],
  );

  return `${getFunctionName(queryKey[0])}|${JSON.stringify(jsonArgs)}`;
}

const createBrowserQueryRunner =
  (getClient: () => ConvexClient) =>
  async <Query extends FunctionReference<"query">>(
    query: Query,
    args: FunctionArgs<Query>,
  ): Promise<FunctionReturnType<Query> | undefined> =>
    (await getClient().query(query, args)) as FunctionReturnType<Query>;

const createServerQueryRunner =
  (getClient: () => Promise<ConvexHttpClient>) =>
  async <Query extends FunctionReference<"query">>(
    query: Query,
    args: FunctionArgs<Query>,
  ): Promise<FunctionReturnType<Query> | undefined> =>
    (await (await getClient()).query(query, args)) as FunctionReturnType<Query>;

const createPrefetcher =
  <Source extends CacheSource>(
    cache: ReactiveCacheMap<string, CacheEntry>,
    inflightRequests: Map<string, Promise<unknown>>,
    source: Source,
    isEnabled: () => boolean,
    runQuery: <Query extends FunctionReference<"query">>(
      query: Query,
      args: FunctionArgs<Query>,
    ) => Promise<FunctionReturnType<Query> | undefined>,
  ) =>
  async <Query extends FunctionReference<"query">>(
    query: Query,
    ...argsTuple: QueryArgsTuple<Query>
  ): Promise<FunctionReturnType<Query> | undefined> => {
    if (!isEnabled()) {
      return undefined;
    }

    const fullArgs = normalizeQueryArgs(argsTuple[0]);
    const key = convexQueryKey([
      query,
      fullArgs as Record<string, unknown>,
      {},
    ]);

    const inflight = inflightRequests.get(key);
    if (inflight) {
      return inflight as Promise<FunctionReturnType<Query> | undefined>;
    }

    const cached = cache.get(key);
    if (cached) {
      return cached.data as FunctionReturnType<Query>;
    }

    const promise = runQuery(query, fullArgs)
      .then((data) => {
        if (data !== undefined) {
          cache.set(key, {
            data,
            source,
            timestamp: Date.now(),
          });
        }

        return data;
      })
      .finally(() => inflightRequests.delete(key));

    inflightRequests.set(key, promise);
    return promise;
  };

export async function prefetchBatch<
  Entries extends readonly PrefetchBatchEntry[],
>(
  convex: SolidConvexPrefetchReader,
  entries: Entries,
): Promise<PrefetchBatchResult<Entries>> {
  const keyed = entries.every((entry) => typeof entry[0] === "string");
  const runPrefetch = convex.prefetch as (
    query: FunctionReference<"query">,
    args?: Record<string, unknown>,
  ) => Promise<unknown>;
  const values = await Promise.all(
    entries.map((entry) => {
      const query = keyed ? entry[1] : entry[0];
      const args = keyed ? entry[2] : entry[1];

      return args === undefined
        ? runPrefetch(query as FunctionReference<"query">)
        : runPrefetch(
            query as FunctionReference<"query">,
            args as Record<string, unknown>,
          );
    }),
  );

  if (!keyed) {
    return values as unknown as PrefetchBatchResult<Entries>;
  }

  return Object.fromEntries(
    entries.map((entry, index) => [entry[0], values[index]]),
  ) as PrefetchBatchResult<Entries>;
}

export const prefetchConvexBatch = prefetchBatch;

const resolveInitialData = <Data>(
  initialData: Data | (() => Data) | undefined,
): Data | undefined =>
  typeof initialData === "function"
    ? (initialData as () => Data)()
    : initialData;

const createUseQuery = (
  cache: ReactiveCacheMap<string, CacheEntry>,
  isInstanceEnabled: () => boolean,
  getClient: () => ConvexClient,
) => {
  function useQueryForInstance<Query extends FunctionReference<"query">>(
    query: Query,
    ...optionsTuple: UseQueryOptionsWithInitialDataTuple<Query>
  ): UseQueryResult<FunctionReturnType<Query>, true>;
  function useQueryForInstance<Query extends FunctionReference<"query">>(
    query: Query,
    ...optionsTuple: UseQueryOptionsTuple<Query>
  ): UseQueryResult<FunctionReturnType<Query>>;
  function useQueryForInstance<Query extends FunctionReference<"query">>(
    query: Query,
    ...optionsTuple: UseQueryOptionsTuple<Query>
  ): UseQueryResult<FunctionReturnType<Query>, boolean> {
    const options = optionsTuple[0];
    const isEnabled = () =>
      !isInstanceEnabled()
        ? false
        : typeof options?.enabled === "function"
          ? options.enabled()
          : (options?.enabled ?? true);

    const fullArgs = createMemo(() =>
      options?.args ? options.args() : emptyQueryArgs<Query>(),
    );
    const cacheKey = createMemo(() =>
      convexQueryKey([query, fullArgs() as Record<string, unknown>, {}]),
    );
    const [error, setError] = createSignal<Error>();
    const initialData = createMemo(() =>
      resolveInitialData(options?.initialData),
    );

    createEffect(() => {
      isEnabled();
      cacheKey();
      setError(undefined);
    });

    const value = createMemo<FunctionReturnType<Query> | undefined>(() => {
      if (!isEnabled()) {
        return initialData();
      }

      const cached = cache.get(cacheKey());
      return (
        (cached?.data as FunctionReturnType<Query> | undefined) ?? initialData()
      );
    });
    const status = createMemo<QueryStatus>(() => {
      if (!isEnabled()) {
        return "idle";
      }

      if (error()) {
        return "error";
      }

      if (cache.has(cacheKey())) {
        return "success";
      }

      return "loading";
    });
    const state: UseQueryState<FunctionReturnType<Query>> = {
      data: value,
      error,
      isError: () => status() === "error",
      isFetching: () => status() === "loading",
      isIdle: () => status() === "idle",
      isLoading: () => status() === "loading",
      isSuccess: () => status() === "success",
      status,
    };

    createEffect(() => {
      if (!options?.debug || !isEnabled()) {
        return;
      }

      const cached = cache.get(cacheKey());

      console.debug(`Convex cache ${cacheKey()}`, cached);
    });

    createEffect(() => {
      if (isServer || !isEnabled()) {
        return;
      }

      const resolvedArgs = fullArgs();
      const key = cacheKey();
      let disposed = false;
      let unsubscribe: (() => void) | undefined;

      Promise.resolve()
        .then(() => getClient())
        .then((client) => {
          if (disposed) {
            return;
          }

          unsubscribe = client.onUpdate(
            query,
            resolvedArgs,
            (result) => {
              setError(undefined);
              cache.set(key, {
                data: result,
                source: "subscription",
                timestamp: Date.now(),
              });
              options?.onSuccess?.(result);
            },
            (error) => {
              setError(error);
              options?.onError?.(error);
            },
          );
        })
        .catch((error: unknown) => {
          const normalizedError =
            error instanceof Error ? error : new Error(String(error));
          setError(normalizedError);
          options?.onError?.(normalizedError);
        });

      onCleanup(() => {
        disposed = true;
        unsubscribe?.();
      });
    });

    return createQueryResult(value, state);
  }

  return useQueryForInstance;
};

const createUseMutation = (
  cache: ReactiveCacheMap<string, CacheEntry>,
  isEnabled: () => boolean,
  getClient: () => ConvexClient,
) =>
  function useMutationForInstance<
    Mutation extends FunctionReference<"mutation">,
    Query extends FunctionReference<"query"> = FunctionReference<"query">,
  >(
    mutation: Mutation,
    options?: UseMutationOptions<Mutation, Query>,
  ): UseMutationResult<Mutation> {
    const debounceMs = options?.debounce ?? 0;
    const optimisticEntries = normalizeOptimistic(options?.optimistic);
    const [data, setData] = createSignal<FunctionReturnType<Mutation>>();
    const [error, setError] = createSignal<ConvexError>();
    const [status, setStatus] = createSignal<MutationStatus>("idle");
    const [variables, setVariables] = createSignal<FunctionArgs<Mutation>>();
    let debounceTimeout: ReturnType<typeof setTimeout> | undefined;
    let pendingResolve:
      | ((value: FunctionReturnType<Mutation>) => void)
      | undefined;
    let pendingReject: ((error: Error) => void) | undefined;
    let latestRequestId = 0;
    let appliedOptimisticEntries: Array<{
      key: string;
      previous?: CacheEntry;
      shouldRollback: boolean;
    }> = [];

    const reset = () => {
      latestRequestId += 1;
      setData(undefined);
      setError(undefined);
      setStatus("idle");
      setVariables(undefined);
    };

    const state: UseMutationState<
      FunctionReturnType<Mutation>,
      FunctionArgs<Mutation>
    > = {
      data,
      error,
      isError: () => status() === "error",
      isIdle: () => status() === "idle",
      isLoading: () => status() === "pending",
      isPending: () => status() === "pending",
      isSuccess: () => status() === "success",
      reset,
      status,
      variables,
    };

    const applyOptimisticUpdate = (
      optimistic: OptimisticUpdate<Mutation, Query>,
      fullArgs: FunctionArgs<Mutation>,
    ) => {
      const resolvedArgs = normalizeQueryArgsSource(optimistic.args);
      const cacheKey = convexQueryKey([
        optimistic.query,
        resolvedArgs as Record<string, unknown>,
        {},
      ]);
      const existingEntry = cache.get(cacheKey) as
        | CacheEntry<FunctionReturnType<Query>>
        | undefined;
      const nextData = optimistic.apply(existingEntry?.data, fullArgs);

      if (nextData === undefined) {
        return;
      }

      if (!appliedOptimisticEntries.some((entry) => entry.key === cacheKey)) {
        appliedOptimisticEntries.push({
          key: cacheKey,
          previous: existingEntry,
          shouldRollback: optimistic.rollbackOnError !== false,
        });
      }

      cache.set(cacheKey, {
        data: nextData,
        source: "csr-optimistic",
        timestamp: Date.now(),
      });
    };

    const rollbackOptimisticUpdates = () => {
      for (const {
        key,
        previous,
        shouldRollback,
      } of appliedOptimisticEntries) {
        if (!shouldRollback) {
          continue;
        }

        if (previous) {
          cache.set(key, previous);
        } else {
          cache.delete(key);
        }
      }

      appliedOptimisticEntries = [];
    };

    const executeNetworkCall = async (
      fullArgs: FunctionArgs<Mutation>,
      requestId: number,
    ): Promise<FunctionReturnType<Mutation>> => {
      try {
        if (!isEnabled()) {
          throw new Error("Solid Convex is disabled.");
        }

        const result = (await getClient().mutation(
          mutation,
          fullArgs,
        )) as FunctionReturnType<Mutation>;
        appliedOptimisticEntries = [];
        if (requestId === latestRequestId) {
          setData(() => result);
          setError(undefined);
          setStatus("success");
        }
        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        rollbackOptimisticUpdates();
        const normalizedError =
          error instanceof Error ? error : new Error(String(error));
        const convexError: ConvexError = Object.assign(normalizedError, {
          userMessage: getUserErrorMessage(normalizedError),
        });
        if (requestId === latestRequestId) {
          setError(() => convexError);
          setStatus("error");
        }
        options?.onError?.(convexError);
        throw normalizedError;
      }
    };

    const mutate: MutationFunction<Mutation> = (...argsTuple) => {
      const fullArgs = argsTuple[0] ?? emptyMutationArgs<Mutation>();
      const requestId = latestRequestId + 1;
      latestRequestId = requestId;

      setVariables(() => fullArgs);
      setError(undefined);
      setStatus("pending");

      for (const optimisticEntry of optimisticEntries) {
        applyOptimisticUpdate(optimisticEntry, fullArgs);
      }

      if (debounceMs <= 0) {
        return executeNetworkCall(fullArgs, requestId);
      }

      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      return new Promise<FunctionReturnType<Mutation>>((resolve, reject) => {
        pendingResolve = resolve;
        pendingReject = reject;

        debounceTimeout = setTimeout(() => {
          debounceTimeout = undefined;
          executeNetworkCall(fullArgs, requestId)
            .then((result) => {
              pendingResolve?.(result);
              pendingResolve = undefined;
              pendingReject = undefined;
            })
            .catch((error: Error) => {
              pendingReject?.(error);
              pendingResolve = undefined;
              pendingReject = undefined;
            });
        }, debounceMs);
      });
    };

    return createMutationResult(mutate, state);
  };

const createUseAction = (
  isEnabled: () => boolean,
  getClient: () => ConvexClient,
) =>
  function createActionForInstance<Action extends FunctionReference<"action">>(
    actionReference: Action,
    options?: {
      onSuccess?: (result: FunctionReturnType<Action>) => void;
      onError?: (error: ConvexError) => void;
    },
  ): (
    ...argsTuple: ActionArgsTuple<Action>
  ) => Promise<FunctionReturnType<Action>> {
    return async (...argsTuple) => {
      const fullArgs = argsTuple[0] ?? emptyActionArgs<Action>();

      try {
        if (!isEnabled()) {
          throw new Error("Solid Convex is disabled.");
        }

        const result = (await getClient().action(
          actionReference,
          fullArgs,
        )) as FunctionReturnType<Action>;
        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        const normalizedError =
          error instanceof Error ? error : new Error(String(error));
        const convexError: ConvexError = Object.assign(normalizedError, {
          userMessage: getUserErrorMessage(normalizedError),
        });
        options?.onError?.(convexError);
        throw normalizedError;
      }
    };
  };

export function createSolidConvex(options: CreateSolidConvexOptions) {
  const cache = createConvexCache();
  const inflightRequests = new Map<string, Promise<unknown>>();
  let client: ConvexClient | undefined = options.client;
  let authConfigured = false;
  const isEnabled = () => Boolean(client || options.url);

  hydrateCache(cache, options.initialCache);

  const configureAuth = (resolvedClient: ConvexClient) => {
    if (!options.getAuthToken) {
      return;
    }

    resolvedClient.setAuth(async (opts) => {
      try {
        return (await options.getAuthToken?.(opts)) ?? undefined;
      } catch (error) {
        console.warn("Unable to resolve Convex auth token.", error);
        return undefined;
      }
    });
    authConfigured = true;
  };

  const getClient = () => {
    if (isServer) {
      throw new Error(
        "The Solid Convex Public browser client is unavailable during SSR. Use createSolidConvexServer for server-side queries.",
      );
    }

    if (!client) {
      if (!options.url) {
        throw new Error("createSolidConvex requires a Convex URL or client.");
      }

      client = new ConvexClient(options.url);
    }

    if (!authConfigured) {
      configureAuth(client);
    }

    return client;
  };

  const refreshAuth = () => {
    if (!client || isServer) {
      return;
    }

    configureAuth(client);
  };

  const prefetch = createPrefetcher(
    cache,
    inflightRequests,
    "csr-prefetch",
    isEnabled,
    createBrowserQueryRunner(getClient),
  );
  const useQueryForInstance = createUseQuery(cache, isEnabled, getClient);
  const useMutationForInstance = createUseMutation(cache, isEnabled, getClient);
  const useActionForInstance = createUseAction(isEnabled, getClient);

  return {
    cache,
    clearCache: () => {
      cache.clear();
      inflightRequests.clear();
    },
    client: getClient,
    dehydrate: (): ConvexCacheSnapshot => [...cache.entries()],
    hydrate: (snapshot?: ConvexCacheSnapshot) => hydrateCache(cache, snapshot),
    prefetch,
    query: prefetch,
    refreshAuth,
    useAction: useActionForInstance,
    useMutation: useMutationForInstance,
    useQuery: useQueryForInstance,
  };
}

const createMissingServerUrlError = (): never => {
  throw new Error("createSolidConvexServer requires a Convex URL or client.");
};

export function createSolidConvexServer(
  options: CreateSolidConvexServerOptions,
) {
  const cache = createConvexCache();
  const inflightRequests = new Map<string, Promise<unknown>>();
  let client: ConvexHttpClient | undefined = options.client;
  const isEnabled = () => Boolean(client || options.url);

  hydrateCache(cache, options.initialCache);

  const applyAuth = async () => {
    if (!client) {
      client = new ConvexHttpClient(
        options.url ?? createMissingServerUrlError(),
      );
    }

    const token = options.authToken ?? (await options.getAuthToken?.()) ?? null;
    if (token) {
      client.setAuth(token);
    }

    return client;
  };

  const prefetch = createPrefetcher(
    cache,
    inflightRequests,
    "ssr-prefetch",
    isEnabled,
    createServerQueryRunner(applyAuth),
  );

  const mutation = async <Mutation extends FunctionReference<"mutation">>(
    mutationReference: Mutation,
    ...argsTuple: MutationArgsTuple<Mutation>
  ): Promise<FunctionReturnType<Mutation>> => {
    if (!isEnabled()) {
      throw new Error("Solid Convex is disabled.");
    }

    return (await (
      await applyAuth()
    ).mutation(
      mutationReference,
      argsTuple[0] ?? emptyMutationArgs<Mutation>(),
    )) as FunctionReturnType<Mutation>;
  };

  const action = async <Action extends FunctionReference<"action">>(
    actionReference: Action,
    ...argsTuple: ActionArgsTuple<Action>
  ): Promise<FunctionReturnType<Action>> => {
    if (!isEnabled()) {
      throw new Error("Solid Convex is disabled.");
    }

    return (await (
      await applyAuth()
    ).action(
      actionReference,
      argsTuple[0] ?? emptyActionArgs<Action>(),
    )) as FunctionReturnType<Action>;
  };

  return {
    action,
    cache,
    clearCache: () => {
      cache.clear();
      inflightRequests.clear();
    },
    client: () => {
      if (!client) {
        client = new ConvexHttpClient(
          options.url ?? createMissingServerUrlError(),
        );
      }

      return client;
    },
    dehydrate: (): ConvexCacheSnapshot => [...cache.entries()],
    hydrate: (snapshot?: ConvexCacheSnapshot) => hydrateCache(cache, snapshot),
    mutation,
    prefetch,
    query: prefetch,
  };
}

export type SolidConvex = ReturnType<typeof createSolidConvex>;
export type SolidConvexServer = ReturnType<typeof createSolidConvexServer>;
export type SolidConvexReader = Pick<SolidConvex, "prefetch">;
export type SolidConvexServerReader = Pick<SolidConvexServer, "prefetch">;

export const SolidConvexContext = createContext<SolidConvex>();

export function useSolidConvex() {
  const convex = useContext(SolidConvexContext);
  if (!convex) {
    throw new Error("useSolidConvex must be used within SolidConvexProvider.");
  }

  return convex;
}

export function useQuery<Query extends FunctionReference<"query">>(
  queryReference: Query,
  ...optionsTuple: UseQueryOptionsWithInitialDataTuple<Query>
): UseQueryResult<FunctionReturnType<Query>, true>;
export function useQuery<Query extends FunctionReference<"query">>(
  queryReference: Query,
  ...optionsTuple: UseQueryOptionsTuple<Query>
): UseQueryResult<FunctionReturnType<Query>>;
export function useQuery<Query extends FunctionReference<"query">>(
  queryReference: Query,
  ...optionsTuple: UseQueryOptionsTuple<Query>
): UseQueryResult<FunctionReturnType<Query>, boolean> {
  return useSolidConvex().useQuery(queryReference, ...optionsTuple);
}

export function useMutation<
  Mutation extends FunctionReference<"mutation">,
  Query extends FunctionReference<"query"> = FunctionReference<"query">,
>(
  mutationReference: Mutation,
  options?: UseMutationOptions<Mutation, Query>,
): UseMutationResult<Mutation> {
  return useSolidConvex().useMutation(mutationReference, options);
}

export function useAction<Action extends FunctionReference<"action">>(
  actionReference: Action,
  options?: {
    onSuccess?: (result: FunctionReturnType<Action>) => void;
    onError?: (error: ConvexError) => void;
  },
) {
  return useSolidConvex().useAction(actionReference, options);
}

export const query = useQuery;
export const mutation = useMutation;
export const action = useAction;
export const createQuery = useQuery;
export const createMutation = useMutation;
export const createAction = useAction;
