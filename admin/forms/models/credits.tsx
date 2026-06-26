"use client";

import { Code, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Control, useFieldArray } from "react-hook-form";

import { BASE_INPUT } from "@/admin/forms/modules/fields/field-utils";
import { type SongFormValues } from "@/admin/schemas/songs";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
        <div key={entity.id} className="flex items-start gap-2">
          <FormField
            control={control}
            name={`credits.credits.${roleIndex}.entities.${entityIndex}.name`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Name" {...field} className={BASE_INPUT} />
                </FormControl>
                <FormMessage className="text-xs text-red-600" />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`credits.credits.${roleIndex}.entities.${entityIndex}.romanizedName`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="Romanized name (optional)"
                    {...field}
                    className={BASE_INPUT}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-600" />
              </FormItem>
            )}
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="mt-0.5 size-9 shrink-0 text-foreground/30 transition-colors hover:bg-red-500/8 hover:text-red-500"
            onClick={() => {
              remove(entityIndex);
            }}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="w-fit gap-1.5 text-sm text-muted-foreground/60 transition-colors hover:text-foreground"
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

  const enterJsonMode = () => {
    setJsonText(
      JSON.stringify(
        fields.map(({ id, ...rest }) => rest),
        null,
        2,
      ),
    );
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
    <div className="flex w-full flex-col gap-3 rounded-lg border border-foreground/12 bg-foreground/2 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium tracking-wider text-muted-foreground/60 uppercase">
          Credits
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-6 gap-1.5 rounded-md px-2 text-xs",
            jsonMode
              ? "bg-ado-primary/10 text-ado-primary hover:bg-ado-primary/20"
              : "text-muted-foreground/50 hover:text-foreground",
          )}
          onClick={jsonMode ? exitJsonMode : enterJsonMode}
        >
          <Code className="size-3" />
          {jsonMode ? "Apply JSON" : "JSON"}
        </Button>
      </div>

      {jsonMode ? (
        <div className="flex flex-col gap-2">
          <Textarea
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setJsonError(null);
            }}
            rows={14}
            spellCheck={false}
            className="w-full resize-y rounded-md border border-foreground/12 bg-foreground/3 px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-ado-primary/60 focus:ring-1 focus:ring-ado-primary/30 focus:outline-none"
          />
          {jsonError && <p className="text-xs text-red-500">{jsonError}</p>}
        </div>
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
                <div className="flex items-start gap-2">
                  <FormField
                    control={control}
                    name={`credits.credits.${roleIndex}.role`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Role (e.g. Composer)"
                            {...field}
                            className={cn(BASE_INPUT, "font-medium")}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-600" />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="mt-0.5 size-9 shrink-0 text-foreground/30 transition-colors hover:bg-red-500/8 hover:text-red-500"
                    onClick={() => {
                      remove(roleIndex);
                    }}
                  >
                    <Trash2 className="size-4" />
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
            className="w-fit gap-1.5 text-sm text-muted-foreground/60 transition-colors hover:text-foreground"
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
