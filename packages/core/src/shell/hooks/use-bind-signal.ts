import { type Accessor, createEffect, createSignal, on } from "solid-js";

export type BindSignal<T> = {
  value: Accessor<T> | (() => T);
  setValue?: (value: T) => void;
};

export type ComponentBindSignalProps<T> = {
  value?: Accessor<T> | (() => T);
  setValue?: (value: T) => void;
};

export function useBindSignal<T>(props: BindSignal<T>) {
  const [internalValue, setInternalValue] = createSignal<T>(props?.value?.());
  // When the external value changes, update the internal value
  createEffect(
    on(props.value, () => {
      setInternalValue(() => props.value());
    }),
  );
  // When the internal value changes, update the external value
  createEffect(
    on(internalValue, () => {
      props.setValue?.(internalValue());
    }),
  );

  return [internalValue, setInternalValue] as const;
}
