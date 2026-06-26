"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { type Member, setMemberRole } from "@/admin/actions/roles";
import {
  AccessCell,
  DateTimeCell,
  MemberActionsCell,
  ObfuscatedCell,
  RoleCell,
  UserCell,
} from "@/admin/data-table/cells";
import { DataTable } from "@/admin/data-table/DataTable";
import { DataTableToolbar } from "@/admin/data-table/toolbar";
import { useAdminTable } from "@/admin/hooks/use-data-table";
import { sortData } from "@/admin/lib/table-sort";

import type { InviteRole } from "@/admin/lib/permissions";

export function MembersTable({
  members,
  currentUserId,
}: {
  members: Member[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function changeRole(userId: string, role: InviteRole) {
    startTransition(async () => {
      try {
        await setMemberRole(userId, role);
        toast.success("Role updated.");
        router.refresh();
      } catch {
        toast.error("Could not update role.");
      }
    });
  }

  const columns: ColumnDef<Member>[] = [
    {
      accessorKey: "id",
      header: "ID",
      enableSorting: false,
      cell: ({ getValue }) => <ObfuscatedCell value={getValue() as string} />,
    },
    {
      id: "member",
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <UserCell
          name={row.original.name}
          image={row.original.image}
          href={`/admin/accounts?userId=${row.original.id}`}
          suffix={
            row.original.id === currentUserId ? (
              <span className="ml-2 text-xs text-muted-foreground">(you)</span>
            ) : undefined
          }
        />
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ getValue }) => (
        <ObfuscatedCell value={getValue() as string} variant="email" />
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <RoleCell
          member={row.original}
          pending={pending}
          onChangeRoleAction={changeRole}
        />
      ),
    },
    {
      id: "access",
      accessorKey: "sessionCount",
      header: "Access",
      maxSize: 50,
      enableSorting: false,
      cell: ({ row }) => <AccessCell member={row.original} />,
    },
    {
      accessorKey: "createdAt",
      header: "Joined At",
      maxSize: 32,
      cell: ({ getValue }) => <DateTimeCell value={getValue()} />,
    },
    {
      accessorKey: "updatedAt",
      header: "Last Updated At",
      maxSize: 32,
      cell: ({ getValue }) => <DateTimeCell value={getValue()} />,
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <MemberActionsCell member={row.original} pending={pending} />
      ),
    },
  ];

  const {
    table,
    search,
    setSearch,
    current,
    setCurrent,
    pageSize,
    resetPreferences,
    setColumnOrder,
  } = useAdminTable<Member>({
    tableId: "members",
    columns,
    defaultVisibility: { id: false },
  });

  const filtered = search
    ? members.filter((m) => {
        const q = search.toLowerCase();
        return (
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.role.toLowerCase().includes(q)
        );
      })
    : members;

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
        emptyMessage="No members found."
      />
    </div>
  );
}
