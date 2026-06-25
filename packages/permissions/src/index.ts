export const demoRoles = ["employee", "employee_plus", "admin"] as const;

export type DemoRole = (typeof demoRoles)[number];

export const demoRoleLabels = {
  employee: "Employee",
  employee_plus: "Employee Plus",
  admin: "Admin",
} satisfies Record<DemoRole, string>;

export type PermissionSubject = {
  selectedRole?: DemoRole;
  roles: DemoRole[];
};

export type PermissionAction = "access";
export type NoResource = undefined;
export type NoContext = undefined;

export type AccessResult = {
  granted: boolean;
  policy: string;
  reason: string;
  requiredRoles: DemoRole[];
  userRoles: DemoRole[];
};

export type Policy<Subject, Resource, Action, Context> = {
  readonly name: string;
  readonly evaluateAccess: (input: {
    subject: Subject;
    resource: Resource;
    action: Action;
    context: Context;
  }) => AccessResult;
};

export type RolePolicy = Policy<
  PermissionSubject,
  NoResource,
  PermissionAction,
  NoContext
> & {
  readonly allowedRoles: readonly DemoRole[];
};

export const isDemoRole = (value: unknown): value is DemoRole =>
  typeof value === "string" && demoRoles.includes(value as DemoRole);

export const parseDemoRole = (value: unknown): DemoRole =>
  isDemoRole(value) ? value : "employee";

export const subjectFromRole = (
  role: DemoRole | null | undefined,
): PermissionSubject => ({
  selectedRole: role ?? undefined,
  roles: role ? [role] : [],
});

export const createRolePolicy = ({
  name,
  allowedRoles,
}: {
  name: string;
  allowedRoles: readonly DemoRole[];
}): RolePolicy => ({
  name,
  allowedRoles,
  evaluateAccess: ({ subject }) => {
    const userRoles = subject.selectedRole
      ? [subject.selectedRole]
      : subject.roles;
    const granted = allowedRoles.some((role) => userRoles.includes(role));

    return {
      granted,
      policy: name,
      reason: granted ? "User has required role" : "Missing required role",
      requiredRoles: [...allowedRoles],
      userRoles: [...userRoles],
    };
  },
});

export const canManageDemoItems = createRolePolicy({
  name: "canManageDemoItems",
  allowedRoles: ["employee", "employee_plus", "admin"],
});

export const canViewAdminRoute = createRolePolicy({
  name: "canViewAdminRoute",
  allowedRoles: ["employee_plus", "admin"],
});

export const canAccessAdminRoute = createRolePolicy({
  name: "canAccessAdminRoute",
  allowedRoles: ["admin"],
});

export const demoPolicies = {
  canManageDemoItems,
  canViewAdminRoute,
  canAccessAdminRoute,
};

export const evaluatePolicy = (
  policy: RolePolicy,
  subject: PermissionSubject,
): AccessResult =>
  policy.evaluateAccess({
    subject,
    resource: undefined,
    action: "access",
    context: undefined,
  });

export const hasPermission = (policy: RolePolicy, subject: PermissionSubject) =>
  evaluatePolicy(policy, subject).granted;

export const assertPermission = (
  policy: RolePolicy,
  subject: PermissionSubject,
) => {
  const result = evaluatePolicy(policy, subject);
  if (!result.granted) {
    throw new Error(`${result.policy}: ${result.reason}`);
  }

  return result;
};
