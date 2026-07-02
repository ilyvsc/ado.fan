import { redirect } from "next/navigation";

import { getSessionIdentity } from "@/admin/auth/guard";
import { GitHubSyncPanel } from "@/admin/components/GitHubSyncPanel";
import { DataTableClient } from "@/admin/data-table/DataTableClient";
import { groupChanges } from "@/admin/lib/group-changes";
import { Role } from "@/admin/lib/permissions";
import { changesTableConfig } from "@/admin/tables/changes";
import { getLastPr, getVerifiedChanges } from "@/db/sync";

export default async function ChangesPage() {
  const user = await getSessionIdentity();
  if (!user) redirect("/admin/sign-in");

  const isSuperadmin = user.role === Role.superadmin;
  const changes = await getVerifiedChanges();
  const lastPr = isSuperadmin ? await getLastPr() : null;
  const unverifiedCount = changes.filter((c) => c.verified === false).length;
  const grouped = groupChanges(changes);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Recent changes
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edits made through the admin panel and their GitHub sync status.
        </p>
      </div>

      {isSuperadmin && (
        <GitHubSyncPanel unverifiedCount={unverifiedCount} lastPr={lastPr} />
      )}

      <DataTableClient config={changesTableConfig} data={grouped} />
    </div>
  );
}
