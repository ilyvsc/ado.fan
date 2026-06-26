import { ControllerRenderProps } from "react-hook-form";

import { FormDescription, FormLabel, FormMessage } from "@/components/ui/form";

import type { FieldConfig } from "@/admin/types/forms";

export type RhfField = Omit<ControllerRenderProps, "value"> & {
  value: string | undefined;
};

export interface FieldProps {
  field: FieldConfig;
  rhfField: RhfField;
  invalid: boolean;
  required: boolean;
  placeholder: string;
}

export function FieldLabel({
  field,
  required,
}: {
  field: FieldConfig;
  required: boolean;
}) {
  const IconComponent = field.icon;
  return (
    <FormLabel className="flex items-center gap-1.5 text-sm font-medium text-foreground">
      {IconComponent && (
        <IconComponent className="size-3.5 shrink-0 text-muted-foreground" />
      )}
      {field.label}
      {required && (
        <span className="text-destructive ml-0.5 text-xs leading-none" aria-hidden>
          *
        </span>
      )}
    </FormLabel>
  );
}

export function FieldDescription({ description }: { description?: string }) {
  if (!description) return null;
  return (
    <FormDescription className="text-xs leading-snug text-muted-foreground/70">
      {description}
    </FormDescription>
  );
}

export function FieldMessage() {
  return <FormMessage className="text-destructive text-xs" />;
}
