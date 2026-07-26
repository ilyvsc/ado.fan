"use client";

import { SiNiconico, SiYoutube } from "@icons-pack/react-simple-icons";
import { Code, Plus, Trash2 } from "lucide-react";

import { useState } from "react";
import { Control, useFieldArray, useWatch } from "react-hook-form";

import { JsonEditor, serialize } from "@/admin/components/editors/JsonEditor";
import {
  ADD_BUTTON,
  BASE_INPUT,
  FIELD_LABEL,
  FORM_MESSAGE,
  OPTIONAL,
  TRASH_BUTTON,
} from "@/admin/forms/modules/fields/field-utils";

import { Button } from "@/components/ui/button";
import { FieldTitle } from "@/components/ui/field";
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
import { TypographyMuted } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

const LINK_TYPES = [
  { value: "youtubeVideo", label: "YouTube Video" },
  { value: "nicoVideo", label: "Nico Video" },
  { value: "link", label: "Link" },
  { value: "embed", label: "Embed" },
] as const;

function valuePlaceholder(type: string | undefined) {
  if (type === "youtubeVideo") return "YouTube video ID";
  if (type === "nicoVideo") return "Nico video ID";
  return "URL";
}

function LinkRow({
  control,
  fieldName,
  index,
  onRemove,
}: {
  control: Control;
  fieldName: string;
  index: number;
  onRemove: () => void;
}) {
  const type = useWatch({ control, name: `${fieldName}.${index}.type` }) as
    | string
    | undefined;
  const value = useWatch({ control, name: `${fieldName}.${index}.value` }) as
    | string
    | undefined;

  const watchHref =
    (type === "youtubeVideo" || type === "nicoVideo") && value
      ? value.startsWith("http")
        ? value
        : type === "youtubeVideo"
          ? `https://youtube.com/watch?v=${value}`
          : `https://www.nicovideo.jp/watch/${value}`
      : null;

  const WatchIcon = type === "youtubeVideo" ? SiYoutube : SiNiconico;

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border border-foreground/8 bg-background p-2.5",
        "transition-colors duration-150 hover:border-foreground/20",
      )}
    >
      <div className="flex items-center gap-2">
        <FormField
          control={control}
          name={`${fieldName}.${index}.type`}
          render={({ field }) => (
            <FormItem className="w-36 shrink-0 space-y-0">
              <Select
                onValueChange={field.onChange}
                value={(field.value as string | null) ?? ""}
              >
                <FormControl>
                  <SelectTrigger
                    className={cn(BASE_INPUT, "flex items-center justify-between")}
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
              <FormMessage className={FORM_MESSAGE} />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${fieldName}.${index}.value`}
          render={({ field }) => (
            <FormItem className="min-w-0 flex-1 space-y-0">
              <FormControl>
                <Input
                  placeholder={valuePlaceholder(type)}
                  {...field}
                  value={(field.value as string | null) ?? ""}
                  className={BASE_INPUT}
                />
              </FormControl>
              <FormMessage className={FORM_MESSAGE} />
            </FormItem>
          )}
        />
        <div className="flex shrink-0 items-center gap-1">
          {watchHref && (
            <a
              href={watchHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 items-center gap-1.5 rounded-md border border-foreground/10 bg-foreground/5 px-2.5 text-xs text-muted-foreground/50 transition-colors hover:border-foreground/20 hover:text-foreground"
            >
              <WatchIcon className="size-3" />
              Watch
            </a>
          )}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={TRASH_BUTTON}
            onClick={onRemove}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 border-l border-foreground/8 pl-3">
        <FormField
          control={control}
          name={`${fieldName}.${index}.title`}
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FieldTitle className={FIELD_LABEL}>Title{OPTIONAL}</FieldTitle>
              <FormControl>
                <Input
                  placeholder="Display name shown to visitors"
                  {...field}
                  value={(field.value as string | null) ?? ""}
                  className={BASE_INPUT}
                />
              </FormControl>
              <FormMessage className={FORM_MESSAGE} />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${fieldName}.${index}.description`}
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FieldTitle className={FIELD_LABEL}>Description{OPTIONAL}</FieldTitle>
              <FormControl>
                <Textarea
                  placeholder="Short note or context about this link"
                  {...field}
                  value={(field.value as string | null) ?? ""}
                  className={cn(BASE_INPUT, "h-auto resize-none py-1.5")}
                  rows={2}
                />
              </FormControl>
              <FormMessage className={FORM_MESSAGE} />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

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
  const [jsonValid, setJsonValid] = useState(true);

  const enterJsonMode = () => {
    setJsonText(serialize(fields.map(({ id, ...rest }) => rest)));
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
    <div className="flex min-h-48 w-full flex-col gap-3 rounded-lg border border-foreground/12 bg-foreground/2 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-medium tracking-wider text-muted-foreground/60 uppercase">
            External Links
          </p>
          <TypographyMuted className="text-xs leading-snug">
            Link this song to platform videos and external resources. YouTube and
            NicoNico entries unlock the Watch button on public pages.
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
          rows={12}
          error={jsonError}
          onValidityChange={setJsonValid}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:items-start">
            {fields.map((link, index) => (
              <LinkRow
                key={link.id}
                control={control}
                fieldName={fieldName}
                index={index}
                onRemove={() => {
                  remove(index);
                }}
              />
            ))}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={ADD_BUTTON}
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
