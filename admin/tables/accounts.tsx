"use client";

import { Plug, Trash2 } from "lucide-react";
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
import { DataTableClient } from "@/admin/data-table/DataTableClient";
import { matchesSearch, matchesSelect, userSelectFilter } from "@/admin/lib/filters";
import { undoToast } from "@/admin/lib/toast";

import type { AdminAccount } from "@/admin/types/admin";
import type { ClientTableConfig } from "@/admin/types/data-table";
import type { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<AdminAccount>[] = [
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

export const accountsTableConfig: ClientTableConfig<AdminAccount> = {
  tableId: "accounts",
  columns,
  defaultVisibility: { id: false, scope: false },
  emptyMessage: "No accounts found.",
  buildFilters: (rows) => [
    userSelectFilter(
      rows.map((a) => ({ id: a.userId, name: a.userName, image: a.userImage })),
    ),
    {
      id: "provider",
      label: "Provider",
      field: "providerId",
      type: "select",
      icon: Plug,
      options: [...new Set(rows.map((a) => a.providerId))].map((p) => ({
        label: p.charAt(0).toUpperCase() + p.slice(1),
        value: p,
      })),
    },
  ],
  filter: (a, { search, activeFilters }) =>
    matchesSearch(search, a.userName, a.userEmail, a.providerId, a.accountId) &&
    matchesSelect(activeFilters.user, a.userId) &&
    matchesSelect(activeFilters.provider, a.providerId),
};

export function AccountsTable({ accounts }: { accounts: AdminAccount[] }) {
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

  return (
    <DataTableClient
      config={accountsTableConfig}
      data={accounts}
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
