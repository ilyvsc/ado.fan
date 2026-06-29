"use client";

import { KeyRound, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { setMemberRole } from "@/admin/actions/roles";
import {
  AccessCell,
  DateTimeCell,
  MemberActionsCell,
  ObfuscatedCell,
  RoleCell,
  UserCell,
} from "@/admin/data-table/cells";
import { DataTableClient } from "@/admin/data-table/DataTableClient";
import {
  matchesSearch,
  matchesSelect,
  matchesSelectIn,
  userSelectFilter,
} from "@/admin/lib/filters";
import { ROLES } from "@/admin/lib/permissions";

import type { Member } from "@/admin/actions/roles";
import type { InviteRole } from "@/admin/lib/permissions";
import type { ClientTableConfig } from "@/admin/types/data-table";
import type { ColumnDef } from "@tanstack/react-table";

interface MemberColumnsDeps {
  currentUserId: string;
  pending: boolean;
  changeRole: (userId: string, role: InviteRole) => void;
}

export function memberColumns({
  currentUserId,
  pending,
  changeRole,
}: MemberColumnsDeps): ColumnDef<Member>[] {
  return [
    {
      accessorKey: "id",
      header: "ID",
      enableSorting: false,
      cell: ({ getValue }) => <ObfuscatedCell value={getValue() as string} />,
    },
    {
      id: "name",
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
}

// Columns are dynamic (see memberColumns) so they're supplied at render time.
export const membersTableConfig: Omit<ClientTableConfig<Member>, "columns"> = {
  tableId: "members",
  defaultVisibility: { id: false },
  emptyMessage: "No members found.",
  buildFilters: (rows) => [
    userSelectFilter(rows.map((m) => ({ id: m.id, name: m.name, image: m.image }))),
    {
      id: "role",
      label: "Role",
      field: "role",
      type: "select",
      icon: ShieldCheck,
      options: ROLES.map((r) => ({
        label: r.charAt(0).toUpperCase() + r.slice(1),
        value: r,
      })),
    },
    {
      id: "access",
      label: "Access",
      field: "access",
      type: "select",
      icon: KeyRound,
      options: [
        { label: "Read", value: "read" },
        { label: "Write", value: "write" },
      ],
    },
  ],
  filter: (m, { search, activeFilters }) =>
    matchesSearch(search, m.name, m.email, m.role) &&
    matchesSelect(activeFilters.user, m.id) &&
    matchesSelect(activeFilters.role, m.role) &&
    matchesSelectIn(activeFilters.access, Object.values(m.levels)),
};

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

  const columns = memberColumns({ currentUserId, pending, changeRole });

  return (
    <DataTableClient config={{ ...membersTableConfig, columns }} data={members} />
  );
}
