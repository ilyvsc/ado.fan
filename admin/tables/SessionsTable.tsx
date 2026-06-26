"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { bulkDeleteSessions } from "@/admin/actions/auth-data";
import { DateTimeCell, UserCell, ObfuscatedCell } from "@/admin/data-table/cells";
import { DataTable } from "@/admin/data-table/DataTable";
import { DataTableToolbar } from "@/admin/data-table/toolbar";

import { useAdminTable } from "@/admin/hooks/use-data-table";
import { sortData } from "@/admin/lib/table-sort";
import { undoToast } from "@/admin/lib/toast";

import type { AdminSession } from "@/admin/types/admin";

const columns: ColumnDef<AdminSession>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableSorting: false,
    cell: ({ getValue }) => <ObfuscatedCell value={getValue() as string} />,
  },
  {
    id: "user",
    accessorKey: "userName",
    header: "User",
    maxSize: 230,
    enableSorting: false,
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

  const {
    table,
    search,
    setSearch,
    current,
    setCurrent,
    pageSize,
    resetPreferences,
    setColumnOrder,
  } = useAdminTable<AdminSession>({
    tableId: "sessions",
    columns,
    defaultVisibility: { id: false },
  });

  const filtered = search
    ? sessions.filter((s) => {
        const q = search.toLowerCase();
        return (
          s.userName.toLowerCase().includes(q) ||
          s.userEmail.toLowerCase().includes(q) ||
          (s.ipAddress ?? "").toLowerCase().includes(q) ||
          (s.userAgent ?? "").toLowerCase().includes(q)
        );
      })
    : sessions;

  const sorted = sortData(filtered, table.getState().sorting);
  const pageCount = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice((current - 1) * pageSize, current * pageSize);

  table.setOptions((prev) => ({ ...prev, data: paged }));

  return (
    <div className="flex flex-col gap-4">
      <DataTableToolbar
        table={table}
        search={search}
        onSearchChange={setSearch}
        filters={[]}
        activeFilters={{}}
        onFilterChange={() => undefined}
        onFiltersClear={() => undefined}
        onResetPreferences={resetPreferences}
        onReorderColumns={setColumnOrder}
      />
      <DataTable
        table={table}
        current={current}
        pageCount={pageCount}
        total={filtered.length}
        onPageChange={setCurrent}
        emptyMessage="No sessions found."
        bulkActions={[
          {
            label: "Delete",
            icon: Trash2,
            variant: "destructive",
            onClick: bulkDelete,
          },
        ]}
      />
    </div>
  );
}
