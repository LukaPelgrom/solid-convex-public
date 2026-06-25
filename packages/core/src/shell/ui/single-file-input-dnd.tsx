import { FileField } from "@kobalte/core/file-field";
import { Upload, X } from "lucide-solid";
import { createMemo, createSignal, Show, splitProps } from "solid-js";
import { useBindSignal } from "../hooks/use-bind-signal";
import { cn } from "../lib/shadcn/utils";
import { Button } from "./button";
import { InputError } from "./input-error";
import { InputLabel } from "./input-label";

type SingleFileInputDndProps = {
  name: string;
  value?: File | null; // File for new uploads, string URL for existing files
  onFileChange?: (file: File | undefined | null) => void;
  accept?: string;
  required?: boolean;
  disabled?: boolean;
  errorClass?: string;
  labelClass?: string;
  wrapperClass?: string;
  class?: string;
  label?: string;
  error?: string;
  placeholder?: string;
  showPreview?: boolean;
  existingFileUrl?: string | null; // URL for existing file in edit mode
  existingFileName?: string | null; // Name for existing file in edit mode
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 bytes";
  const k = 1024;
  const sizes = ["bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Number.parseFloat((bytes / k ** i).toFixed(2)) + " " + sizes[i];
}

export function SingleFileInputDnd(props: SingleFileInputDndProps) {
  const [dragActive, setDragActive] = createSignal(false);
  const [previewUrl, setPreviewUrl] = useBindSignal<string | undefined>({
    value: () => {
      return props.existingFileUrl ?? undefined;
    },
  });

  // Split props for better organization
  const [local] = splitProps(props, [
    "class",
    "label",
    "error",
    "wrapperClass",
    "labelClass",
    "errorClass",
    "placeholder",
    "onFileChange",
    "existingFileUrl",
    "existingFileName",
  ]);

  // Get current file - either from files state or existing value
  const [currentFile, setCurrentFile] = useBindSignal<File | undefined>({
    value: () => (props.value?.size ? props.value : undefined),
  });
  // Get display info for current file/existing file
  const fileInfo = createMemo(() => {
    const file = currentFile();
    if (file) {
      return {
        name: file.name,
        size: file.size,
        type: file.type,
        isNew: true,
      };
    }

    if (props.existingFileUrl && props.existingFileName) {
      return {
        name: props.existingFileName,
        size: null,
        type: null,
        isNew: false,
      };
    }

    return null;
  });

  // Check if file is an image
  const isImage = createMemo(() => {
    const info = fileInfo();
    if (!info) return false;

    if (info.isNew && info.type) {
      return info.type.startsWith("image/");
    }

    // For existing files, check file extension
    if (!info.isNew) {
      const extension = info.name.split(".").pop()?.toLowerCase();
      return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(
        extension || "",
      );
    }

    return false;
  });

  // Handle file selection
  const handleFileSelect = (details: {
    acceptedFiles: File[];
    rejectedFiles: { file: File; errors: string[] }[];
  }) => {
    const { acceptedFiles } = details;
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0]; // Take only the first file for single file input
    if (!file) return;

    local.onFileChange?.(file);

    // Create preview URL for images
    if (props.showPreview !== false && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Handle file removal
  const handleRemoveFile = () => {
    local.onFileChange?.(null);
    setCurrentFile(undefined);
    // Clean up preview URL
    const url = previewUrl();
    if (url) {
      URL.revokeObjectURL(url);
      setPreviewUrl(undefined);
    }
  };

  return (
    <div class={cn("space-y-1.5", local.wrapperClass)}>
      <InputLabel
        name={props.name}
        label={local.label}
        required={props.required}
        class={local.labelClass}
      />

      <FileField
        multiple={false}
        onFileChange={handleFileSelect}
        disabled={props.disabled}
        accept={props.accept}
      >
        <div class="space-y-3">
          {/* Drop Zone */}
          <FileField.Dropzone
            class={cn(
              "relative flex flex-col items-center justify-center w-full rounded-lg border-2 border-dashed transition-colors",
              "hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              props.disabled
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer",
              dragActive() ? "border-primary bg-accent/50" : "border-input",
              props.error ? "border-destructive" : "",
              // Dynamic height based on whether we have an image preview
              fileInfo() && isImage() && previewUrl() ? "min-h-48" : "min-h-32",
              local.class,
            )}
            onDragEnter={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
            onDrop={() => setDragActive(false)}
          >
            <Show
              when={previewUrl()}
              fallback={
                <div class="flex flex-col items-center justify-center space-y-2 text-center p-6">
                  <Upload class="h-8 w-8 text-muted-foreground" />
                  <div class="text-sm text-muted-foreground">
                    <span class="font-medium">
                      Klik om een bestand te selecteren
                    </span>
                    <span> of sleep het hierheen</span>
                  </div>
                  <Show when={local.placeholder}>
                    <p class="text-xs text-muted-foreground">
                      {local.placeholder}
                    </p>
                  </Show>
                </div>
              }
            >
              {/* Image preview in the dropzone */}
              <div class="relative w-full h-full rounded-lg overflow-hidden">
                <img
                  src={previewUrl()}
                  alt={fileInfo()?.name ?? "Geüpload bestand"}
                  class="w-full h-full object-cover"
                  onError={() => {}}
                />
                {/* Delete button overlay */}
                <div class="absolute top-2 right-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    title="Verwijder bestand"
                    class="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                    onclick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                  >
                    <X class="h-4 w-4" />
                  </Button>
                </div>
                {/* File name overlay */}
                <div class="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-2">
                  <p class="text-sm font-medium text-foreground truncate">
                    {fileInfo()?.name}
                  </p>
                  <Show when={fileInfo()?.size}>
                    <p class="text-xs text-muted-foreground">
                      {formatFileSize(fileInfo()!.size!)}
                    </p>
                  </Show>
                </div>
              </div>
            </Show>

            <FileField.HiddenInput id={props.name} />
          </FileField.Dropzone>
        </div>
      </FileField>

      <InputError
        name={props.name}
        error={props.error}
        class={local.errorClass}
      />
    </div>
  );
}
