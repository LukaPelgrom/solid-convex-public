import {
  Show,
  createContext,
  createMemo,
  useContext,
  type Accessor,
  type JSX,
} from "solid-js";
import {
  evaluatePolicy,
  type AccessResult,
  type PermissionSubject,
  type RolePolicy,
} from "./index";

type MaybeAccessor<T> = T | Accessor<T>;

const resolve = <T,>(value: MaybeAccessor<T>): T =>
  typeof value === "function" ? (value as Accessor<T>)() : value;

type PermissionContextValue = {
  subject: Accessor<PermissionSubject | undefined>;
};

const PermissionContext = createContext<PermissionContextValue>();

export type PermissionProviderProps = {
  subject: MaybeAccessor<PermissionSubject | undefined>;
  children: JSX.Element;
};

export function PermissionProvider(props: PermissionProviderProps) {
  const subject = createMemo(() => resolve(props.subject));

  return (
    <PermissionContext.Provider value={{ subject }}>
      {props.children}
    </PermissionContext.Provider>
  );
}

export const usePermissionSubject = () => {
  const context = useContext(PermissionContext);
  return context?.subject ?? (() => undefined);
};

export const useRolePermission = (
  policy: RolePolicy,
): [granted: Accessor<boolean>, result: Accessor<AccessResult>] => {
  const subject = usePermissionSubject();
  const result = createMemo(() =>
    evaluatePolicy(policy, subject() ?? { roles: [] }),
  );
  const granted = createMemo(() => result().granted);

  return [granted, result];
};

export type ProtectedProps = {
  policy: RolePolicy;
  fallback?: JSX.Element;
  children: JSX.Element;
};

export function Protected(props: ProtectedProps): JSX.Element {
  const [granted] = useRolePermission(props.policy);

  return (
    <Show when={granted()} fallback={props.fallback}>
      {props.children}
    </Show>
  );
}
