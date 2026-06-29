"use client";

import {
  Activity,
  Ban,
  CircleCheck,
  CircleSlash,
  Clock,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { bulkRevokeInvites } from "@/admin/actions/invites";

import {
  BadgeCell,
  DateTimeCell,
  NullableCell,
  TextCell,
  UserCell,
  CopyLinkCell,
  RevokeInviteCell,
  ObfuscatedCell,
} from "@/admin/data-table/cells";
import { DataTableClient } from "@/admin/data-table/DataTableClient";
import { matchesSearch, matchesSelect, userSelectFilter } from "@/admin/lib/filters";
import { ROLES } from "@/admin/lib/permissions";
import { undoToast } from "@/admin/lib/toast";
import { cn } from "@/lib/utils";

import type { InviteRecord, InviteStatus } from "@/admin/actions/invites";
import type { Resource, Level } from "@/admin/lib/permissions";
import type { ClientTableConfig } from "@/admin/types/data-table";
import type { ColumnDef } from "@tanstack/react-table";

const INVITE_STATUSES: InviteStatus[] = ["active", "used", "revoked", "expired"];

const STATUS_CONFIG: Record<InviteStatus, { className: string; icon: LucideIcon }> = {
  active: { className: "text-green-600", icon: CircleCheck },
  used: { className: "text-muted-foreground", icon: CircleSlash },
  revoked: { className: "text-red-600", icon: Ban },
  expired: { className: "text-amber-600", icon: Clock },
};

function permsSummary(perms: Partial<Record<Resource, Level>> | null): string {
  if (!perms) return "-";
  const entries = Object.entries(perms).filter(([, v]) => v !== "none");
  return entries.length ? entries.map(([k, v]) => `${k}: ${v}`).join(", ") : "-";
}

const columns: ColumnDef<InviteRecord>[] = [
  {
    id: "id",
    header: "ID",
    enableSorting: false,
    cell: ({ row }) => <ObfuscatedCell value={row.original.id} />,
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    maxSize: 30,
    cell: ({ row }) => {
      const status = row.original.status;
      const { icon: Icon, className } = STATUS_CONFIG[status];
      return (
        <span className={cn("flex items-center gap-1 text-xs capitalize", className)}>
          <Icon className="size-3.5 shrink-0" />
          {status}
        </span>
      );
    },
  },
  {
    id: "role",
    accessorKey: "role",
    header: "Role",
    maxSize: 30,
    cell: ({ getValue }) => <BadgeCell value={getValue()} className="capitalize" />,
  },
  {
    id: "link",
    header: "Link",
    enableSorting: false,
    cell: ({ row }) => (
      <CopyLinkCell
        token={row.original.token}
        active={row.original.status === "active"}
      />
    ),
  },
  {
    id: "permissions",
    header: "Permissions",
    enableSorting: false,
    cell: ({ row }) => (
      <TextCell value={permsSummary(row.original.permissions)} className="truncate" />
    ),
  },
  {
    id: "createdByName",
    accessorKey: "createdByName",
    header: "Created by",
    cell: ({ row }) => (
      <UserCell
        name={row.original.createdByName}
        image={row.original.createdByImage}
        href={`/admin/accounts?userId=${row.original.createdById}`}
      />
    ),
  },
  {
    id: "usedByName",
    accessorKey: "usedByName",
    header: "For",
    cell: ({ row }) =>
      row.original.usedByName && row.original.usedById ? (
        <UserCell
          name={row.original.usedByName}
          image={row.original.usedByImage}
          href={`/admin/accounts?userId=${row.original.usedById}`}
        />
      ) : (
        <NullableCell value={null} />
      ),
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created At",
    maxSize: 32,
    cell: ({ getValue }) => <DateTimeCell value={getValue()} />,
  },
  {
    id: "expiresAt",
    accessorKey: "expiresAt",
    header: "Expires At",
    maxSize: 32,
    cell: ({ getValue }) => <DateTimeCell value={getValue()} />,
  },
  {
    id: "usedAt",
    accessorKey: "usedAt",
    header: "Used at",
    maxSize: 32,
    cell: ({ getValue }) => <DateTimeCell value={getValue()} />,
  },
  {
    id: "actions",
    header: "Actions",
    maxSize: 30,
    enableSorting: false,
    cell: ({ row }) => <RevokeInviteCell invite={row.original} />,
  },
];

export const invitesTableConfig: ClientTableConfig<InviteRecord> = {
  tableId: "invites",
  columns,
  defaultVisibility: { id: false, permissions: false },
  emptyMessage: "No invites yet.",
  buildFilters: (rows) => [
    {
      id: "status",
      label: "Status",
      field: "status",
      type: "select",
      icon: Activity,
      options: INVITE_STATUSES.map((s) => ({
        label: s.charAt(0).toUpperCase() + s.slice(1),
        value: s,
      })),
    },
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
    userSelectFilter(
      rows.map((i) => ({
        id: i.createdById,
        name: i.createdByName,
        image: i.createdByImage,
      })),
      { id: "createdBy", label: "Created by" },
    ),
    userSelectFilter(
      rows.flatMap((i) =>
        i.usedById && i.usedByName
          ? [{ id: i.usedById, name: i.usedByName, image: i.usedByImage }]
          : [],
      ),
      { id: "usedBy", label: "For" },
    ),
  ],
  filter: (i, { search, activeFilters }) =>
    matchesSearch(search, i.createdByName, i.usedByName, i.email, i.status, i.role) &&
    matchesSelect(activeFilters.status, i.status) &&
    matchesSelect(activeFilters.role, i.role) &&
    matchesSelect(activeFilters.createdBy, i.createdById) &&
    matchesSelect(activeFilters.usedBy, i.usedById ?? ""),
};

export function InvitesTable({ invites }: { invites: InviteRecord[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function bulkRevoke(rows: InviteRecord[], reset: () => void) {
    const active = rows.filter((r) => r.status === "active");
    if (!active.length) {
      toast.error("No active invites selected.");
      return;
    }
    reset();
    undoToast({
      title: `Revoke ${active.length} invite${active.length === 1 ? "" : "s"}`,
      pendingLabel: "Revoking",
      onCommit: () => {
        startTransition(async () => {
          try {
            await bulkRevokeInvites(active.map((r) => r.id));
            toast.success(
              `${active.length} invite${active.length === 1 ? "" : "s"} revoked.`,
            );
            router.refresh();
          } catch {
            toast.error("Could not revoke invites.");
          }
        });
      },
    });
  }

  return (
    <DataTableClient
      config={invitesTableConfig}
      data={invites}
      bulkActions={[
        { label: "Revoke", icon: Ban, variant: "destructive", onClick: bulkRevoke },
      ]}
    />
  );
}
