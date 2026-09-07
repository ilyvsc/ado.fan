import type { FieldConfig, FieldType } from "@/admin/types/forms";

import { cn } from "@/lib/utils";

export const OPTIONAL = (
  <span className="ml-0.5 font-normal text-muted-foreground/25">(optional)</span>
);

export const REQUIRED = (
  <span className="text-destructive ml-0.5" aria-hidden>
    *
  </span>
);

export const BASE_INPUT = cn(
  "h-9 w-full rounded-lg border border-foreground/12 bg-foreground/2 px-3 text-sm text-foreground",
  "transition-colors duration-100 placeholder:text-muted-foreground/50",
  "hover:border-foreground/20 hover:bg-foreground/3",
  "focus:border-ado-primary focus:bg-background focus:ring-2 focus:ring-ado-primary/20 focus:outline-none",
  "focus-visible:border-ado-primary focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-ado-primary/30 focus-visible:outline-none",
  "disabled:cursor-not-allowed disabled:opacity-40",
  "aria-invalid:border-destructive/50 aria-invalid:ring-destructive/10 aria-invalid:ring-2",
);

export const READONLY = cn(
  "cursor-default opacity-60 select-all hover:border-foreground/12 hover:bg-foreground/2",
);

export const FIELD_LABEL = "block text-xs font-medium text-muted-foreground/40 mb-1";

export const ADD_BUTTON =
  "w-fit gap-1.5 text-sm text-muted-foreground/60 transition-colors hover:text-foreground";

export const TRASH_BUTTON =
  "size-8 shrink-0 text-foreground/25 transition-colors hover:bg-destructive/8 hover:text-destructive";

export const FORM_MESSAGE = "text-xs text-destructive";

const DEFAULT_PLACEHOLDERS: Partial<Record<FieldType, string>> = {
  text: "Type something…",
  textarea: "Write something…",
  url: "https://ado.fan/",
  number: "0",
  color: "#FFFFFF",
  date: "Pick a date",
  select: "Choose an option",
};

export function getPlaceholder(field: FieldConfig): string {
  if (field.placeholder) return field.placeholder;
  const type = field.type ?? "text";
  return DEFAULT_PLACEHOLDERS[type] ?? `Enter ${field.label.toLowerCase()}`;
}
