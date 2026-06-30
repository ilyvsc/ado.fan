"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { bulkDeleteSessions } from "@/admin/actions/auth-data";
import { DateTimeCell, UserCell, ObfuscatedCell } from "@/admin/data-table/cells";
import { DataTableClient } from "@/admin/data-table/DataTableClient";
import { matchesSearch, matchesSelect, userSelectFilter } from "@/admin/lib/filters";
import { undoToast } from "@/admin/lib/toast";

import type { AdminSession } from "@/admin/types/admin";
import type { ClientTableConfig } from "@/admin/types/data-table";
import type { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<AdminSession>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableSorting: false,
    cell: ({ getValue }) => <ObfuscatedCell value={getValue() as string} />,
  },
  {
    id: "userName",
    accessorKey: "userName",
    header: "User",
    maxSize: 230,
    cell: ({ row }) => (
      <UserCell
        name={row.original.userName}
        image={row.original.userImage}
        href={`/admin/accounts?userId=${row.original.userId}`}
      />
    ),
  },
  {
    id: "email",
    accessorKey: "userEmail",
    header: "Email",
    cell: ({ getValue }) => (
      <ObfuscatedCell value={getValue() as string} variant="email" />
    ),
  },
  {
    accessorKey: "token",
    header: "Token",
    enableSorting: false,
    cell: ({ getValue }) => (
      <ObfuscatedCell value={getValue() as string} variant="secret" />
    ),
  },
  {
    accessorKey: "ipAddress",
    header: "IP Address",
    cell: ({ getValue }) => (
      <ObfuscatedCell value={getValue() as string | null} variant="ipaddress" />
    ),
  },
  {
    accessorKey: "userAgent",
    header: "User Agent",
    cell: ({ getValue }) => {
      const userAgent = getValue() as string | null;
      return (
        <span
          className="truncate text-xs text-muted-foreground"
          title={userAgent ?? undefined}
        >
          {userAgent ?? "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    maxSize: 32,
    cell: ({ getValue }) => <DateTimeCell value={getValue()} />,
  },
  {
    accessorKey: "expiresAt",
    header: "Expires At",
    maxSize: 32,
    cell: ({ getValue }) => <DateTimeCell value={getValue()} highlightExpired />,
  },
];

export const sessionsTableConfig: ClientTableConfig<AdminSession> = {
  tableId: "sessions",
  columns,
  defaultVisibility: { id: false },
  emptyMessage: "No sessions found.",
  buildFilters: (rows) => [
    userSelectFilter(
      rows.map((s) => ({ id: s.userId, name: s.userName, image: s.userImage })),
    ),
  ],
  filter: (s, { search, activeFilters }) =>
    matchesSearch(search, s.userName, s.userEmail, s.ipAddress, s.userAgent) &&
    matchesSelect(activeFilters.user, s.userId),
};

export function SessionsTable({ sessions }: { sessions: AdminSession[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function bulkDelete(rows: AdminSession[], reset: () => void) {
    reset();
    undoToast({
      title: `Delete ${rows.length} session${rows.length === 1 ? "" : "s"}`,
      pendingLabel: "Deleting",
      onCommit: () => {
        startTransition(async () => {
          try {
            await bulkDeleteSessions(rows.map((r) => r.id));
            toast.success(
              `${rows.length} session${rows.length === 1 ? "" : "s"} deleted.`,
            );
            router.refresh();
          } catch {
            toast.error("Could not delete sessions.");
          }
        });
      },
    });
  }

  return (
    <DataTableClient
      config={sessionsTableConfig}
      data={sessions}
      bulkActions={[
        {
          label: "Delete",
          icon: Trash2,
          variant: "destructive",
          onClick: bulkDelete,
        },
      ]}
    />
  );
}
