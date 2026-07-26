import { InviteConfirmation } from "@/admin/components/InviteConfirmation";
import { prisma } from "@/prisma/client";

export default async function JoinPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invite = await prisma.invite.findUnique({ where: { token } });
  const valid =
    invite && !invite.usedAt && !invite.revokedAt && invite.expiresAt > new Date();

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 text-center">
        {valid ? (
          <>
            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-semibold text-foreground">
                You&apos;ve been invited
              </h1>
              <p className="text-sm text-muted-foreground">
                Join ado.fan admin as {invite.role}. Continue with GitHub.
              </p>
            </div>
            <InviteConfirmation token={token} />
          </>
        ) : (
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-semibold text-foreground">
              Invite unavailable
            </h1>
            <p className="text-sm text-muted-foreground">
              This invite is invalid, already used, or expired.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
