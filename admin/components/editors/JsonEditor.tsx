"use client";

import { WandSparkles } from "lucide-react";
import { useRef, useMemo } from "react";

import { cn } from "@/lib/utils";

function tokenize(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /("(?:\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        if (match.startsWith('"')) {
          const cls = match.endsWith(":") || match.endsWith('":') ? "t-key" : "t-str";
          return `<span class="${cls}">${match}</span>`;
        }
        if (match === "true" || match === "false" || match === "null")
          return `<span class="t-kw">${match}</span>`;
        return `<span class="t-num">${match}</span>`;
      },
    );
}

export function serialize(val: unknown, depth = 0): string {
  if (val === null || typeof val !== "object") return JSON.stringify(val);

  const pad = "  ".repeat(depth);
  const inner = "  ".repeat(depth + 1);

  if (Array.isArray(val)) {
    if (val.length === 0) return "[]";
    const simple = val.every(
      (el) =>
        el !== null &&
        typeof el === "object" &&
        !Array.isArray(el) &&
        Object.values(el as object).every((v) => v === null || typeof v !== "object"),
    );
    if (simple) return `[${val.map((el) => JSON.stringify(el)).join(", ")}]`;
    return `[\n${val.map((el) => `${inner}${serialize(el, depth + 1)}`).join(",\n")}\n${pad}]`;
  }

  const entries = Object.entries(val as Record<string, unknown>);
  if (entries.length === 0) return "{}";
  return `{\n${entries.map(([k, v]) => `${inner}${JSON.stringify(k)}: ${serialize(v, depth + 1)}`).join(",\n")}\n${pad}}`;
}

function parseError(raw: string): string | null {
  if (!raw.trim()) return null;
  try {
    JSON.parse(raw);
    return null;
  } catch (e) {
    return e instanceof Error ? e.message : "Invalid JSON";
  }
}

export function JsonEditor({
  value,
  onChange,
  rows = 12,
  error,
  onValidityChange,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  error?: string | null;
  onValidityChange?: (valid: boolean) => void;
}) {
  const preRef = useRef<HTMLPreElement>(null);
  const highlighted = useMemo(() => tokenize(value), [value]);
  const liveError = useMemo(() => parseError(value), [value]);

  const handleChange = (v: string) => {
    onChange(v);
    onValidityChange?.(!parseError(v));
  };

  const handleFormat = () => {
    try {
      const formatted = JSON.stringify(JSON.parse(value), null, 2);
      onChange(formatted);
      onValidityChange?.(true);
    } catch {}
  };

  const displayError = liveError ?? error;

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className={cn(
          "relative rounded-md border bg-zinc-900",
          liveError ? "border-red-500/50" : "border-foreground/12",
        )}
      >
        <pre
          ref={preRef}
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 m-0 overflow-hidden px-3 py-2 font-mono text-xs leading-5 wrap-break-word whitespace-pre-wrap text-neutral-300",
            "[&_.t-key]:text-sky-300",
            "[&_.t-str]:text-orange-300",
            "[&_.t-kw]:text-blue-400",
            "[&_.t-num]:text-green-300",
          )}
          dangerouslySetInnerHTML={{ __html: highlighted + "\n" }}
        />
        <textarea
          value={value}
          onChange={(e) => {
            handleChange(e.target.value);
          }}
          onScroll={(e) => {
            if (preRef.current) preRef.current.scrollTop = e.currentTarget.scrollTop;
          }}
          rows={rows}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="relative z-10 w-full resize-y bg-transparent px-3 py-2 font-mono text-xs leading-5 text-transparent caret-white outline-none"
        />
        <button
          type="button"
          onClick={handleFormat}
          title="Format JSON"
          className="absolute right-2 bottom-2 z-20 flex items-center gap-1 rounded px-1.5 py-1 text-xs font-medium text-neutral-500 transition-colors hover:bg-white/8 hover:text-neutral-300"
        >
          <WandSparkles className="size-3" />
          Format
        </button>
      </div>
      {displayError && <p className="text-xs text-red-500">{displayError}</p>}
    </div>
  );
}
