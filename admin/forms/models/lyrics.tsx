"use client";

import { Eye, EyeOff, Languages, Plus, Save, Trash2 } from "lucide-react";

import { useCallback, useEffect, useMemo, useState } from "react";
import Markdown from "react-markdown";

import {
  adminDeleteLyrics,
  adminGetSongLyrics,
  adminUpsertLyrics,
} from "@/admin/actions/songs";
import { DeleteConfirmDialog } from "@/admin/components/ui/DeleteConfirmDialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Locale } from "@/i18n/types";
import { cn } from "@/lib/utils";

interface LyricsEntry {
  language: string;
  translator: string | null;
  lines: string[];
}

// Source of truth: shared/i18n/types.ts. Add locales there to expose them as quick-add buttons.
const KNOWN_LANGUAGES = Object.values(Locale).map((l) => ({
  code: l.code,
  label: l.label,
}));

const BASE_INPUT =
  "h-8 w-full rounded-md border border-foreground/12 bg-foreground/3 px-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-ado-primary/60 focus:outline-none focus:ring-1 focus:ring-ado-primary/30";

function getLanguageLabel(code: string) {
  return KNOWN_LANGUAGES.find((l) => l.code === code)?.label ?? code.toUpperCase();
}

function LyricsEntryEditor({
  entry,
  songId,
  onSaved,
  onDeleted,
}: {
  entry: LyricsEntry;
  songId: string;
  onSaved: (updated: LyricsEntry) => void;
  onDeleted: (language: string) => void;
}) {
  const [text, setText] = useState(entry.lines.join("\n"));
  const [translator, setTranslator] = useState(entry.translator ?? "");
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [preview, setPreview] = useState(false);

  const handleTextChange = (v: string) => {
    setText(v);
    setDirty(true);
  };

  const handleTranslatorChange = (v: string) => {
    setTranslator(v);
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const lines = text.split("\n");
    const updated = await adminUpsertLyrics(
      songId,
      entry.language,
      lines,
      translator.trim() || null,
    );
    setSaving(false);
    setDirty(false);
    onSaved({ ...updated });
  };

  const persisted = entry.lines.length > 0 || entry.translator !== null;

  const handleDelete = async () => {
    if (persisted) {
      await adminDeleteLyrics(songId, entry.language);
    }
    onDeleted(entry.language);
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-foreground/12 bg-background p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Languages className="size-3.5 shrink-0 text-muted-foreground/50" />
          <span className="text-sm font-medium text-foreground">
            {getLanguageLabel(entry.language)}
          </span>
          <span className="font-mono text-xs text-muted-foreground/40">
            {entry.language}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setPreview((p) => !p);
            }}
            className="h-7 w-7 rounded-md p-0 text-muted-foreground/40 hover:text-foreground"
            title={preview ? "Edit" : "Preview"}
          >
            {preview ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={saving || !dirty}
            onClick={() => void handleSave()}
            className={cn(
              "h-7 gap-1.5 rounded-md px-2.5 text-xs font-medium",
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
            onClick={() => {
              const hasContent = text.trim() || translator.trim();
              if (hasContent) {
                setDeleteOpen(true);
              } else {
                void handleDelete();
              }
            }}
            className="hover:bg-destructive/10 hover:text-destructive h-7 w-7 rounded-md p-0 text-muted-foreground/40"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-muted-foreground/70">
          Translator
        </label>
        <Input
          value={translator}
          onChange={(e) => {
            handleTranslatorChange(e.target.value);
          }}
          placeholder="Optional translator name"
          className={BASE_INPUT}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-muted-foreground/70">
          Lines
          {!preview && (
            <span className="ml-1.5 text-muted-foreground/40">
              ({text.split("\n").length})
            </span>
          )}
        </label>
        {preview ? (
          <div className="prose prose-sm prose-invert min-h-40 w-full max-w-none rounded-md border border-foreground/12 bg-foreground/3 px-3 py-2 text-sm text-foreground">
            <Markdown>{text}</Markdown>
          </div>
        ) : (
          <textarea
            value={text}
            onChange={(e) => {
              handleTextChange(e.target.value);
            }}
            rows={10}
            spellCheck={false}
            className={cn(
              "w-full rounded-md border border-foreground/12 bg-foreground/3 px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-ado-primary/60 focus:ring-1 focus:ring-ado-primary/30 focus:outline-none",
              "resize-y",
            )}
            placeholder={"One line per row…"}
          />
        )}
      </div>

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

function AddLanguageRow({
  existing,
  onAdd,
}: {
  existing: string[];
  onAdd: (language: string) => void;
}) {
  const available = KNOWN_LANGUAGES.filter((l) => !existing.includes(l.code));
  const [customOpen, setCustomOpen] = useState(false);
  const [custom, setCustom] = useState("");

  return (
    <div className="flex flex-wrap items-center gap-2">
      {available.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => {
            onAdd(lang.code);
          }}
          className="flex items-center gap-1.5 rounded-md border border-foreground/12 bg-foreground/3 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-ado-primary/40 hover:bg-ado-primary/5 hover:text-foreground"
        >
          <Plus className="size-3" />
          {lang.label}
        </button>
      ))}
      {customOpen ? (
        <div className="flex items-center gap-1.5">
          <Input
            value={custom}
            onChange={(e) => {
              setCustom(e.target.value);
            }}
            placeholder="Language code"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const code = custom.trim();
                const isKnown = KNOWN_LANGUAGES.some((l) => l.code === code);
                if (code && !existing.includes(code) && !isKnown) {
                  onAdd(custom.trim());
                  setCustom("");
                  setCustomOpen(false);
                }
              }
              if (e.key === "Escape") {
                setCustom("");
                setCustomOpen(false);
              }
            }}
            maxLength={4}
            autoCapitalize="off"
            className="h-7 w-28 rounded-md border border-foreground/12 bg-foreground/3 px-2 text-xs text-foreground placeholder:text-xs placeholder:text-muted-foreground/40 focus:border-ado-primary/60 focus:ring-1 focus:ring-ado-primary/30 focus:outline-none"
          />
          <button
            type="button"
            disabled={
              !custom.trim() ||
              existing.includes(custom.trim()) ||
              KNOWN_LANGUAGES.some((l) => l.code === custom.trim())
            }
            onClick={() => {
              onAdd(custom.trim());
              setCustom("");
              setCustomOpen(false);
            }}
            className="flex items-center gap-1 rounded-md border border-foreground/12 bg-foreground/3 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-ado-primary/40 hover:bg-ado-primary/5 hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            <Plus className="size-3" />
            Add
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setCustomOpen(true);
          }}
          className="flex items-center gap-1.5 rounded-md border border-dashed border-foreground/12 bg-transparent px-2.5 py-1 text-xs text-muted-foreground/50 transition-colors hover:border-ado-primary/40 hover:bg-ado-primary/5 hover:text-foreground"
        >
          <Plus className="size-3" />
          Custom
        </button>
      )}
    </div>
  );
}

