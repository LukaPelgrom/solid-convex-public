import { createAutoAnimateDirective } from "@formkit/auto-animate/solid";
import { Key } from "@solid-primitives/keyed";
import { createForm } from "@tanstack/solid-form";
import { createFileRoute, useRouter } from "@tanstack/solid-router";
import type { Id } from "@solid-configs-public/backend/convex/_generated/dataModel";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  PageHeader,
  Textarea,
} from "@solid-configs-public/core";
import { SideNavBarBreadcrumb } from "@solid-configs-public/core/shell";
import { Show, createMemo, createSignal, type Accessor } from "solid-js";
import { createTodos, type TodoFormInput, type TodoItem } from "../demo";

export const Route = createFileRoute("/todos")({
  component: TodosPage,
});

function TodosPage() {
  const router = useRouter();
  const auth = router.options.context.auth;
  const user = () => auth.user() ?? null;
  const todoStore = createTodos(auth);
  const todos = todoStore.todos;
  const [editingId, setEditingId] = createSignal<Id<"todoItems"> | null>(null);
  const autoAnimate = createAutoAnimateDirective();

  const addForm = createForm(() => ({
    defaultValues: {
      title: "",
      notes: "",
    } satisfies TodoFormInput,
    onSubmit: async ({ value, formApi }) => {
      const title = value.title.trim();
      if (!title || !user()) {
        return;
      }

      await todoStore.createTodo({
        notes: value.notes.trim(),
        title,
      });
      formApi.reset();
    },
  }));

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

        <Show
          when={user()}
          fallback={
            <Card>
              <CardContent class="todos-empty">
                <p>Sign in to create and manage todos.</p>
              </CardContent>
            </Card>
          }
        >
          <div class="todos-layout">
            <Card class="todos-composer">
              <CardHeader>
                <CardTitle>Add a todo</CardTitle>
                <CardDescription>
                  Create items with TanStack Form. The backend records the
                  creator from auth state.
                </CardDescription>
              </CardHeader>
              <CardContent class="stack">
                <form
                  class="stack"
                  onSubmit={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    void addForm.handleSubmit();
                  }}
                >
                  <addForm.Field
                    name="title"
                    validators={{
                      onChange: ({ value }) =>
                        value.trim().length === 0
                          ? "Give the todo a title."
                          : undefined,
                    }}
                    children={(field) => (
                      <div class="form-field">
                        <label for="todo-title">Title</label>
                        <Input
                          id="todo-title"
                          name={field().name}
                          placeholder="What needs to get done?"
                          value={field().state.value}
                          onBlur={field().handleBlur}
                          onInput={(event) =>
                            field().handleChange(event.currentTarget.value)
                          }
                        />
                        <Show when={field().state.meta.errors.at(0)}>
                          {(error) => <p class="ui-input-error">{error()}</p>}
                        </Show>
                      </div>
                    )}
                  />

                  <addForm.Field
                    name="notes"
                    children={(field) => (
                      <div class="form-field">
                        <label for="todo-notes">Notes</label>
                        <Textarea
                          id="todo-notes"
                          name={field().name}
                          placeholder="Optional context"
                          rows={3}
                          value={field().state.value}
                          onBlur={field().handleBlur}
                          onInput={(event) =>
                            field().handleChange(event.currentTarget.value)
                          }
                        />
                      </div>
                    )}
                  />

                  <div class="row">
                    <Button type="submit">Add todo</Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => void resetTodos()}
                    >
                      Reset
                    </Button>
                  </div>
                </form>

                <div class="todos-stats">
                  <Badge variant="secondary">{openCount()} open</Badge>
                  <Badge variant="success">{doneCount()} done</Badge>
                  <Badge variant="outline">{todos().length} total</Badge>
                </div>
              </CardContent>
            </Card>

            <Card class="todos-list-card">
              <CardHeader>
                <CardTitle>Todo list</CardTitle>
                <CardDescription>
                  Delete, edit, toggle, and reorder through Convex mutations.
                </CardDescription>
              </CardHeader>
              <CardContent class="stack">
                <div class="todos-actions">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => void moveFirstToEnd()}
                  >
                    Move first to end
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => void swapFirstTwo()}
                  >
                    Swap first two
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => void replaceFirst()}
                  >
                    Replace first
                  </Button>
                </div>

                <div
                  use:autoAnimate={{ duration: 220 }}
                  class="todos-list"
                  data-testid="todos-list"
                >
                  <Show
                    when={!todoStore.isLoading()}
                    fallback={
                      <div class="todos-empty">
                        <p>Loading todos...</p>
                      </div>
                    }
                  >
                    <Show
                      when={todos().length > 0}
                      fallback={
                        <div class="todos-empty">
                          <p>No todos yet.</p>
                          <p>Add one with the composer on the left.</p>
                        </div>
                      }
                    >
                      <Key each={todos()} by="_id">
                        {(todo) => (
                          <TodoRow
                            editing={editingId() === todo()._id}
                            onCancel={() => setEditingId(null)}
                            onDelete={() => void deleteTodo(todo()._id)}
                            onEdit={() => setEditingId(todo()._id)}
                            onSave={(value) =>
                              void updateTodo(todo()._id, value)
                            }
                            onToggle={() => void toggleTodo(todo()._id)}
                            todo={todo}
                          />
                        )}
                      </Key>
                    </Show>
                  </Show>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card class="todos-debugger">
            <CardHeader>
              <CardTitle>Form state</CardTitle>
              <CardDescription>
                TanStack Form values for the composer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <addForm.Subscribe
                selector={(state) => ({
                  canSubmit: state.canSubmit,
                  isDirty: state.isDirty,
                  isSubmitted: state.isSubmitted,
                  isSubmitting: state.isSubmitting,
                  isValid: state.isValid,
                  values: state.values,
                })}
                children={(state) => (
                  <pre class="todos-debugger-output">
                    {JSON.stringify(state(), null, 2)}
                  </pre>
                )}
              />
            </CardContent>
          </Card>
        </Show>
      </div>
    </>
  );
}

