import {
  type ColorPickerAreaBackgroundProps as ArkAreaBackgroundProps,
  type ColorPickerAreaProps as ArkAreaProps,
  type ColorPickerAreaThumbProps as ArkAreaThumbProps,
  type ColorPickerChannelInputProps as ArkChannelInputProps,
  type ColorPickerChannelSliderProps as ArkChannelSliderProps,
  type ColorPickerChannelSliderThumbProps as ArkChannelSliderThumbProps,
  type ColorPickerChannelSliderTrackProps as ArkChannelSliderTrackProps,
  type ColorPickerContentProps as ArkContentProps,
  type ColorPickerEyeDropperTriggerProps as ArkEyeDropperTriggerProps,
  type ColorPickerFormatSelectProps as ArkFormatSelectProps,
  type ColorPickerFormatTriggerProps as ArkFormatTriggerProps,
  type ColorPickerPositionerProps as ArkPositionerProps,
  type ColorPickerSwatchIndicatorProps as ArkSwatchIndicatorProps,
  type ColorPickerSwatchProps as ArkSwatchProps,
  type ColorPickerSwatchTriggerProps as ArkSwatchTriggerProps,
  type ColorPickerTransparencyGridProps as ArkTransparencyGridProps,
  type ColorPickerTriggerProps as ArkTriggerProps,
  type ColorPickerValueSwatchProps as ArkValueSwatchProps,
  ColorPicker as ColorPickerPrimitive,
} from "@ark-ui/solid/color-picker";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { Component, JSX, ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

import { cn } from "../lib/shadcn/utils";

const ColorPicker = ColorPickerPrimitive.Root;
const ColorPickerLabel = ColorPickerPrimitive.Label;
const ColorPickerControl = ColorPickerPrimitive.Control;
const ColorPickerChannelInput = ColorPickerPrimitive.ChannelInput;
const ColorPickerValueText = ColorPickerPrimitive.ValueText;
const ColorPickerArea = ColorPickerPrimitive.Area;
const ColorPickerAreaBackground = ColorPickerPrimitive.AreaBackground;
const ColorPickerAreaThumb = ColorPickerPrimitive.AreaThumb;
const ColorPickerChannelSlider = ColorPickerPrimitive.ChannelSlider;
const ColorPickerChannelSliderTrack = ColorPickerPrimitive.ChannelSliderTrack;
const ColorPickerChannelSliderThumb = ColorPickerPrimitive.ChannelSliderThumb;
const ColorPickerSwatchGroup = ColorPickerPrimitive.SwatchGroup;
const ColorPickerSwatchTrigger = ColorPickerPrimitive.SwatchTrigger;
const ColorPickerSwatch = ColorPickerPrimitive.Swatch;
const ColorPickerSwatchIndicator = ColorPickerPrimitive.SwatchIndicator;
const ColorPickerView = ColorPickerPrimitive.View;
const ColorPickerEyeDropperTrigger = ColorPickerPrimitive.EyeDropperTrigger;
const ColorPickerTransparencyGrid = ColorPickerPrimitive.TransparencyGrid;
const ColorPickerFormatTrigger = ColorPickerPrimitive.FormatTrigger;
const ColorPickerFormatSelect = ColorPickerPrimitive.FormatSelect;
const ColorPickerHiddenInput = ColorPickerPrimitive.HiddenInput;
const ColorPickerContext = ColorPickerPrimitive.Context;

type ColorPickerTriggerProps = ArkTriggerProps & {
  class?: string | undefined;
  children?: JSX.Element;
};

const ColorPickerTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, ColorPickerTriggerProps>,
) => {
  const [local, others] = splitProps(props as ColorPickerTriggerProps, [
    "class",
    "children",
  ]);
  return (
    <ColorPickerPrimitive.Trigger
      class={cn(
        "inline-flex min-h-10 h-10 min-w-10 w-10 items-center justify-center rounded-md border border-input bg-transparent ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent",
        local.class,
      )}
      {...others}
    >
      {local.children}
    </ColorPickerPrimitive.Trigger>
  );
};

type ColorPickerValueSwatchProps = ArkValueSwatchProps & {
  class?: string | undefined;
};

