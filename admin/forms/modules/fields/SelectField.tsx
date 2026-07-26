import { FormControl, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { BASE_INPUT } from "./field-utils";
import {
  FieldDescription,
  FieldLabel,
  FieldMessage,
  FieldProps,
} from "./FieldShared";

export function SelectField({
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
      <Select
        value={rhfField.value}
        onValueChange={rhfField.onChange}
        disabled={field.disabled}
      >
        <FormControl>
          <SelectTrigger
            aria-invalid={invalid}
            className={cn(BASE_INPUT, "flex items-center justify-between")}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent className="rounded-xl border border-foreground/12 bg-background shadow-xl">
          {field.options?.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="cursor-pointer rounded-md py-1.5 pr-3 pl-8 text-sm text-foreground focus:bg-ado-primary/10 focus:text-foreground"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldMessage />
    </FormItem>
  );
}
