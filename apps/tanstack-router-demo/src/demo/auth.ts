import { createMemo, createSignal } from "solid-js";
import { api } from "@solid-convex-public/backend/convex/_generated/api";
import { mutation, query, useSolidConvex } from "@solid-convex-public/core";
import {
  parseDemoRole,
  subjectFromRole,
  type PermissionSubject,
} from "@solid-convex-public/permissions";
import { authClient } from "./runtime";
import type { DemoUser, RegisterInput, SignInInput } from "./types";

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export const createSolidConvexAuth = () => {
  const convex = useSolidConvex();
  const betterAuthSession = authClient.useSession();
  type AuthSessionState = ReturnType<typeof betterAuthSession>;
  const [sessionData, setSessionData] =
    createSignal<AuthSessionState["data"]>();
  const session = createMemo<AuthSessionState>(() => {
    const data = sessionData();
    const current = betterAuthSession();
    return data === undefined
      ? current
      : { ...current, data, isPending: false };
  });
  const [refreshVersion, setRefreshVersion] = createSignal(0);
  const userProfile = query(api.auth.getCurrentUserProfile, {
    enabled: () => {
      refreshVersion();
      return Boolean(session().data?.user?.id);
    },
  });
  const user = createMemo<DemoUser | null | undefined>(() => {
    if (!session().data?.user?.id) {
      return null;
    }

    return userProfile() as DemoUser | undefined;
  });
  const subject = createMemo<PermissionSubject>(() =>
    subjectFromRole(user()?.role),
  );
  const isReady = createMemo(
    () =>
      !session().isPending &&
      (!session().data?.user?.id || user() !== undefined),
  );
  const upsertDemoProfile = mutation(api.auth.upsertDemoProfile);
  const syncSession = async () => {
    const nextSession = await authClient.getSession();
    setSessionData(nextSession.data ?? null);
    authClient.updateSession();

    return nextSession.data ?? null;
  };

  const waitForConvexAuth = async () => {
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const nextSession = await syncSession();
      if (!nextSession?.user?.id) {
        await sleep(100);
        continue;
      }

      const tokenResult = await authClient.convex.token({
        fetchOptions: { throw: false },
      });
      if (tokenResult.data?.token) {
        return;
      }

      await sleep(100);
    }

    throw new Error("Unable to establish the Convex auth session.");
  };

  const refreshAuthState = async () => {
    convex.clearCache();
    await syncSession();
    convex.refreshAuth();
    setRefreshVersion((version) => version + 1);
  };

  const signIn = async (input: SignInInput) => {
    const signInRequest = authClient.signIn.email({
      email: input.email.trim().toLowerCase(),
      password: input.password,
    });
    const signInResult = await Promise.race([
      signInRequest,
      sleep(2_000).then(() => null),
    ]);

    if (signInResult?.error) {
      throw new Error(signInResult.error.message ?? "Sign in failed.");
    }

    await refreshAuthState();
  };

  const register = async (input: RegisterInput) => {
    const role = parseDemoRole(input.role);
    const email = input.email.trim().toLowerCase();
    const signUpResult = await authClient.signUp.email({
      email,
      name: input.name.trim() || email,
      password: input.password,
    });

    if (signUpResult.error) {
      throw new Error(signUpResult.error.message ?? "Registration failed.");
    }

    await waitForConvexAuth();
    await refreshAuthState();
    void upsertDemoProfile({ role })
      .then(() => refreshAuthState())
      .catch(() => undefined);
  };

  const signOut = async () => {
    await authClient.signOut();
    await refreshAuthState();
  };

  return {
    session,
    user,
    subject,
    isReady,
    refreshVersion,
    signIn,
    register,
    signOut,
  };
};

export type SolidConvexAuth = ReturnType<typeof createSolidConvexAuth>;
