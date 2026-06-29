"use client";

import { Eye, Link2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormControl, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { BASE_INPUT, READONLY } from "./field-utils";
import {
  FieldDescription,
  FieldLabel,
  FieldMessage,
  FieldProps,
} from "./FieldShared";

export function blockWhitespace(e: React.KeyboardEvent<HTMLInputElement>) {
  if (e.key === " ") e.preventDefault();
}

export function UrlField({
  field,
  rhfField,
  invalid,
  required,
  placeholder,
}: FieldProps) {
  const urlValue = rhfField.value ?? "";
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <FormItem className="flex flex-col gap-1">
      <FieldLabel field={field} required={required} />
      <FieldDescription description={field.description} />
      <FormControl>
        <div className="flex items-center gap-1.5">
          <div className="relative flex flex-1 items-center">
            <Link2 className="pointer-events-none absolute left-3 size-3.5 shrink-0 text-muted-foreground/50" />
            <Input
              {...rhfField}
              type="url"
              inputMode="url"
              autoComplete="url"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="go"
              value={urlValue}
              placeholder={placeholder}
              disabled={field.disabled}
              readOnly={field.readOnly}
              aria-invalid={invalid}
              onKeyDown={blockWhitespace}
              onChange={(e) => {
                rhfField.onChange(e.currentTarget.value.trim());
              }}
              className={cn(BASE_INPUT, "pl-8", field.readOnly && READONLY)}
            />
          </div>
          {field.imagePreview && urlValue && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => {
                setPreviewOpen(true);
              }}
              title="Preview image"
              className="size-9 shrink-0 text-muted-foreground/40 hover:text-foreground"
            >
              <Eye className="size-4" />
            </Button>
          )}
        </div>
      </FormControl>
      <FieldMessage />

      {field.imagePreview && (
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-sm font-medium">
                Cover Art Preview
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-hidden rounded-md border border-foreground/10 bg-foreground/5">
              <Image
                unoptimized
                src={urlValue}
                alt="Cover art preview"
                width={0}
                height={0}
                sizes="100vw"
                className="h-auto w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).alt = "Failed to load image";
                }}
              />
            </div>
            <p className="font-mono text-xs break-all text-muted-foreground/40">
              {urlValue}
            </p>
          </DialogContent>
        </Dialog>
      )}
    </FormItem>
  );
}
