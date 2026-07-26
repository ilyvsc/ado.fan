"use client";

import { Code, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Control, useFieldArray } from "react-hook-form";

import { JsonEditor, serialize } from "@/admin/components/editors/JsonEditor";
import {
  ADD_BUTTON,
  BASE_INPUT,
  FIELD_LABEL,
  FORM_MESSAGE,
  OPTIONAL,
  REQUIRED,
  TRASH_BUTTON,
} from "@/admin/forms/modules/fields/field-utils";
import { type SongFormValues } from "@/admin/schemas/songs";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TypographyMuted } from "@/components/ui/typography";

import { cn } from "@/lib/utils";

function EntityFields({
  roleIndex,
  control,
}: {
  roleIndex: number;
  control: Control<SongFormValues>;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `credits.credits.${roleIndex}.entities`,
  });

  return (
    <div className="flex flex-col gap-2 border-l border-foreground/10 pl-4">
      {fields.map((entity, entityIndex) => (
        <div key={entity.id} className="flex items-end gap-2">
          <FormField
            control={control}
            name={`credits.credits.${roleIndex}.entities.${entityIndex}.name`}
            render={({ field }) => (
              <FormItem className="flex-1 space-y-0">
                {entityIndex === 0 && (
                  <label className={FIELD_LABEL}>Name{REQUIRED}</label>
                )}
                <FormControl>
                  <Input placeholder="e.g. Ado" {...field} className={BASE_INPUT} />
                </FormControl>
                <FormMessage className={FORM_MESSAGE} />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`credits.credits.${roleIndex}.entities.${entityIndex}.romanizedName`}
            render={({ field }) => (
              <FormItem className="flex-1 space-y-0">
                {entityIndex === 0 && (
                  <label className={FIELD_LABEL}>Romanized name{OPTIONAL}</label>
                )}
                <FormControl>
                  <Input placeholder="e.g. Ado" {...field} className={BASE_INPUT} />
                </FormControl>
                <FormMessage className={FORM_MESSAGE} />
              </FormItem>
            )}
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={cn(TRASH_BUTTON, entityIndex === 0 && "mt-5")}
            onClick={() => {
              remove(entityIndex);
            }}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={ADD_BUTTON}
        onClick={() => {
          append({ name: "", romanizedName: "" });
        }}
      >
        <Plus className="size-3.5" />
        Add entity
      </Button>
    </div>
  );
}

export function CreditsEditor({ control: rawControl }: { control: unknown }) {
  const control = rawControl as Control<SongFormValues>;
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "credits.credits",
  });

  const [jsonMode, setJsonMode] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonValid, setJsonValid] = useState(true);

  const enterJsonMode = () => {
    setJsonText(serialize(fields.map(({ id, ...rest }) => rest)));
    setJsonError(null);
    setJsonMode(true);
  };

  const exitJsonMode = () => {
    try {
      const parsed = JSON.parse(jsonText) as Parameters<typeof replace>[0];
      if (!Array.isArray(parsed)) throw new Error("Must be an array");
      replace(parsed);
      setJsonError(null);
      setJsonMode(false);
    } catch (e) {
      setJsonError(e instanceof Error ? e.message : "Invalid JSON");
    }
  };

  return (
    <div className="flex min-h-48 w-full flex-col gap-3 rounded-lg border border-foreground/12 bg-foreground/2 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-medium tracking-wider text-muted-foreground/60 uppercase">
            Credits
          </p>
          <TypographyMuted className="text-xs leading-snug">
            Attribute roles and contributors. Each role groups the people or
            organizations responsible for that contribution.
          </TypographyMuted>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 shrink-0 gap-1.5 rounded-md px-2 text-xs text-muted-foreground/50 hover:text-foreground"
          disabled={jsonMode && !jsonValid}
          onClick={jsonMode ? exitJsonMode : enterJsonMode}
        >
          <Code className="size-3" />
          {jsonMode ? "Editor" : "JSON"}
        </Button>
      </div>

      {jsonMode ? (
        <JsonEditor
          value={jsonText}
          onChange={(v) => {
            setJsonText(v);
            setJsonError(null);
          }}
          rows={14}
          error={jsonError}
          onValidityChange={setJsonValid}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:items-start">
            {fields.map((role, roleIndex) => (
              <div
                key={role.id}
                className={cn(
                  "flex flex-col gap-3 rounded-lg border border-foreground/8 bg-background p-3",
                  "transition-colors duration-150 hover:border-foreground/20",
                )}
              >
                <div className="flex items-end gap-2">
                  <FormField
                    control={control}
                    name={`credits.credits.${roleIndex}.role`}
                    render={({ field }) => (
                      <FormItem className="flex-1 space-y-0">
                        <label className={FIELD_LABEL}>Role{REQUIRED}</label>
                        <FormControl>
                          <Input
                            placeholder="e.g. Composer, Lyricist"
                            {...field}
                            className={cn(BASE_INPUT, "font-medium")}
                          />
                        </FormControl>
                        <FormMessage className={FORM_MESSAGE} />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className={TRASH_BUTTON}
                    onClick={() => {
                      remove(roleIndex);
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
                <EntityFields roleIndex={roleIndex} control={control} />
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={ADD_BUTTON}
            onClick={() => {
              append({ role: "", entities: [{ name: "", romanizedName: "" }] });
            }}
          >
            <Plus className="size-3.5" />
            Add role
          </Button>
        </>
      )}
    </div>
  );
}
