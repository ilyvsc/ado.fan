import { Shield, ShieldCheck, User } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { listMembers } from "@/admin/actions/roles";
import { getSessionIdentity } from "@/admin/auth/guard";
import { EmergencySignOut } from "@/admin/components/ui/EmergencySignOut";
import { TableSkeleton } from "@/admin/components/ui/TableSkeleton";
import { RESOURCES, Role, ROLES, roleBaseline } from "@/admin/lib/permissions";
import { LEVEL_META, SECTION_META } from "@/admin/lib/sections";
import { MembersTable } from "@/admin/tables/members";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { Role as RoleType } from "@/admin/lib/permissions";
import type { LucideIcon } from "lucide-react";

const ROLE_ICON: Record<RoleType, LucideIcon> = {
  superadmin: ShieldCheck,
  admin: Shield,
  contributor: User,
};

async function MembersSection({ currentUserId }: { currentUserId: string }) {
  const members = await listMembers();
  return <MembersTable members={members} currentUserId={currentUserId} />;
}

export default async function RolesPage() {
  const user = await getSessionIdentity();
  if (user?.role !== Role.superadmin) redirect("/admin");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Roles &amp; Permissions
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Default access per role and who holds it.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="overflow-hidden rounded-lg border border-foreground/8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-foreground/8 bg-foreground/2">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Role
                </th>
                {RESOURCES.map((resource) => {
                  const Icon = SECTION_META[resource].icon;
                  return (
                    <th
                      key={resource}
                      className="px-4 py-3 text-left text-xs font-medium"
                    >
                      <span className="flex items-center gap-1.5 text-foreground">
                        <Icon className="size-3.5 text-muted-foreground" />
                        {SECTION_META[resource].label}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {ROLES.map((role) => {
                const Icon = ROLE_ICON[role];
                return (
                  <tr
                    key={role}
                    className="border-b border-foreground/5 last:border-0"
                  >
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 text-xs text-foreground capitalize">
                        <Icon className="size-3.5 shrink-0 text-muted-foreground" />
                        {role}
                      </span>
                    </td>
                    {RESOURCES.map((resource) => {
                      const level = roleBaseline(role, resource);
                      const LevelIcon = LEVEL_META[level].icon;
                      return (
                        <td key={resource} className="px-4 py-3">
                          <span
                            className={cn(
                              "flex items-center gap-1.5 text-xs",
                              LEVEL_META[level].tone,
                            )}
                          >
                            <LevelIcon className="size-3.5" />
                            {LEVEL_META[level].label}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="text-base">Members</CardTitle>
          <EmergencySignOut />
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TableSkeleton />}>
            <MembersSection currentUserId={user.id} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