function TodoRow(props: {
  todo: Accessor<TodoItem>;
  editing: boolean;
  onCancel: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onSave: (value: TodoFormInput) => void;
  onToggle: () => void;
}) {
  const editForm = createForm(() => ({
    defaultValues: {
      title: props.todo().title,
      notes: props.todo().notes,
    } satisfies TodoFormInput,
    onSubmit: ({ value }) => {
      props.onSave(value);
    },
  }));

  return (
    <article
      class="todo-row"
      classList={{
        "todo-row--done": props.todo().done,
        "todo-row--editing": props.editing,
      }}
      data-testid={`todo-${props.todo()._id}`}
    >
      <Show
        when={props.editing}
        fallback={
          <>
            <div class="todo-row-main">
              <button
                class="todo-row-toggle"
                type="button"
                aria-label={props.todo().done ? "Mark open" : "Mark done"}
                onClick={props.onToggle}
              >
                <span
                  class="todo-row-check"
                  data-checked={props.todo().done ? "true" : "false"}
                />
              </button>
              <div class="todo-row-copy">
                <h3 classList={{ done: props.todo().done }}>
                  {props.todo().title}
                </h3>
                <p class="todo-row-subtitle">
                  Created by {props.todo().createdByName}
                </p>
                <Show when={props.todo().notes}>
                  <p>{props.todo().notes}</p>
                </Show>
              </div>
            </div>
            <div class="todo-row-actions">
              <Button size="sm" variant="secondary" onClick={props.onEdit}>
                Edit
              </Button>
              <Button size="sm" variant="destructive" onClick={props.onDelete}>
                Delete
              </Button>
            </div>
          </>
        }
      >
        <form
          class="todo-row-edit stack"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void editForm.handleSubmit();
          }}
        >
          <editForm.Field
            name="title"
            validators={{
              onChange: ({ value }) =>
                value.trim().length === 0 ? "Title is required." : undefined,
            }}
            children={(field) => (
              <div class="form-field">
                <label for={`edit-title-${props.todo()._id}`}>Title</label>
                <Input
                  id={`edit-title-${props.todo()._id}`}
                  name={field().name}
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(event) =>
                    field().handleChange(event.currentTarget.value)
                  }
                />
              </div>
            )}
          />
          <editForm.Field
            name="notes"
            children={(field) => (
              <div class="form-field">
                <label for={`edit-notes-${props.todo()._id}`}>Notes</label>
                <Textarea
                  id={`edit-notes-${props.todo()._id}`}
                  name={field().name}
                  rows={2}
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(event) =>
                    field().handleChange(event.currentTarget.value)
                  }
                />
              </div>
            )}
          />
          <div class="row">
            <Button size="sm" type="submit">
              Save
            </Button>
            <Button
              size="sm"
              type="button"
              variant="ghost"
              onClick={props.onCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Show>
    </article>
  );
}
