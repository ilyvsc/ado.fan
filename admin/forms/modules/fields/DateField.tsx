import { format, isValid, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";

import * as React from "react";

import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { BASE_INPUT, READONLY } from "./field-utils";
import {
  FieldDescription,
  FieldLabel,
  FieldMessage,
  FieldProps,
} from "./FieldShared";

interface Segments {
  mm: string;
  dd: string;
  yyyy: string;
}

interface CalendarDropdownOption {
  value: number;
  label: string;
  disabled: boolean;
}

interface CalendarDropdownProps {
  value?: string | number | readonly string[];
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  options?: CalendarDropdownOption[];
  "aria-label"?: string;
}

const SEGMENT_CLS =
  "h-auto rounded-none border-0 bg-transparent p-0 text-center text-xs focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 tabular-nums placeholder:text-muted-foreground/40 md:text-xs";

function CalendarDropdown({
  value,
  onChange,
  options,
  "aria-label": ariaLabel,
}: CalendarDropdownProps) {
  return (
    <Select
      value={String(value)}
      onValueChange={(val) =>
        onChange?.({
          target: { value: val },
        } as React.ChangeEvent<HTMLSelectElement>)
      }
    >
      <SelectTrigger
        aria-label={ariaLabel}
        className="h-7 w-auto gap-1 border-foreground/12 bg-foreground/4 px-2 text-xs focus:ring-1 focus:ring-ado-primary/30 focus:ring-offset-0 [&>svg]:size-3 [&>svg]:opacity-60"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="rounded-xl border-foreground/12 bg-background">
        {options?.map((opt) => (
          <SelectItem
            key={opt.value}
            value={String(opt.value)}
            disabled={opt.disabled}
            className="text-xs"
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function parseIsoDate(iso: string): Date | undefined {
  if (!iso) return undefined;
  const d = parse(iso, "yyyy-MM-dd", new Date());
  return isValid(d) ? d : undefined;
}

function clampSegment(val: string, min: number, max: number): string {
  const n = parseInt(val, 10);
  if (isNaN(n)) return val;
  return String(Math.min(Math.max(n, min), max)).padStart(2, "0");
}

function blockNonNumeric(e: React.KeyboardEvent) {
  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !/\d/.test(e.key)) {
    e.preventDefault();
  }
}

export function DateField({
  field,
  rhfField,
  invalid,
  required,
  placeholder,
}: FieldProps) {
  const isoValue: string = rhfField.value ?? "";
  const parsed = parseIsoDate(isoValue);
  const fromYear = field.fromYear ?? 2017;
  const toYear = new Date().getFullYear();

  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Segments | null>(null);

  const [prevIso, setPrevIso] = React.useState(isoValue);
  if (isoValue !== prevIso) {
    setPrevIso(isoValue);
    setEditing(null);
  }

  const mmRef = React.useRef<HTMLInputElement>(null);
  const ddRef = React.useRef<HTMLInputElement>(null);
  const yyyyRef = React.useRef<HTMLInputElement>(null);

  const mm = editing?.mm ?? (parsed ? format(parsed, "MM") : "");
  const dd = editing?.dd ?? (parsed ? format(parsed, "dd") : "");
  const yyyy = editing?.yyyy ?? (parsed ? format(parsed, "yyyy") : "");

  function tryCommit(segs: Segments) {
    if (segs.mm.length !== 2 || segs.dd.length !== 2 || segs.yyyy.length !== 4)
      return;
    const d = parse(`${segs.yyyy}-${segs.mm}-${segs.dd}`, "yyyy-MM-dd", new Date());
    rhfField.onChange(isValid(d) ? format(d, "yyyy-MM-dd") : "");
  }

  function handleMmChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 2);
    const value = raw.length === 2 ? clampSegment(raw, 1, 12) : raw;
    const segs: Segments = { mm: value, dd, yyyy };
    setEditing(segs);
    tryCommit(segs);
    if (value.length === 2) ddRef.current?.focus();
  }

  function handleDdChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 2);
    const value = raw.length === 2 ? clampSegment(raw, 1, 31) : raw;
    const segs: Segments = { mm, dd: value, yyyy };
    setEditing(segs);
    tryCommit(segs);
    if (value.length === 2) yyyyRef.current?.focus();
  }

  function handleYyyyChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    const value =
      raw.length === 4
        ? String(Math.min(Math.max(parseInt(raw, 10), fromYear), toYear)).padStart(
            4,
            "0",
          )
        : raw;
    const segs: Segments = { mm, dd, yyyy: value };
    setEditing(segs);
    tryCommit(segs);
  }

  function handleDdKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    blockNonNumeric(e);
    if (e.key === "Backspace" && !dd) mmRef.current?.focus();
  }

  function handleYyyyKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    blockNonNumeric(e);
    if (e.key === "Backspace" && !yyyy) ddRef.current?.focus();
  }

  function handleCalendarSelect(date: Date | undefined) {
    rhfField.onChange(date ? format(date, "yyyy-MM-dd") : "");
    setEditing(null);
    setOpen(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) setEditing(null);
    setOpen(nextOpen);
  }

  return (
    <FormItem className="flex flex-col gap-1">
      <FieldLabel field={field} required={required} />
      <FieldDescription description={field.description} />
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <FormControl>
            <button
              type="button"
              disabled={field.disabled}
              aria-invalid={invalid}
              className={cn(
                BASE_INPUT,
                "flex items-center justify-between",
                !isoValue && "text-muted-foreground/50",
                field.readOnly && READONLY,
              )}
            >
              <span>{parsed ? format(parsed, "MMM d, yyyy") : placeholder}</span>
              <CalendarIcon className="size-3.5 shrink-0 text-muted-foreground/50" />
            </button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent
          className="m-0 w-full rounded-xl border border-foreground/12 bg-background p-0 shadow-xl"
          align="start"
          sideOffset={6}
        >
          <div className="flex items-center justify-center border-b border-foreground/8 px-3 py-3">
            <div className="flex items-center gap-0.5 rounded-md border border-foreground/12 bg-foreground/4 px-2 py-1.5">
              <Input
                ref={mmRef}
                value={mm}
                onChange={handleMmChange}
                onKeyDown={blockNonNumeric}
                onFocus={(e) => {
                  e.target.select();
                }}
                placeholder="MM"
                inputMode="numeric"
                autoComplete="off"
                aria-label="Month"
                className={cn(SEGMENT_CLS, "w-8")}
              />
              <span className="text-xs text-muted-foreground/40 select-none">/</span>
              <Input
                ref={ddRef}
                value={dd}
                onChange={handleDdChange}
                onKeyDown={handleDdKeyDown}
                onFocus={(e) => {
                  e.target.select();
                }}
                placeholder="DD"
                inputMode="numeric"
                autoComplete="off"
                aria-label="Day"
                className={cn(SEGMENT_CLS, "w-8")}
              />
              <span className="text-xs text-muted-foreground/40 select-none">/</span>
              <Input
                ref={yyyyRef}
                value={yyyy}
                onChange={handleYyyyChange}
                onKeyDown={handleYyyyKeyDown}
                onFocus={(e) => {
                  e.target.select();
                }}
                placeholder="YYYY"
                inputMode="numeric"
                autoComplete="off"
                aria-label="Year"
                className={cn(SEGMENT_CLS, "w-14")}
              />
            </div>
          </div>
          <Calendar
            mode="single"
            selected={parsed}
            onSelect={handleCalendarSelect}
            startMonth={new Date(fromYear, 0)}
            endMonth={new Date(toYear, 11)}
            className="rounded-b-xl p-4"
            classNames={{
              today: "rounded-md bg-foreground/15 text-foreground font-semibold",
              day: "rounded-md hover:bg-foreground/8 text-foreground font-semibold",
              outside: "text-muted-foreground/40 aria-selected:text-muted-foreground",
              weekday:
                "text-muted-foreground/60 flex-1 select-none rounded-md text-sm font-medium",
            }}
            captionLayout="dropdown"
            components={{ Dropdown: CalendarDropdown }}
          />
        </PopoverContent>
      </Popover>
      <FieldMessage />
    </FormItem>
  );
}
