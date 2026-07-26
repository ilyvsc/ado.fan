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

export function blockNonNumeric(e: React.KeyboardEvent<HTMLInputElement>) {
  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !/[\d.\-]/.test(e.key)) {
    e.preventDefault();
  }
}

export function NumberField({
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
        <div className="relative flex items-center">
          {field.prefix && (
            <span className="pointer-events-none absolute left-3 text-sm text-muted-foreground/60 select-none">
              {field.prefix}
            </span>
          )}
          <Input
            {...rhfField}
            type="number"
            inputMode="numeric"
            autoComplete="off"
            value={rhfField.value ?? ""}
            placeholder={placeholder}
            disabled={field.disabled}
            readOnly={field.readOnly}
            aria-invalid={invalid}
            onKeyDown={blockNonNumeric}
            className={cn(
              BASE_INPUT,
              field.prefix && "pl-7",
              field.suffix && "pr-7",
              field.readOnly && READONLY,
            )}
          />
          {field.suffix && (
            <span className="pointer-events-none absolute right-3 text-sm text-muted-foreground/60 select-none">
              {field.suffix}
            </span>
          )}
        </div>
      </FormControl>
      <FieldMessage />
    </FormItem>
  );
}
