"use client";

import { ShieldCheck } from "lucide-react";

import { type Member } from "@/admin/actions/roles";
import { PermissionsDialog } from "@/admin/components/MemberPermissionsDialog";
import { MemberSessionsDialog } from "@/admin/components/MemberSessionsDialog";
import {
  INVITE_ROLES,
  OVERRIDABLE,
  PermissionLevel,
  Role,
  type InviteRole,
} from "@/admin/lib/permissions";
import { LEVEL_META, SECTION_META } from "@/admin/lib/sections";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function RoleCell({
  member,
  pending,
  onChangeRoleAction,
}: {
  member: Member;
  pending: boolean;
  onChangeRoleAction: (userId: string, role: InviteRole) => void;
}) {
  if (member.role === Role.superadmin) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-600">
        <ShieldCheck className="size-3" />
        Superadmin
      </span>
    );
  }

  return (
    <Select
      value={member.role}
      disabled={pending}
      onValueChange={(value) => {
        onChangeRoleAction(member.id, value as InviteRole);
      }}
    >
      <SelectTrigger
        className={cn(
          "h-7 w-auto gap-1 rounded-full border px-2.5 text-xs font-medium capitalize shadow-none",
          member.role === Role.admin
            ? "border-blue-500/20 bg-blue-500/10 text-blue-600 hover:bg-blue-500/15"
            : "border-foreground/10 bg-foreground/5 text-muted-foreground hover:bg-foreground/8",
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {INVITE_ROLES.map((role) => (
          <SelectItem key={role} value={role} className="capitalize">
            {role}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function AccessCell({ member }: { member: Member }) {
  if (member.role === Role.superadmin) {
    return <span className="text-xs text-muted-foreground">Full access</span>;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-1">
        {OVERRIDABLE.map((resource) => {
          const Icon = SECTION_META[resource].icon;
          const level = member.levels[resource];
          return (
            <Tooltip key={resource}>
              <TooltipTrigger asChild>
                <span
                  className={cn(
                    "flex items-center justify-center rounded p-1",
                    level === PermissionLevel.write &&
                      "bg-green-500/10 text-green-600",
                    level === PermissionLevel.read &&
                      "bg-yellow-500/10 text-yellow-600",
                    level === PermissionLevel.none &&
                      "bg-foreground/5 text-muted-foreground/30",
                  )}
                >
                  <Icon className="size-3.5" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {SECTION_META[resource].label}: {LEVEL_META[level].label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

export function MemberActionsCell({
  member,
  pending,
}: {
  member: Member;
  pending: boolean;
}) {
  return (
    <div className="flex justify-start gap-1">
      {member.role !== Role.superadmin && (
        <PermissionsDialog
          userId={member.id}
          userName={member.name}
          role={member.role}
        />
      )}
      <MemberSessionsDialog member={member} />
    </div>
  );
}
