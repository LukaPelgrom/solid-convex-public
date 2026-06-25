import { createMemo } from "solid-js";
import { api } from "@solid-convex-public/backend/convex/_generated/api";
import type { Id } from "@solid-convex-public/backend/convex/_generated/dataModel";
import { mutation, useQuery } from "@solid-convex-public/core";
import type { SolidConvexAuth } from "./auth";
import type { TodoFormInput, TodoItem } from "./types";

const sortTodos = (items: TodoItem[]) =>
  [...items].sort(
    (left, right) =>
      left.sortOrder - right.sortOrder ||
      left.createdAt - right.createdAt ||
      left._creationTime - right._creationTime,
  );

export const createTodos = (auth: SolidConvexAuth) => {
  const [todoItems, todoItemsState] = useQuery(api.todos.list, {
    enabled: () => Boolean(auth.user()),
    initialData: [] satisfies TodoItem[],
  });
  const createTodoItem = mutation(api.todos.create);
  const updateTodoItem = mutation(api.todos.update);
  const resetTodoItems = mutation(api.todos.resetMine);
  const replaceFirstTodoItem = mutation(api.todos.replaceFirst);
  const toggleTodoItem = mutation(api.todos.toggle, {
    optimistic: {
      query: api.todos.list,
      apply: (current, mutationArgs) =>
        current?.map((todo) =>
          todo._id === mutationArgs.id
            ? { ...todo, done: !todo.done, updatedAt: Date.now() }
            : todo,
        ),
    },
  });
  const removeTodoItem = mutation(api.todos.remove, {
    optimistic: {
      query: api.todos.list,
      apply: (current, mutationArgs) =>
        current?.filter((todo) => todo._id !== mutationArgs.id),
    },
  });
  const reorderTodoItems = mutation(api.todos.reorder, {
    optimistic: {
      query: api.todos.list,
      apply: (current, mutationArgs) => {
        if (!current) return current;

        const byId = new Map(current.map((todo) => [todo._id, todo]));
        return mutationArgs.ids
          .map((id, sortOrder) => {
            const todo = byId.get(id);
            return todo ? { ...todo, sortOrder } : undefined;
          })
          .filter((todo): todo is TodoItem => Boolean(todo));
      },
    },
    debounce: 120,
  });

  const todos = createMemo(() => sortTodos(todoItems()));
  const isLoading = todoItemsState.isLoading;

  const createTodo = async (input: TodoFormInput) => {
    await createTodoItem(input);
  };

  const updateTodo = async (id: Id<"todoItems">, input: TodoFormInput) => {
    await updateTodoItem({ id, ...input });
  };

  const toggleTodo = async (id: Id<"todoItems">) => {
    await toggleTodoItem({ id });
  };

  const removeTodo = async (id: Id<"todoItems">) => {
    await removeTodoItem({ id });
  };

  const reorderTodos = async (ids: Id<"todoItems">[]) => {
    await reorderTodoItems({ ids });
  };

  const resetTodos = async () => {
    await resetTodoItems();
  };

  const replaceFirstTodo = async () => {
    await replaceFirstTodoItem();
  };

  return {
    createTodo,
    isLoading,
    removeTodo,
    reorderTodos,
    replaceFirstTodo,
    resetTodos,
    todos,
    toggleTodo,
    updateTodo,
  };
};
