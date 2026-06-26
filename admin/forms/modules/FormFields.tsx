"use client";

import { Control, FieldValues, Path } from "react-hook-form";

import { FormField } from "@/components/ui/form";

import { isFieldRequired, type ParseableSchema } from "../validation";
import {
  CheckboxField,
  ColorField,
  DateField,
  NumberField,
  SelectField,
  TextField,
  TextareaField,
  ToggleField,
  UrlField,
} from "./fields/";
import { getPlaceholder } from "./fields/field-utils";

import type { FieldConfig } from "@/admin/types/forms";

export function RenderField({
  field,
  control,
  schema,
}: {
  field: FieldConfig;
  control: unknown;
  schema?: ParseableSchema;
}) {
  const name: Path<FieldValues> = field.name;
  const required = field.optional ? false : isFieldRequired(schema, name);
  const typedControl = control as Control;
  const placeholder = getPlaceholder(field);

  return (
    <FormField
      control={typedControl}
      name={name}
      render={({ field: rhfField, fieldState }) => {
        const invalid = !!fieldState.error;
        const shared = { field, rhfField, invalid, required, placeholder };

        switch (field.type) {
          case "textarea":
            return <TextareaField {...shared} />;
          case "select":
            return <SelectField {...shared} />;
          case "checkbox":
            return <CheckboxField {...shared} />;
          case "toggle":
            return <ToggleField {...shared} />;
          case "date":
            return <DateField {...shared} />;
          case "number":
            return <NumberField {...shared} />;
          case "url":
            return <UrlField {...shared} />;
          case "color":
            return <ColorField {...shared} />;
          default:
            return <TextField {...shared} />;
        }
      }}
    />
  );
}