const ColorPickerValueSwatch: Component<ColorPickerValueSwatchProps> = (
  props,
) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <ColorPickerPrimitive.ValueSwatch
      class={cn("size-full rounded-sm", local.class)}
      {...others}
    />
  );
};

type ColorPickerPositionerProps = ArkPositionerProps & {
  class?: string | undefined;
};

const ColorPickerPositioner: Component<ColorPickerPositionerProps> = (
  props,
) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <ColorPickerPrimitive.Positioner
      class={cn("z-50", local.class)}
      {...others}
    />
  );
};

type ColorPickerContentProps = ArkContentProps & {
  class?: string | undefined;
  children?: JSX.Element;
};

const ColorPickerContent: Component<ColorPickerContentProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <ColorPickerPrimitive.Content
      class={cn(
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 w-full rounded-lg border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
        local.class,
      )}
      {...others}
    >
      {local.children}
    </ColorPickerPrimitive.Content>
  );
};

type ColorPickerInputProps = ArkChannelInputProps & {
  class?: string | undefined;
};

const ColorPickerInput: Component<ColorPickerInputProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <ColorPickerPrimitive.ChannelInput
      class={cn(
        "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        local.class,
      )}
      {...others}
    />
  );
};

type ColorPickerAreaProps = ArkAreaProps & {
  class?: string | undefined;
  children?: JSX.Element;
};

const ColorPickerAreaComponent: Component<ColorPickerAreaProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <ColorPickerPrimitive.Area
      class={cn("relative h-36 w-full overflow-hidden rounded-md", local.class)}
      {...others}
    >
      {local.children}
    </ColorPickerPrimitive.Area>
  );
};

type ColorPickerAreaBackgroundProps = ArkAreaBackgroundProps & {
  class?: string | undefined;
};

const ColorPickerAreaBackgroundComponent: Component<
  ColorPickerAreaBackgroundProps
> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <ColorPickerPrimitive.AreaBackground
      class={cn("size-full", local.class)}
      {...others}
    />
  );
};

type ColorPickerAreaThumbProps = ArkAreaThumbProps & {
  class?: string | undefined;
};

const ColorPickerAreaThumbComponent: Component<ColorPickerAreaThumbProps> = (
  props,
) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <ColorPickerPrimitive.AreaThumb
      class={cn(
        "absolute size-5 rounded-full border-2 border-white shadow-md outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-background",
        local.class,
      )}
      {...others}
    />
  );
};

type ColorPickerChannelSliderProps = ArkChannelSliderProps & {
  class?: string | undefined;
  children?: JSX.Element;
};

const ColorPickerChannelSliderComponent: Component<
  ColorPickerChannelSliderProps
> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <ColorPickerPrimitive.ChannelSlider
      class={cn(
        "relative h-3 w-full overflow-hidden rounded-full",
        local.class,
      )}
      {...others}
    >
      {local.children}
    </ColorPickerPrimitive.ChannelSlider>
  );
};

type ColorPickerChannelSliderTrackProps = ArkChannelSliderTrackProps & {
  class?: string | undefined;
};

const ColorPickerChannelSliderTrackComponent: Component<
  ColorPickerChannelSliderTrackProps
> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <ColorPickerPrimitive.ChannelSliderTrack
      class={cn("size-full", local.class)}
      {...others}
    />
  );
};

type ColorPickerChannelSliderThumbProps = ArkChannelSliderThumbProps & {
  class?: string | undefined;
};

const ColorPickerChannelSliderThumbComponent: Component<
  ColorPickerChannelSliderThumbProps
> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <ColorPickerPrimitive.ChannelSliderThumb
      class={cn(
        "block size-5 rounded-full border-2 border-white shadow-md outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-background",
        local.class,
      )}
      {...others}
    />
  );
};

type ColorPickerSwatchProps = ArkSwatchProps & {
  class?: string | undefined;
  children?: JSX.Element;
};

const ColorPickerSwatchComponent: Component<ColorPickerSwatchProps> = (
  props,
) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <ColorPickerPrimitive.Swatch
      class={cn("size-full rounded", local.class)}
      {...others}
    >
      {local.children}
    </ColorPickerPrimitive.Swatch>
  );
};

type ColorPickerSwatchTriggerProps = ArkSwatchTriggerProps & {
  class?: string | undefined;
  children?: JSX.Element;
};

