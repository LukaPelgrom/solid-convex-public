import { createForm } from "@tanstack/solid-form";
import type { Id } from "@solid-convex-public/backend/convex/_generated/dataModel";
import { Button, Input, Textarea } from "@solid-convex-public/core";
import { Show, type Accessor } from "solid-js";
import type { TodoFormInput, TodoItem } from "../demo";

export type TodoRowProps = {
  todo: Accessor<TodoItem>;
  editing: boolean;
  onCancel: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onSave: (id: Id<"todoItems">, value: TodoFormInput) => void;
  onToggle: (id: Id<"todoItems">) => void;
};

export function TodoRow(props: TodoRowProps) {
  const editForm = createForm(() => ({
    defaultValues: {
      title: props.todo().title,
      notes: props.todo().notes,
    } satisfies TodoFormInput,
    onSubmit: ({ value }) => {
      props.onSave(props.todo()._id, value);
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
                onClick={() => props.onToggle(props.todo()._id)}
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
