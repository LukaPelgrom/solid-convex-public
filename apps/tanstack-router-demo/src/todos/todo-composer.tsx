import { createForm } from "@tanstack/solid-form";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
} from "@solid-convex-public/core";
import { Show, type Accessor } from "solid-js";
import type { TodoFormInput } from "../demo";

export const createTodoComposerForm = (options: {
  canCreate: Accessor<boolean>;
  onCreate: (input: TodoFormInput) => Promise<void>;
}) =>
  createForm(() => ({
    defaultValues: {
      title: "",
      notes: "",
    } satisfies TodoFormInput,
    onSubmit: async ({ value, formApi }) => {
      const title = value.title.trim();
      if (!title || !options.canCreate()) {
        return;
      }

      await options.onCreate({
        notes: value.notes.trim(),
        title,
      });
      formApi.reset();
    },
  }));

export type TodoComposerForm = ReturnType<typeof createTodoComposerForm>;

export function TodoComposerCard(props: {
  doneCount: Accessor<number>;
  form: TodoComposerForm;
  onReset: () => void;
  openCount: Accessor<number>;
  totalCount: Accessor<number>;
}) {
  return (
    <Card class="todos-composer">
      <CardHeader>
        <CardTitle>Add a todo</CardTitle>
        <CardDescription>
          Create items with TanStack Form. The backend records the creator from
          auth state.
        </CardDescription>
      </CardHeader>
      <CardContent class="stack">
        <form
          class="stack"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void props.form.handleSubmit();
          }}
        >
          <props.form.Field
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

          <props.form.Field
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
            <Button type="button" variant="secondary" onClick={props.onReset}>
              Reset
            </Button>
          </div>
        </form>

        <div class="todos-stats">
          <Badge variant="secondary">{props.openCount()} open</Badge>
          <Badge variant="success">{props.doneCount()} done</Badge>
          <Badge variant="outline">{props.totalCount()} total</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export function TodoFormStateCard(props: { form: TodoComposerForm }) {
  return (
    <Card class="todos-debugger">
      <CardHeader>
        <CardTitle>Form state</CardTitle>
        <CardDescription>
          TanStack Form values for the composer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <props.form.Subscribe
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
  );
}
