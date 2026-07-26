"use client";

import { Eye, EyeOff, PenLine, Save, Trash2 } from "lucide-react";
import { useState } from "react";

import { adminDeleteLyrics, adminUpsertLyrics } from "@/admin/actions/songs";
import { DeleteConfirmDialog } from "@/admin/components/ui/DeleteConfirmDialog";
import { BASE_INPUT } from "@/admin/forms/modules/fields/field-utils";
import { MarkdownPreview } from "@/admin/forms/modules/fields/MarkdownField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getLanguageLabel, type LyricsEntry } from "@/types/lyrics";

import { LyricsReferencePanel } from "./LyricsReferencePanel";
import { LyricsTextarea } from "./LyricsTextarea";

export function LyricsEntryEditor({
  entry,
  songId,
  compareEntry,
  onSaved,
  onDeleted,
}: {
  entry: LyricsEntry;
  songId: string;
  compareEntry?: LyricsEntry;
  onSaved: (updated: LyricsEntry) => void;
  onDeleted: (language: string) => void;
}) {
  const [text, setText] = useState(entry.lines.join("\n"));
  const [translator, setTranslator] = useState(entry.translator ?? "");
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const updated = await adminUpsertLyrics(
      songId,
      entry.language,
      text.split("\n"),
      translator.trim() || null,
    );
    setSaving(false);
    setDirty(false);
    onSaved({ ...updated });
    exitEdit();
  };

  const handleCancel = () => {
    setText(entry.lines.join("\n"));
    setTranslator(entry.translator ?? "");
    setDirty(false);
    exitEdit();
  };

  const handleDelete = async () => {
    const persisted = entry.lines.length > 0 || entry.translator !== null;
    if (persisted) await adminDeleteLyrics(songId, entry.language);
    onDeleted(entry.language);
  };

  const enterEdit = () => {
    setEditing(true);
    setPreview(false);
  };
  const exitEdit = () => {
    setEditing(false);
    setPreview(false);
  };

  const editorContent = editing ? (
    preview ? (
      <MarkdownPreview text={text} className="min-h-40 rounded-md px-5 py-4" />
    ) : (
      <LyricsTextarea
        value={text}
        language={entry.language}
        onChange={(v) => {
          setText(v);
          setDirty(true);
        }}
        placeholder="One lyric line per row. Blank line = stanza break. ## Section for headers."
      />
    )
  ) : (
    <LyricsReferencePanel lines={entry.lines} language={entry.language} />
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-3">
        {editing ? (
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground/70">
              Translator
            </label>
            <Input
              value={translator}
              onChange={(e) => {
                setTranslator(e.target.value);
                setDirty(true);
              }}
              placeholder="Optional translator name"
              className={BASE_INPUT}
            />
          </div>
        ) : (
          <div className="flex-1">
            {translator ? (
              <p className="text-xs text-muted-foreground/50">
                Translated by{" "}
                <span className="text-muted-foreground/70">{translator}</span>
              </p>
            ) : (
              <p className="text-xs text-muted-foreground/30">No translator</p>
            )}
          </div>
        )}

        <div className="flex shrink-0 items-center gap-1.5">
          {editing ? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setPreview((p) => !p);
                }}
                title={preview ? "Edit" : "Preview markdown"}
                className="h-8 w-8 rounded-md p-0 text-muted-foreground/40 hover:text-foreground"
              >
                {preview ? (
                  <EyeOff className="size-3.5" />
                ) : (
                  <Eye className="size-3.5" />
                )}
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={saving || !dirty}
                onClick={() => void handleSave()}
                className={cn(
                  "h-8 gap-1.5 rounded-md px-3 text-xs font-medium",
                  dirty
                    ? "bg-ado-primary text-ado-primary-foreground hover:bg-ado-primary/90"
                    : "bg-foreground/5 text-muted-foreground",
                )}
              >
                <Save className="size-3" />
                {saving ? "Saving…" : "Save"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="h-8 rounded-md px-2.5 text-xs text-muted-foreground/40 hover:text-foreground"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={enterEdit}
              className="h-8 gap-1.5 rounded-md px-2.5 text-xs text-muted-foreground/60 hover:text-foreground"
            >
              <PenLine className="size-3" />
              Edit
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              if (text.trim() || translator.trim()) setDeleteOpen(true);
              else void handleDelete();
            }}
            className="hover:bg-destructive/10 hover:text-destructive h-8 w-8 rounded-md p-0 text-muted-foreground/40"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>

      {compareEntry ? (
        <div className="grid grid-cols-2 items-start gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider text-muted-foreground/60 uppercase">
                {getLanguageLabel(entry.language)}
              </span>
              {dirty && <span className="text-xs text-ado-primary">· unsaved</span>}
              <span className="ml-auto text-xs text-muted-foreground/30">
                {text.split("\n").length} lines
              </span>
            </div>
            {editorContent}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider text-muted-foreground/40 uppercase">
                {getLanguageLabel(compareEntry.language)}
              </span>
              {compareEntry.translator && (
                <span className="text-xs text-muted-foreground/30">
                  · {compareEntry.translator}
                </span>
              )}
              <span className="ml-auto text-xs text-muted-foreground/30">
                {compareEntry.lines.length} lines
              </span>
            </div>
            <LyricsReferencePanel
              lines={compareEntry.lines}
              language={compareEntry.language}
            />
          </div>
        </div>
      ) : (
        editorContent
      )}

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() => void handleDelete()}
        title={`Delete ${getLanguageLabel(entry.language)} lyrics?`}
        description="This will permanently remove all lines for this language."
      />
    </div>
  );
}
