"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { bulkDeleteAccounts } from "@/admin/actions/auth-data";
import {
  DateTimeCell,
  NullableCell,
  UserCell,
  ObfuscatedCell,
  ProviderBadgeCell,
} from "@/admin/data-table/cells";

import { DataTable } from "@/admin/data-table/DataTable";
import { DataTableToolbar } from "@/admin/data-table/toolbar";

import { useAdminTable } from "@/admin/hooks/use-data-table";
import { sortData } from "@/admin/lib/table-sort";
import { undoToast } from "@/admin/lib/toast";

import type { AdminAccount } from "@/admin/types/admin";

const columns: ColumnDef<AdminAccount>[] = [
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
        href={`/admin/sessions?userId=${row.original.userId}`}
      />
    ),
  },
  {
    accessorKey: "accountId",
    header: "Account ID",
    maxSize: 36,
    enableSorting: false,
    cell: ({ getValue }) => <ObfuscatedCell value={getValue() as string} />,
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
    maxSize: 36,
    accessorKey: "providerId",
    header: "Provider",
    cell: ({ getValue }) => <ProviderBadgeCell value={getValue() as string} />,
  },
  {
    accessorKey: "scope",
    header: "Scope",
    enableSorting: false,
    cell: ({ getValue }) => <NullableCell value={getValue()} />,
  },
  {
    accessorKey: "accessTokenExpiresAt",
    header: "Access Expires At",
    cell: ({ getValue }) => <DateTimeCell value={getValue()} />,
  },
  {
    accessorKey: "refreshTokenExpiresAt",
    header: "Refresh Expires At",
    cell: ({ getValue }) => <DateTimeCell value={getValue()} />,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ getValue }) => <DateTimeCell value={getValue()} />,
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ getValue }) => <DateTimeCell value={getValue()} />,
  },
];

export function AccountsTable({
  accounts,
}: {
  accounts: AdminAccount[];
  userId?: string;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function bulkDelete(rows: AdminAccount[], reset: () => void) {
    reset();
    undoToast({
      title: `Delete ${rows.length} account${rows.length === 1 ? "" : "s"}`,
      pendingLabel: "Deleting",
      onCommit: () => {
        startTransition(async () => {
          try {
            await bulkDeleteAccounts(rows.map((r) => r.id));
            toast.success(
              `${rows.length} account${rows.length === 1 ? "" : "s"} deleted.`,
            );
            router.refresh();
          } catch {
            toast.error("Could not delete accounts.");
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
  } = useAdminTable<AdminAccount>({
    tableId: "accounts",
    columns,
    defaultVisibility: { id: false, scope: false },
  });

  const filtered = search
    ? accounts.filter((a) => {
        const q = search.toLowerCase();
        return (
          a.userName.toLowerCase().includes(q) ||
          a.userEmail.toLowerCase().includes(q) ||
          a.providerId.toLowerCase().includes(q) ||
          a.accountId.toLowerCase().includes(q)
        );
      })
    : accounts;

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
        emptyMessage="No accounts found."
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
