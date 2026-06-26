import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { listAllAccounts } from "@/admin/actions/auth-data";
import { getSessionIdentity } from "@/admin/auth/guard";
import { TableSkeleton } from "@/admin/components/ui/TableSkeleton";
import { Role } from "@/admin/lib/permissions";
import { AccountsTable } from "@/admin/tables/AccountsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function AccountsSection({ userId }: { userId?: string }) {
  const accounts = await listAllAccounts(userId);
  return <AccountsTable accounts={accounts} userId={userId} />;
}

export default async function AccountsPage({
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
          OAuth Accounts
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {userId ? "Filtered by user. " : ""}Linked provider accounts per user.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="text-base">All Accounts</CardTitle>
          {userId && (
            <Link
              href="/admin/accounts"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear filter
            </Link>
          )}
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TableSkeleton />}>
            <AccountsSection userId={userId} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
