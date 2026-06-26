import { cn } from "@/lib/utils";

import type { FieldConfig } from "@/admin/types/forms";

export const BASE_INPUT = cn(
  "h-9 w-full rounded-lg border border-foreground/12 bg-foreground/2 px-3 text-sm text-foreground",
  "placeholder:text-muted-foreground/50",
  "transition-colors duration-100",
  "hover:border-foreground/20 hover:bg-foreground/3",
  "focus-visible:border-ado-primary focus-visible:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ado-primary/20",
  "focus:border-ado-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-ado-primary/20",
  "disabled:cursor-not-allowed disabled:opacity-40",
  "aria-invalid:border-red-500/50 aria-invalid:ring-2 aria-invalid:ring-red-500/10",
);

export const READONLY = cn(
  "cursor-default select-all opacity-60 hover:border-foreground/12 hover:bg-foreground/2",
);

const DEFAULT_PLACEHOLDERS: Record<string, string> = {
  text: "Type something…",
  textarea: "Write something…",
  url: "https://example.com",
  number: "0",
  color: "#3b82f6",
  date: "Pick a date",
  select: "Choose an option",
};

export function getPlaceholder(field: FieldConfig): string {
  if (field.placeholder) return field.placeholder;
  const type = field.type ?? "text";
  return DEFAULT_PLACEHOLDERS[type] ?? `Enter ${field.label.toLowerCase()}`;
}
