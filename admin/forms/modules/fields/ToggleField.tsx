import { FormControl, FormItem } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

import { FieldDescription, FieldLabel, FieldProps } from "./FieldShared";

export function ToggleField({ field, rhfField, required }: FieldProps) {
  return (
    <FormItem className="flex items-center justify-between gap-4 space-y-0 rounded-lg border border-foreground/12 bg-foreground/2 px-3 py-2.5 transition-colors hover:bg-foreground/3">
      <div className="flex flex-col gap-0.5">
        <FieldLabel field={field} required={required} />
        <FieldDescription description={field.description} />
      </div>
      <FormControl>
        <Switch
          checked={!!rhfField.value}
          onCheckedChange={rhfField.onChange}
          disabled={field.disabled}
          className="data-[state=checked]:bg-ado-primary data-[state=unchecked]:bg-foreground/15"
        />
      </FormControl>
    </FormItem>
  );
}
