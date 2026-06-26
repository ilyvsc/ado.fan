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

export function TextField({
  field,
  rhfField,
  invalid,
  required,
  placeholder,
}: FieldProps) {
  const hasAffix = Boolean(field.prefix) || Boolean(field.suffix);

  const input = (
    <Input
      {...rhfField}
      value={rhfField.value ?? ""}
      placeholder={placeholder}
      inputMode="text"
      autoComplete="off"
      autoCapitalize="off"
      spellCheck={false}
      disabled={field.disabled}
      readOnly={field.readOnly}
      aria-invalid={invalid}
      className={cn(
        BASE_INPUT,
        hasAffix && field.prefix ? "pl-7" : undefined,
        hasAffix && field.suffix ? "pr-7" : undefined,
        field.readOnly && READONLY,
      )}
    />
  );

  return (
    <FormItem className="flex flex-col gap-1">
      <FieldLabel field={field} required={required} />
      <FieldDescription description={field.description} />
      <FormControl>
        {hasAffix ? (
          <div className="relative flex items-center">
            {field.prefix && (
              <span className="pointer-events-none absolute left-3 text-sm text-muted-foreground/60 select-none">
                {field.prefix}
              </span>
            )}
            {input}
            {field.suffix && (
              <span className="pointer-events-none absolute right-3 text-sm text-muted-foreground/60 select-none">
                {field.suffix}
              </span>
            )}
          </div>
        ) : (
          input
        )}
      </FormControl>
      <FieldMessage />
    </FormItem>
  );
}
