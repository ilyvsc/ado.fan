"use client";

import { type ColumnDef } from "@tanstack/react-table";
import {
  Album,
  ChevronRight,
  CircleCheck,
  Clock,
  Music,
  Tag,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";

import type { ChangeRow } from "@/admin/lib/group-changes";
import type { ClientTableConfig } from "@/admin/types/data-table";

import { BadgeCell, CoverCell, DateTimeCell, UserCell } from "@/admin/data-table/cells";
import { matchesSearch, matchesSelect, userSelectFilter } from "@/admin/lib/filters";
import { cn } from "@/lib/utils";

import { CommitCell } from "../data-table/cells/CommitCell";

function editHref(change: ChangeRow): string {
  const base = change.entity === "song" ? "/admin/songs" : "/admin/albums";
  return `${base}/${change.entityId}/edit`;
}

const columns: ColumnDef<ChangeRow>[] = [
  {
    id: "entity",
    accessorKey: "entity",
    header: "Entity",
    enableSorting: false,
    cell: ({ row }) => {
      const change = row.original;
      const EntityIcon = change.entity === "song" ? Music : Album;
      const editCount = (change.children?.length ?? 0) + 1;
      return (
        <div className="flex min-w-0 items-center gap-2">
          <Link href={editHref(change)} className="group flex min-w-0 items-center gap-2">
            <CoverCell url={change.entityInfo.coverArt ?? ""} />
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-foreground group-hover:underline">
                {change.entityInfo.title ?? change.entityId}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground/60 capitalize">
                <EntityIcon className="size-3 shrink-0" />
                {change.entity}
              </span>
            </span>
          </Link>
          {editCount > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                row.toggleExpanded();
              }}
              className="flex shrink-0 items-center gap-0.5 rounded-full bg-foreground/6 px-1.5 py-0.5 text-[11px] font-normal text-muted-foreground/70 tabular-nums transition-colors hover:bg-foreground/10 hover:text-foreground"
            >
              {editCount} edits
              <ChevronRight
                className={cn(
                  "size-3 transition-transform",
                  row.getIsExpanded() && "rotate-90",
                )}
              />
            </button>
          )}
        </div>
      );
    },
  },
  {
    id: "user",
    accessorKey: "user",
    header: "User",
    enableSorting: false,
    cell: ({ row }) => (
      <UserCell
        name={row.original.user.name}
        image={row.original.user.image}
        href={
          row.original.user.id
            ? `/admin/accounts?userId=${row.original.user.id}`
            : undefined
        }
      />
    ),
  },
  {
    id: "status",
    accessorKey: "synced",
    header: "Status",
    maxSize: 26,
    enableSorting: false,
    enableResizing: false,
    cell: ({ row }) =>
      row.original.synced ? (
        row.original.verified === false ? (
          <BadgeCell
            value={
              <span className="flex items-center gap-1.5">
                <TriangleAlert className="size-3 shrink-0" />
                Missing on GitHub
              </span>
            }
            className="border-destructive/30 text-destructive"
          />
        ) : (
          <BadgeCell
            value={
              <span className="flex items-center gap-1.5">
                <CircleCheck className="size-3 shrink-0" />
                Synced
              </span>
            }
            className="text-muted-foreground"
          />
        )
      ) : (
        <BadgeCell
          value={
            <span className="flex items-center gap-1.5">
              <Clock className="size-3 shrink-0" />
              Pending
            </span>
          }
          className="border-ado-primary/30 text-ado-primary"
        />
      ),
  },
  {
    id: "commit",
    accessorKey: "commitSha",
    header: "Commit SHA",
    enableSorting: false,
    cell: ({ row }) => <CommitCell change={row.original} />,
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Edited At",
    maxSize: 36,
    enableResizing: false,
    cell: ({ getValue }) => <DateTimeCell value={getValue()} />,
  },
  {
    id: "syncedAt",
    accessorKey: "syncedAt",
    header: "Synced At",
    maxSize: 36,
    enableResizing: false,
    cell: ({ getValue }) => <DateTimeCell value={getValue()} />,
  },
];

export const changesTableConfig: ClientTableConfig<ChangeRow> = {
  tableId: "changes",
  columns,
  emptyMessage: "No changes found.",
  buildFilters: (rows) => [
    userSelectFilter(
      rows.map((c) => ({
        id: c.user.id,
        name: c.user.name,
        image: c.user.image,
      })),
    ),
    {
      id: "entity",
      label: "Type",
      field: "entity",
      type: "select",
      icon: Tag,
      options: [
        { label: "Song", value: "song" },
        { label: "Album", value: "album" },
      ],
    },
    {
      id: "status",
      label: "Status",
      field: "status",
      type: "select",
      icon: CircleCheck,
      options: [
        { label: "Synced", value: "synced" },
        { label: "Pending", value: "pending" },
      ],
    },
  ],
  filter: (c, { search, activeFilters }) =>
    matchesSearch(search, c.entityId, c.entityInfo.title ?? "", c.user.name) &&
    matchesSelect(activeFilters.user, c.user.id) &&
    matchesSelect(activeFilters.entity, c.entity) &&
    matchesSelect(activeFilters.status, c.synced ? "synced" : "pending"),
};