const ColorPickerSwatchTriggerComponent: Component<
  ColorPickerSwatchTriggerProps
> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <ColorPickerPrimitive.SwatchTrigger
      class={cn(
        "relative size-10 cursor-pointer overflow-hidden rounded border border-input transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=checked]:border-2 data-[state=checked]:border-primary",
        local.class,
      )}
      {...others}
    >
      {local.children}
    </ColorPickerPrimitive.SwatchTrigger>
  );
};

type ColorPickerSwatchIndicatorProps = ArkSwatchIndicatorProps & {
  class?: string | undefined;
  children?: JSX.Element;
};

const ColorPickerSwatchIndicatorComponent: Component<
  ColorPickerSwatchIndicatorProps
> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <ColorPickerPrimitive.SwatchIndicator
      class={cn(
        "absolute inset-0 flex items-center justify-center text-white",
        local.class,
      )}
      {...others}
    >
      {local.children}
    </ColorPickerPrimitive.SwatchIndicator>
  );
};

type ColorPickerEyeDropperTriggerProps = ArkEyeDropperTriggerProps & {
  class?: string | undefined;
  children?: JSX.Element;
};

const ColorPickerEyeDropperTriggerComponent: Component<
  ColorPickerEyeDropperTriggerProps
> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <ColorPickerPrimitive.EyeDropperTrigger
      class={cn(
        "inline-flex h-10 items-center justify-center rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        local.class,
      )}
      {...others}
    >
      {local.children}
    </ColorPickerPrimitive.EyeDropperTrigger>
  );
};

type ColorPickerFormatTriggerProps = ArkFormatTriggerProps & {
  class?: string | undefined;
  children?: JSX.Element;
};

const ColorPickerFormatTriggerComponent: Component<
  ColorPickerFormatTriggerProps
> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <ColorPickerPrimitive.FormatTrigger
      class={cn(
        "inline-flex h-10 items-center justify-center rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        local.class,
      )}
      {...others}
    >
      {local.children}
    </ColorPickerPrimitive.FormatTrigger>
  );
};

type ColorPickerFormatSelectProps = ArkFormatSelectProps & {
  class?: string | undefined;
};

const ColorPickerFormatSelectComponent: Component<
  ColorPickerFormatSelectProps
> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <ColorPickerPrimitive.FormatSelect
      class={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        local.class,
      )}
      {...others}
    />
  );
};

type ColorPickerTransparencyGridProps = ArkTransparencyGridProps & {
  class?: string | undefined;
};

const ColorPickerTransparencyGridComponent: Component<
  ColorPickerTransparencyGridProps
> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <ColorPickerPrimitive.TransparencyGrid
      class={cn("size-full", local.class)}
      {...others}
    />
  );
};

export {
  ColorPicker,
  ColorPickerLabel,
  ColorPickerControl,
  ColorPickerChannelInput,
  ColorPickerValueText,
  ColorPickerTrigger,
  ColorPickerValueSwatch,
  ColorPickerPositioner,
  ColorPickerContent,
  ColorPickerInput,
  ColorPickerArea,
  ColorPickerAreaBackground,
  ColorPickerAreaBackgroundComponent,
  ColorPickerAreaComponent,
  ColorPickerAreaThumb,
  ColorPickerAreaThumbComponent,
  ColorPickerChannelSlider,
  ColorPickerChannelSliderComponent,
  ColorPickerChannelSliderTrack,
  ColorPickerChannelSliderTrackComponent,
  ColorPickerChannelSliderThumb,
  ColorPickerChannelSliderThumbComponent,
  ColorPickerSwatchGroup,
  ColorPickerSwatchTrigger,
  ColorPickerSwatchTriggerComponent,
  ColorPickerSwatch,
  ColorPickerSwatchComponent,
  ColorPickerSwatchIndicator,
  ColorPickerSwatchIndicatorComponent,
  ColorPickerView,
  ColorPickerEyeDropperTrigger,
  ColorPickerEyeDropperTriggerComponent,
  ColorPickerFormatTrigger,
  ColorPickerFormatTriggerComponent,
  ColorPickerFormatSelect,
  ColorPickerFormatSelectComponent,
  ColorPickerTransparencyGrid,
  ColorPickerTransparencyGridComponent,
  ColorPickerHiddenInput,
  ColorPickerContext,
};
