import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { listAllSessions } from "@/admin/actions/auth-data";
import { getSessionIdentity } from "@/admin/auth/guard";
import { TableSkeleton } from "@/admin/components/ui/TableSkeleton";
import { Role } from "@/admin/lib/permissions";
import { SessionsTable } from "@/admin/tables/sessions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function SessionsSection({ userId }: { userId?: string }) {
  const sessions = await listAllSessions(userId);
  return <SessionsTable sessions={sessions} />;
}

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string }>;
}) {
  const user = await getSessionIdentity();
  if (user?.role !== Role.superadmin) redirect("/admin");

  const { userId } = await searchParams;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Sessions
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {userId ? "Filtered by user. " : ""}Active and expired user sessions.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="text-base">All Sessions</CardTitle>
          {userId && (
            <Link
              href="/admin/sessions"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear filter
            </Link>
          )}
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TableSkeleton />}>
            <SessionsSection userId={userId} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
