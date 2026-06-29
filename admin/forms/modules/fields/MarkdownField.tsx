"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";

import { FormControl, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { formatLyricsMarkdown } from "@/lib/lyrics";
import { cn } from "@/lib/utils";

import { READONLY } from "./field-utils";
import {
  FieldDescription,
  FieldLabel,
  FieldMessage,
  type FieldProps,
} from "./FieldShared";

export function MarkdownPreview({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-h-20 w-full overflow-auto rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100",
        className,
        "[&_h1]:mt-5 [&_h1]:mb-3 [&_h1]:border-b [&_h1]:border-zinc-700 [&_h1]:pb-2 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-zinc-50 [&_h1]:first:mt-0",
        "[&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-xs [&_h2]:font-semibold [&_h2]:tracking-widest [&_h2]:text-zinc-400 [&_h2]:uppercase [&_h2]:first:mt-0",
        "[&_h3]:mt-3 [&_h3]:mb-1.5 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-zinc-400 [&_h3]:first:mt-0",
        "[&_p]:my-1 [&_p]:leading-7 [&_p]:text-zinc-100",
        "[&_strong]:font-semibold [&_strong]:text-zinc-50",
        "[&_em]:text-zinc-400 [&_em]:italic",
        "[&_hr]:my-4 [&_hr]:border-zinc-700",
        "[&_ul]:my-2 [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:text-zinc-300",
        "[&_ol]:my-2 [&_ol]:ml-4 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:text-zinc-300",
        "[&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-zinc-600 [&_blockquote]:pl-3 [&_blockquote]:text-zinc-400 [&_blockquote]:italic",
      )}
    >
      <Markdown>{formatLyricsMarkdown(text)}</Markdown>
    </div>
  );
}

export function MarkdownField({
  field,
  rhfField,
  invalid,
  required,
  placeholder,
}: FieldProps) {
  const [preview, setPreview] = useState(false);
  const value = rhfField.value ?? "";

  return (
    <FormItem className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2">
        <FieldLabel field={field} required={required} />
        <button
          type="button"
          onClick={() => {
            setPreview((p) => !p);
          }}
          title={preview ? "Edit" : "Preview markdown"}
          className="flex items-center gap-1 text-xs text-muted-foreground/40 transition-colors hover:text-foreground"
        >
          {preview ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
          <span>{preview ? "Edit" : "Preview"}</span>
        </button>
      </div>
      <FieldDescription description={field.description} />
      <FormControl>
        {preview ? (
          <MarkdownPreview text={value} />
        ) : (
          <Textarea
            {...rhfField}
            value={value}
            placeholder={placeholder}
            disabled={field.disabled}
            readOnly={field.readOnly}
            rows={field.rows ?? 4}
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            spellCheck
            aria-invalid={invalid}
            className={cn(
              "resize-y rounded-lg border border-foreground/12 bg-foreground/2 px-3 py-2.5 text-sm text-foreground",
              "placeholder:text-muted-foreground/50",
              "transition-colors duration-100",
              "hover:border-foreground/20 hover:bg-foreground/3",
              "focus-visible:border-ado-primary focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-ado-primary/20 focus-visible:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-40",
              "aria-invalid:border-red-500/50 aria-invalid:ring-2 aria-invalid:ring-red-500/10",
              field.readOnly && READONLY,
            )}
          />
        )}
      </FormControl>
      <FieldMessage />
    </FormItem>
  );
}
