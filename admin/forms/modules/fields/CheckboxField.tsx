import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormItem } from "@/components/ui/form";

import {
  FieldDescription,
  FieldLabel,
  FieldMessage,
  FieldProps,
} from "./FieldShared";

export function CheckboxField({ field, rhfField, invalid, required }: FieldProps) {
  return (
    <FormItem className="flex items-start gap-2.5 space-y-0 rounded-lg border border-foreground/12 bg-foreground/2 px-3 py-2.5">
      <FormControl>
        <Checkbox
          checked={!!rhfField.value}
          onCheckedChange={rhfField.onChange}
          disabled={field.disabled}
          aria-invalid={invalid}
          className="mt-0.5 size-4 rounded border border-foreground/25 data-[state=checked]:border-ado-primary data-[state=checked]:bg-ado-primary data-[state=checked]:text-ado-primary-foreground"
        />
      </FormControl>
      <div className="flex flex-col gap-0.5">
        <FieldLabel field={field} required={required} />
        <FieldDescription description={field.description} />
        <FieldMessage />
      </div>
    </FormItem>
  );
}
