import { Link2 } from "lucide-react";

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
  return (
    <FormItem className="flex flex-col gap-1">
      <FieldLabel field={field} required={required} />
      <FieldDescription description={field.description} />
      <FormControl>
        <div className="relative flex items-center">
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
            value={rhfField.value ?? ""}
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
      </FormControl>
      <FieldMessage />
    </FormItem>
  );
}
