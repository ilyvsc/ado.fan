"use client";

import { Code, Plus, Trash2 } from "lucide-react";

import { useState } from "react";
import { Control, useFieldArray } from "react-hook-form";

import { BASE_INPUT } from "@/admin/forms/modules/fields/field-utils";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const LINK_TYPES = [
  { value: "youtubeVideo", label: "YouTube Video" },
  { value: "nicoVideo", label: "Nico Video" },
  { value: "link", label: "Link" },
  { value: "embed", label: "Embed" },
] as const;

interface ExternalLinksEditorProps {
  control: unknown;
  fieldName: string;
}

export function ExternalLinksEditor({
  control: rawControl,
  fieldName,
}: ExternalLinksEditorProps) {
  const control = rawControl as Control;
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: fieldName,
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
      const parsed = JSON.parse(jsonText) as unknown[];
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
          External Links
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
            rows={12}
            spellCheck={false}
            className="w-full resize-y rounded-md border border-foreground/12 bg-foreground/3 px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-ado-primary/60 focus:ring-1 focus:ring-ado-primary/30 focus:outline-none"
          />
          {jsonError && <p className="text-xs text-red-500">{jsonError}</p>}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:items-start">
            {fields.map((link, index) => (
              <div
                key={link.id}
                className={cn(
                  "flex flex-col gap-3 rounded-lg border border-foreground/8 bg-background p-3",
                  "transition-colors duration-150 hover:border-foreground/20",
                )}
              >
                <div className="flex items-start gap-2">
                  <FormField
                    control={control}
                    name={`${fieldName}.${index}.type`}
                    render={({ field }) => (
                      <FormItem className="w-40 shrink-0">
                        <Select
                          onValueChange={field.onChange}
                          value={(field.value as string | null) ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={cn(
                                BASE_INPUT,
                                "flex items-center justify-between",
                              )}
                            >
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-lg border border-foreground/12 bg-background shadow-xl">
                            {LINK_TYPES.map((t) => (
                              <SelectItem
                                key={t.value}
                                value={t.value}
                                className="cursor-pointer rounded-md py-1.5 pr-3 pl-8 text-sm text-foreground hover:bg-foreground/5 focus:bg-ado-primary/10 focus:text-foreground"
                              >
                                {t.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs text-red-600" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`${fieldName}.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="URL or ID"
                            {...field}
                            value={(field.value as string | null) ?? ""}
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
                    className="hover:bg-destructive/8 hover:text-destructive mt-0.5 size-9 shrink-0 text-foreground/30 transition-colors"
                    onClick={() => {
                      remove(index);
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <div className="flex flex-col gap-2 border-l border-foreground/10 pl-4">
                  <FormField
                    control={control}
                    name={`${fieldName}.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Title (optional)"
                            {...field}
                            value={(field.value as string | null) ?? ""}
                            className={BASE_INPUT}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-600" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`${fieldName}.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Description (optional)"
                            {...field}
                            value={(field.value as string | null) ?? ""}
                            className={cn(BASE_INPUT, "h-auto resize-none py-2")}
                            rows={2}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-600" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-fit gap-1.5 text-sm text-muted-foreground/60 transition-colors hover:text-foreground"
            onClick={() => {
              append({ type: "link", value: "", title: null, description: null });
            }}
          >
            <Plus className="size-3.5" />
            Add link
          </Button>
        </>
      )}
    </div>
  );
}
