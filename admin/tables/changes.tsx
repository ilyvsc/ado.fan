"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { CircleCheck, Tag } from "lucide-react";
import Link from "next/link";

import { BadgeCell, DateTimeCell, UserCell } from "@/admin/data-table/cells";
import { matchesSearch, matchesSelect, userSelectFilter } from "@/admin/lib/filters";

import type { ClientTableConfig } from "@/admin/types/data-table";
import type { RecentChange } from "@/db/queries/admin/changes";

function editHref(change: RecentChange): string {
  const base = change.entity === "song" ? "/admin/songs" : "/admin/albums";
  return `${base}/${change.entityId}/edit`;
}

const columns: ColumnDef<RecentChange>[] = [
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
    id: "entity",
    accessorKey: "entity",
    header: "Type",
    cell: ({ getValue }) => <BadgeCell value={getValue()} />,
  },
  {
    id: "entityId",
    accessorKey: "entityId",
    header: "Item",
    enableSorting: false,
    cell: ({ row }) => (
      <Link
        href={editHref(row.original)}
        className="text-sm text-foreground hover:underline"
      >
        {row.original.entityId}
      </Link>
    ),
  },
  {
    id: "status",
    accessorKey: "synced",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) =>
      row.original.synced ? (
        <BadgeCell value="Synced" className="text-muted-foreground" />
      ) : (
        <BadgeCell
          value="Pending"
          className="border-ado-primary/30 text-ado-primary"
        />
      ),
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "When",
    cell: ({ getValue }) => <DateTimeCell value={getValue()} />,
  },
  {
    id: "syncedAt",
    accessorKey: "syncedAt",
    header: "Synced At",
    cell: ({ getValue }) => <DateTimeCell value={getValue()} />,
  },
];

export const changesTableConfig: ClientTableConfig<RecentChange> = {
  tableId: "changes",
  columns,
  emptyMessage: "No changes found.",
  buildFilters: (rows) => [
    userSelectFilter(
      rows.map((c) => ({ id: c.user.id, name: c.user.name, image: c.user.image })),
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
    matchesSearch(search, c.entityId, c.user.name) &&
    matchesSelect(activeFilters.user, c.user.id) &&
    matchesSelect(activeFilters.entity, c.entity) &&
    matchesSelect(activeFilters.status, c.synced ? "synced" : "pending"),
};
