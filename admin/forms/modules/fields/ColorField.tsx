"use client";

import {
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
  type Ref,
} from "react";
import { HexColorPicker } from "react-colorful";

import { FormControl, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function isValidHex(value: string) {
  return /^#([0-9A-F]{6})$/i.test(value);
}

function ColorPicker({
  open,
  onOpenChange,
  children,
  ...props
}: ComponentProps<typeof Popover>) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;

  return (
    <Popover
      open={isControlled ? open : internalOpen}
      onOpenChange={isControlled ? onOpenChange : setInternalOpen}
      {...props}
    >
      {children}
    </Popover>
  );
}
ColorPicker.displayName = "ColorPicker";

function ColorPickerTrigger({
  value,
  className,
  children,
  ref,
  ...props
}: Omit<ComponentProps<"button">, "value"> & {
  value: string;
  children?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
}) {
  const parsedValue = useMemo(() => (isValidHex(value) ? value : "#FFFFFF"), [value]);

  return (
    <PopoverTrigger asChild>
      <button
        ref={ref}
        type="button"
        data-slot="color-picker-trigger"
        className={cn(
          "inline-flex items-center justify-center rounded-lg border border-foreground/12 outline-none",
          "transition-all duration-150",
          "hover:border-foreground/20",
          "focus-visible:ring-ring/50 focus-visible:ring-2",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        style={{ backgroundColor: parsedValue }}
        {...props}
      >
        {children}
      </button>
    </PopoverTrigger>
  );
}
ColorPickerTrigger.displayName = "ColorPickerTrigger";

function ColorPickerContent({
  value,
  onChange,
  onInputChange,
  inputClassName,
  className,
  ref,
  ...props
}: Omit<ComponentProps<typeof PopoverContent>, "onChange"> & {
  value: string;
  onChange: (value: string) => void;
  onInputChange?: (value: string) => void;
  inputClassName?: string;
  ref?: Ref<HTMLDivElement>;
}) {
  const parsedValue = useMemo(() => (isValidHex(value) ? value : "#FFFFFF"), [value]);

  const displayValue = value || "#FFFFFF";

  return (
    <PopoverContent
      ref={ref}
      data-slot="color-picker-content"
      className={cn(
        "flex w-auto flex-col gap-3 rounded-xl border border-foreground/10 bg-background p-3 shadow-xl",
        className,
      )}
      {...props}
    >
      <HexColorPicker
        color={parsedValue}
        onChange={(newColor) => {
          onChange(newColor.toUpperCase());
        }}
      />
      <div className="flex items-center gap-2">
        <span
          className="size-7 shrink-0 rounded-md border border-foreground/10"
          style={{ backgroundColor: parsedValue }}
        />
        <Input
          maxLength={7}
          value={displayValue}
          className={cn(
            "h-8 w-36 flex-1 rounded-md border border-foreground/12 bg-foreground/3 px-2.5 font-mono text-xs uppercase",
            "placeholder:text-muted-foreground/50",
            "focus-visible:ring-ring/30 focus-visible:border-foreground/25 focus-visible:ring-1 focus-visible:outline-none",
            inputClassName,
          )}
          onChange={(e) => {
            const raw = e.currentTarget.value;
            if (onInputChange) onInputChange(raw);
            else onChange(raw.toUpperCase());
          }}
        />
      </div>
    </PopoverContent>
  );
}
ColorPickerContent.displayName = "ColorPickerContent";

export { ColorPicker, ColorPickerTrigger, ColorPickerContent };

import { BASE_INPUT } from "./field-utils";
import {
  FieldDescription,
  FieldLabel,
  FieldMessage,
  type FieldProps,
} from "./FieldShared";

export function ColorField({
  field,
  rhfField,
  invalid,
  required,
  placeholder,
}: FieldProps) {
  const value = rhfField.value ?? "";
  return (
    <FormItem>
      <FieldLabel field={field} required={required} />
      <FieldDescription description={field.description} />
      <FormControl>
        <ColorPicker>
          <div className="flex items-center gap-2">
            <ColorPickerTrigger
              value={value}
              className="size-9 shrink-0"
              aria-invalid={invalid}
            />
            <input
              {...rhfField}
              value={value}
              placeholder={placeholder}
              aria-invalid={invalid}
              className={BASE_INPUT}
            />
          </div>
          <ColorPickerContent
            value={value}
            onChange={(c) => {
              rhfField.onChange(c);
            }}
          />
        </ColorPicker>
      </FormControl>
      <FieldMessage />
    </FormItem>
  );
}
