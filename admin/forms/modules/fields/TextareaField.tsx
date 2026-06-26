import { FormControl, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { READONLY } from "./field-utils";
import {
  FieldDescription,
  FieldLabel,
  FieldMessage,
  FieldProps,
} from "./FieldShared";

export function TextareaField({
  field,
  rhfField,
  invalid,
  required,
  placeholder,
}: FieldProps) {
  return (
    <FormItem className="flex flex-col gap-1">
      <FieldLabel field={field} required={required} />
      <FieldDescription description={field.description} />
      <FormControl>
        <Textarea
          {...rhfField}
          value={rhfField.value ?? ""}
          placeholder={placeholder}
          disabled={field.disabled}
          readOnly={field.readOnly}
          rows={field.rows}
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
            field.rows ? undefined : "min-h-22",
            field.readOnly && READONLY,
          )}
        />
      </FormControl>
      <FieldMessage />
    </FormItem>
  );
}
