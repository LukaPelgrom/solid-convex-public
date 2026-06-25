import { createAutoAnimateDirective } from "@formkit/auto-animate/solid";
import { Key } from "@solid-primitives/keyed";
import type { Id } from "@solid-convex-public/backend/convex/_generated/dataModel";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@solid-convex-public/core";
import { Show, type Accessor } from "solid-js";
import type { TodoFormInput, TodoItem } from "../demo";
import { TodoRow } from "./todo-row";

export type TodoListCardProps = {
  editingId: Accessor<Id<"todoItems"> | null>;
  isLoading: Accessor<boolean>;
  todos: Accessor<TodoItem[]>;
  onCancelEdit: () => void;
  onDelete: (id: Id<"todoItems">) => void;
  onEdit: (id: Id<"todoItems">) => void;
  onMoveFirstToEnd: () => void;
  onReplaceFirst: () => void;
  onSave: (id: Id<"todoItems">, value: TodoFormInput) => void;
  onSwapFirstTwo: () => void;
  onToggle: (id: Id<"todoItems">) => void;
};

export function TodoListCard(props: TodoListCardProps) {
  const autoAnimate = createAutoAnimateDirective();

  return (
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
            onClick={() => props.onMoveFirstToEnd()}
          >
            Move first to end
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => props.onSwapFirstTwo()}
          >
            Swap first two
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => props.onReplaceFirst()}
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
            when={!props.isLoading()}
            fallback={
              <div class="todos-empty">
                <p>Loading todos...</p>
              </div>
            }
          >
            <Show
              when={props.todos().length > 0}
              fallback={
                <div class="todos-empty">
                  <p>No todos yet.</p>
                  <p>Add one with the composer on the left.</p>
                </div>
              }
            >
              <Key each={props.todos()} by="_id">
                {(todo) => (
                  <TodoRow
                    editing={props.editingId() === todo()._id}
                    onCancel={props.onCancelEdit}
                    onDelete={() => props.onDelete(todo()._id)}
                    onEdit={() => props.onEdit(todo()._id)}
                    onSave={props.onSave}
                    onToggle={props.onToggle}
                    todo={todo}
                  />
                )}
              </Key>
            </Show>
          </Show>
        </div>
      </CardContent>
    </Card>
  );
}
