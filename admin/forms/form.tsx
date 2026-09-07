"use client";

import type { UseFormReturn } from "react-hook-form";

import type { FormConfig } from "@/admin/types/forms";

import { FormGroup } from "./modules/FormGroups";
import { AdminFormTabs } from "./modules/FormTabs";
import { type ParseableSchema } from "./validation";

export function GenericForm({
  form,
  config,
  schema,
}: {
  form: UseFormReturn;
  config: FormConfig;
  schema?: ParseableSchema;
}) {
  if (config.tabs?.length) {
    return <AdminFormTabs tabs={config.tabs} control={form.control} schema={schema} />;
  }

  return (
    <div className="space-y-6">
      {config.groups?.map((group, i) => (
        <FormGroup key={i} group={group} control={form.control} schema={schema} />
      ))}
    </div>
  );
}
