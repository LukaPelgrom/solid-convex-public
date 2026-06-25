import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import {
  BoldIcon,
  CodeIcon,
  Heading2Icon,
  ImageIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  RedoIcon,
  StrikethroughIcon,
  UndoIcon,
} from "lucide-solid";
import { createEffect, type JSX, Show } from "solid-js";
import { toast } from "solid-sonner";
import { createTiptapEditor } from "solid-tiptap";
import { Button } from "./button";
import { cn } from "../lib/shadcn/utils";

type RichTextEditorProps = {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  class?: string;
};

const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/uploads", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(err?.error ?? "Upload mislukt");
  }

  const { url } = (await res.json()) as { url: string };
  return url;
};

export default function RichTextEditor(props: RichTextEditorProps) {
  let ref: HTMLDivElement | undefined;
  const initialContent = props.value ?? "";

  const insertImages = async (files: File[]) => {
    const e = editor();
    if (!e || files.length === 0) return;

    try {
      const urls = await Promise.all(files.map((file) => uploadImage(file)));
      for (const url of urls) {
        e.chain().focus().setImage({ src: url }).run();
      }
    } catch {
      toast.error("Afbeelding uploaden is mislukt");
    }
  };

  const editor = createTiptapEditor(() => ({
    element: ref as HTMLDivElement,
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Placeholder.configure({
        placeholder: props.placeholder ?? "Schrijf hier...",
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      props.onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[120px] px-3 py-2 focus:outline-none",
      },
      handlePaste: (_view, event) => {
        const clipboardItems = [...(event.clipboardData?.items ?? [])];
        const imageFiles = clipboardItems
          .filter(
            (item) => item.kind === "file" && item.type.startsWith("image/"),
          )
          .map((item) => item.getAsFile())
          .filter((file): file is File => file !== null);

        if (imageFiles.length === 0) {
          return false;
        }

        void insertImages(imageFiles);
        return true;
      },
    },
  }));

  createEffect(() => {
    const e = editor();
    const value = props.value ?? "";
    if (!e || e.getHTML() === value) return;

    e.commands.setContent(value, { emitUpdate: false });
  });

  const handleImageInsert = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) return;

      await insertImages([file]);
    });
    input.click();
  };

  return (
    <div
      class={cn(
        "rounded-md border border-input bg-background text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        props.class,
      )}
    >
      <Show when={editor()}>
        {(e) => (
          <div class="flex flex-wrap gap-0.5 border-b px-1 py-1">
            <ToolbarButton
              onClick={() => e().chain().focus().toggleBold().run()}
              active={e().isActive("bold")}
              title="Vet"
            >
              <BoldIcon class="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => e().chain().focus().toggleItalic().run()}
              active={e().isActive("italic")}
              title="Cursief"
            >
              <ItalicIcon class="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => e().chain().focus().toggleStrike().run()}
              active={e().isActive("strike")}
              title="Doorhalen"
            >
              <StrikethroughIcon class="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => e().chain().focus().toggleCode().run()}
              active={e().isActive("code")}
              title="Code"
            >
              <CodeIcon class="h-3.5 w-3.5" />
            </ToolbarButton>
            <div class="mx-1 w-px bg-border" />
            <ToolbarButton
              onClick={() =>
                e().chain().focus().toggleHeading({ level: 2 }).run()
              }
              active={e().isActive("heading", { level: 2 })}
              title="Kop"
            >
              <Heading2Icon class="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => e().chain().focus().toggleBulletList().run()}
              active={e().isActive("bulletList")}
              title="Opsomming"
            >
              <ListIcon class="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => e().chain().focus().toggleOrderedList().run()}
              active={e().isActive("orderedList")}
              title="Genummerde lijst"
            >
              <ListOrderedIcon class="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => e().chain().focus().toggleBlockquote().run()}
              active={e().isActive("blockquote")}
              title="Citaat"
            >
              <QuoteIcon class="h-3.5 w-3.5" />
            </ToolbarButton>
            <div class="mx-1 w-px bg-border" />
            <ToolbarButton onClick={handleImageInsert} title="Afbeelding">
              <ImageIcon class="h-3.5 w-3.5" />
            </ToolbarButton>
            <div class="mx-1 w-px bg-border" />
            <ToolbarButton
              onClick={() => e().chain().focus().undo().run()}
              title="Ongedaan maken"
            >
              <UndoIcon class="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => e().chain().focus().redo().run()}
              title="Opnieuw"
            >
              <RedoIcon class="h-3.5 w-3.5" />
            </ToolbarButton>
          </div>
        )}
      </Show>
      <div
        ref={(element) => {
          ref = element;
        }}
      />
    </div>
  );
}

function ToolbarButton(props: {
  onClick: () => void;
  active?: boolean;
  title?: string;
  children: JSX.Element;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      class={cn("h-7 w-7 p-0", props.active && "bg-muted")}
      onClick={props.onClick}
      title={props.title}
    >
      {props.children}
    </Button>
  );
}
