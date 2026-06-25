import { createFileRoute } from "@tanstack/solid-router";
import type { Id } from "@solid-convex-public/backend/convex/_generated/dataModel";
import { PageHeader } from "@solid-convex-public/core";
import { SideNavBarBreadcrumb } from "@solid-convex-public/core/shell";
import { createMemo, createSignal } from "solid-js";
import { createTodos, type TodoFormInput } from "../../demo";
import {
  TodoComposerCard,
  TodoFormStateCard,
  createTodoComposerForm,
} from "../../todos/todo-composer";
import { TodoListCard } from "../../todos/todo-list-card";

export const Route = createFileRoute("/_authenticated/todos")({
  component: TodosPage,
});

function TodosPage() {
  const context = Route.useRouteContext();
  const auth = () => context().auth;
  const user = () => auth().user();
  const todoStore = createTodos(auth());
  const todos = todoStore.todos;
  const [editingId, setEditingId] = createSignal<Id<"todoItems"> | null>(null);

  const addForm = createTodoComposerForm({
    canCreate: () => Boolean(user()),
    onCreate: todoStore.createTodo,
  });

  const resetTodos = async () => {
    await todoStore.resetTodos();
    setEditingId(null);
    addForm.reset();
  };

  const deleteTodo = async (id: Id<"todoItems">) => {
    await todoStore.removeTodo(id);
    if (editingId() === id) {
      setEditingId(null);
    }
  };

  const toggleTodo = async (id: Id<"todoItems">) => {
    await todoStore.toggleTodo(id);
  };

  const moveFirstToEnd = async () => {
    const current = todos();
    if (current.length < 2) {
      return;
    }

    const [first, ...rest] = current;
    await todoStore.reorderTodos([...rest, first].map((todo) => todo._id));
  };

  const swapFirstTwo = async () => {
    const current = todos();
    if (current.length < 2) {
      return;
    }

    const [first, second, ...rest] = current;
    await todoStore.reorderTodos(
      [second, first, ...rest].map((todo) => todo._id),
    );
  };

  const replaceFirst = async () => {
    await todoStore.replaceFirstTodo();
    setEditingId(null);
  };

  const updateTodo = async (id: Id<"todoItems">, value: TodoFormInput) => {
    const title = value.title.trim();
    if (!title) {
      return;
    }

    await todoStore.updateTodo(id, {
      notes: value.notes.trim(),
      title,
    });
    setEditingId(null);
  };

  const openCount = createMemo(
    () => todos().filter((todo) => !todo.done).length,
  );
  const doneCount = createMemo(
    () => todos().filter((todo) => todo.done).length,
  );

  return (
    <>
      <SideNavBarBreadcrumb>Todos</SideNavBarBreadcrumb>
      <div class="page-content todos-page">
        <PageHeader
          eyebrow="TanStack Form demo"
          title="Todo CRUD playground"
          description="Server-backed todos with TanStack Form, Convex mutations, and AutoAnimate list motion."
        />

        <div class="todos-layout">
          <TodoComposerCard
            doneCount={doneCount}
            form={addForm}
            onReset={() => void resetTodos()}
            openCount={openCount}
            totalCount={() => todos().length}
          />

          <TodoListCard
            editingId={editingId}
            isLoading={todoStore.isLoading}
            onCancelEdit={() => setEditingId(null)}
            onDelete={(id) => void deleteTodo(id)}
            onEdit={setEditingId}
            onMoveFirstToEnd={() => void moveFirstToEnd()}
            onReplaceFirst={() => void replaceFirst()}
            onSave={(id, value) => void updateTodo(id, value)}
            onSwapFirstTwo={() => void swapFirstTwo()}
            onToggle={(id) => void toggleTodo(id)}
            todos={todos}
          />
        </div>

        <TodoFormStateCard form={addForm} />
      </div>
    </>
  );
}
