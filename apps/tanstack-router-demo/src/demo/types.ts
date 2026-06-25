import type { Id } from "@solid-convex-public/backend/convex/_generated/dataModel";
import type { DemoRole } from "@solid-convex-public/permissions";
import type { RegisterInput, SignInInput } from "@solid-convex-public/core";

export type { RegisterInput, SignInInput };

export type DemoUser = {
  _id: string;
  email: string;
  name: string;
  role: DemoRole;
  roles: DemoRole[];
  emailVerified?: boolean;
  image?: string | null;
};

export type TodoItem = {
  _id: Id<"todoItems">;
  _creationTime: number;
  ownerId: string;
  createdByUserId: string;
  createdByName: string;
  title: string;
  notes: string;
  done: boolean;
  sortOrder: number;
  createdAt: number;
  updatedAt: number;
};

export type TodoFormInput = {
  title: string;
  notes: string;
};

export type PrefetchedDemoData = {
  user: DemoUser | null;
};
