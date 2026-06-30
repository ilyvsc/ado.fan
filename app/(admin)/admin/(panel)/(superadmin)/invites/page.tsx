import { redirect } from "next/navigation";
import { Suspense } from "react";

import { listInvites } from "@/admin/actions/invites";
import { getSessionIdentity } from "@/admin/auth/guard";
import { InvitePermissionsDialog } from "@/admin/components/dialogs/InvitePermissionsDialog";
import { TableSkeleton } from "@/admin/components/ui/TableSkeleton";
import { Role } from "@/admin/lib/permissions";
import { InvitesTable } from "@/admin/tables/invites";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function InvitesSection() {
  const invites = await listInvites();
  return <InvitesTable invites={invites} />;
}

export default async function InvitesPage() {
  const user = await getSessionIdentity();
  if (user?.role !== Role.superadmin) redirect("/admin");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Invite Links
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate one-time links to invite contributors or admins.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Generate invite</CardTitle>
        </CardHeader>
        <CardContent>
          <InvitePermissionsDialog />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All invite links</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TableSkeleton />}>
            <InvitesSection />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
