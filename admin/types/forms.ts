import * as React from "react";

export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "checkbox"
  | "toggle"
  | "date"
  | "number"
  | "url"
  | "color"
  | "markdown";

export interface FieldConfig {
  name: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  options?: { label: string; value: string }[];
  optional?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  span?: 1 | 2 | 3;
  rows?: number;
  prefix?: string;
  suffix?: string;
  fromYear?: number;
  imagePreview?: boolean;
  inputClassName?: string;
}

export interface FieldGroup {
  title?: string;
  fields: FieldConfig[];
  cols?: number;
  col?: 1 | 2;
  row?: number;
  fullWidth?: boolean;
}

export interface TabConfig {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  groups?: FieldGroup[];
  content?: React.ReactNode;
  columns?: 1 | 2;
}

export interface FormConfig {
  groups?: FieldGroup[];
  tabs?: TabConfig[];
}
