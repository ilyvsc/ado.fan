"use client";

import { Control, useFormState } from "react-hook-form";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { cn } from "@/lib/utils";

import { type ParseableSchema } from "../validation";
import { GroupsLayout } from "./FormGroups";

import type { TabConfig } from "@/admin/types/forms";

function tabHasError(tab: TabConfig, errors: Record<string, unknown>): boolean {
  const fieldNames = tab.groups?.flatMap((g) => g.fields.map((f) => f.name)) ?? [];
  return fieldNames.some((name) => name in errors);
}

export function AdminFormTabs({
  tabs,
  control,
  schema,
}: {
  tabs: TabConfig[];
  control: unknown;
  schema?: ParseableSchema;
}) {
  const { errors } = useFormState({ control: control as Control });

  return (
    <Tabs
      defaultValue={tabs[0]?.label}
      className="flex w-full flex-col gap-6 sm:max-w-4xl lg:max-w-6xl"
    >
      <TabsList className="mx-auto flex h-auto w-full max-w-lg flex-wrap gap-2 rounded-lg border border-foreground/10 bg-foreground/3 p-1">
        {tabs.map((tab) => {
          const hasError = tabHasError(tab, errors);
          const Icon = tab.icon;

          return (
            <TabsTrigger
              key={tab.label}
              value={tab.label}
              className={cn(
                "relative flex flex-1 items-center justify-center gap-1.5 rounded-md px-4 py-1.5 text-sm transition-all duration-150",
                "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
              )}
            >
              {Icon && <Icon className="size-3.5 shrink-0" />}
              <span className="font-semibold">{tab.label}</span>
              {hasError && (
                <span className="bg-destructive absolute top-1 right-1 size-1.5 rounded-full" />
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.label}
          value={tab.label}
          className="mt-0 flex flex-col gap-6"
        >
          {tab.content}
          {tab.groups && (
            <GroupsLayout
              groups={tab.groups}
              control={control}
              schema={schema}
              columns={tab.columns ?? 1}
            />
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