export function SongLyricsEditor({ songId }: { songId: string }) {
  const [entries, setEntries] = useState<LyricsEntry[] | null>(null);

  useEffect(() => {
    void adminGetSongLyrics(songId).then(setEntries);
  }, [songId]);

  const handleAdd = useCallback((language: string) => {
    setEntries((prev) => [
      ...(prev ?? []),
      { language, translator: null, lines: [] },
    ]);
  }, []);

  const handleSaved = useCallback((updated: LyricsEntry) => {
    setEntries((prev) =>
      (prev ?? []).map((e) => (e.language === updated.language ? updated : e)),
    );
  }, []);

  const handleDeleted = useCallback((language: string) => {
    setEntries((prev) => (prev ?? []).filter((e) => e.language !== language));
  }, []);

  const existingLanguages = useMemo(
    () => entries?.map((e) => e.language) ?? [],
    [entries],
  );

  return (
    <div className="flex w-full flex-col gap-4 rounded-lg border border-foreground/12 bg-foreground/2 p-4">
      <p className="text-xs font-medium tracking-wider text-muted-foreground/60 uppercase">
        Lyrics
      </p>

      {entries === null && (
        <p className="text-sm text-muted-foreground/50">Loading…</p>
      )}

      {entries !== null && entries.length === 0 && (
        <p className="text-sm text-muted-foreground/50">No lyrics yet.</p>
      )}

      {entries !== null && entries.length > 0 && (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {entries.map((entry) => (
            <LyricsEntryEditor
              key={entry.language}
              entry={entry}
              songId={songId}
              onSaved={handleSaved}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}

      {entries !== null && (
        <AddLanguageRow existing={existingLanguages} onAdd={handleAdd} />
      )}
    </div>
  );
}
