"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { KNOWN_LANGUAGES } from "@/types/lyrics";

export function LanguageDialog({
  existing,
  onAdd,
}: {
  existing: string[];
  onAdd: (language: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState("");

  const available = useMemo(
    () => KNOWN_LANGUAGES.filter((l) => !existing.includes(l.code)),
    [existing],
  );

  const pick = (code: string) => {
    onAdd(code);
    setOpen(false);
  };

  const addCustom = () => {
    const code = custom.trim().toLowerCase();
    if (!code) return;
    onAdd(code);
    setCustom("");
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
        }}
        className={cn(
          "flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1 text-xs",
          "border border-dashed border-foreground/15 text-muted-foreground/50",
          "transition-colors hover:border-ado-primary/40 hover:bg-ado-primary/5 hover:text-foreground",
        )}
      >
        <Plus className="size-3" />
        Add
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-medium">Add Language</DialogTitle>
          </DialogHeader>
          {available.length > 0 && (
            <div className="flex max-h-52 flex-wrap gap-1.5 overflow-y-auto">
              {available.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    pick(lang.code);
                  }}
                  className={cn(
                    "rounded-md border border-foreground/10 px-2.5 py-1 text-xs text-foreground",
                    "transition-colors hover:border-ado-primary/40 hover:bg-ado-primary/5",
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2 border-t border-foreground/8 pt-3">
            <Input
              value={custom}
              onChange={(e) => {
                setCustom(e.target.value);
              }}
              placeholder="Custom code (e.g. zh-TW, pt-BR)"
              className="h-8 flex-1 rounded-md border border-foreground/12 bg-foreground/2 px-3 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-ado-primary/60 focus:ring-1 focus:ring-ado-primary/30 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustom();
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              onClick={addCustom}
              disabled={!custom.trim()}
              className="h-8 shrink-0 rounded-md bg-ado-primary px-3 text-xs font-medium text-ado-primary-foreground hover:bg-ado-primary/90 disabled:opacity-40"
            >
              Add
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
