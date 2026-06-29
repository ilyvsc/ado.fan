import type { ActiveFilters, FilterDef } from "./filters";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type { FilterDef, ActiveFilterValue, ActiveFilters } from "./filters";

interface RowFilterContext {
  search: string;
  activeFilters: ActiveFilters;
}

export interface ClientTableConfig<T extends { id: string }> {
  tableId: string;
  columns: ColumnDef<T>[];
  buildFilters?: (rows: T[]) => FilterDef[];
  filter?: (row: T, ctx: RowFilterContext) => boolean;
  defaultVisibility?: VisibilityState;
  emptyMessage?: string;
}

export interface BulkAction<TData> {
  label: string;
  icon: LucideIcon;
  onClick: (rows: TData[], reset: () => void) => void;
  variant?: "destructive";
}

export interface ContextMenuAction<TData> {
  label: string;
  icon?: ReactNode;
  onClick: (row: TData) => void;
  destructive?: boolean;
  separator?: "before";
}

export interface ContextMenuConfig<TData extends { id: string }> {
  resource: string;
  basePath: string;
  getRowLabel?: (row: TData) => string;
  extraActions?: ContextMenuAction<TData>[];
  deleteWarning?: string;
  onDuplicate?: (id: string) => Promise<{ id: string }>;
}

export interface TableConfig<TData> {
  resource: string;
  tableId?: string;
  columns: ColumnDef<TData>[];
  filters?: FilterDef[];
  defaultVisibility?: VisibilityState;
  pageSize?: number;
  getRowLabel?: (row: TData) => string;
  deleteWarning?: string;
  duplicate?: (id: string) => Promise<{ id: string }>;
}
