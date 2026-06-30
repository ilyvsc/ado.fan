import { redirect } from "next/navigation";

import { getSessionIdentity } from "@/admin/auth/guard";
import { GitHubSyncPanel } from "@/admin/components/GitHubSyncPanel";
import { DataTableClient } from "@/admin/data-table/DataTableClient";
import { Role } from "@/admin/lib/permissions";
import { changesTableConfig } from "@/admin/tables/changes";
import { getRecentChanges } from "@/db/queries/admin/changes";

export default async function ChangesPage() {
  const user = await getSessionIdentity();
  if (!user) redirect("/admin/sign-in");

  const changes = await getRecentChanges();

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

      {user.role === Role.superadmin && <GitHubSyncPanel />}

      <DataTableClient config={changesTableConfig} data={changes} />
    </div>
  );
}
