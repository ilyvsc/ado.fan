"use client";

import { Ban, Copy } from "lucide-react";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { toast } from "sonner";

import { type InviteRecord, revokeInvite } from "@/admin/actions/invites";
import { undoToast } from "@/admin/lib/toast";
import { Button } from "@/components/ui/button";

export function CopyLinkCell({ token, active }: { token: string; active: boolean }) {
  function copy() {
    void navigator.clipboard
      .writeText(`${window.location.origin}/admin/join/${token}`)
      .then(() => {
        toast.success("Invite link copied.");
      });
  }
  return (
    <button
      type="button"
      onClick={copy}
      disabled={!active}
      className="flex items-center gap-1 truncate font-mono text-xs text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
      title={active ? "Copy invite link" : "Link no longer valid"}
    >
      <span>
        /admin/join/{token.slice(0, 6)}
        {"*".repeat(6)}
      </span>
      <Copy className="size-3 shrink-0" />
    </button>
  );
}

export function RevokeInviteCell({ invite }: { invite: InviteRecord }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function revoke() {
    startTransition(async () => {
      try {
        await revokeInvite(invite.id);
        toast.success("Invite revoked.");
        router.refresh();
      } catch {
        toast.error("Could not revoke invite.");
      }
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending || invite.status !== "active"}
      onClick={() => {
        undoToast({
          title: "Revoke invite",
          pendingLabel: "Revoking",
          onCommit: revoke,
        });
      }}
      className="h-7 gap-1 px-2 text-xs"
    >
      <Ban className="size-3" />
      Revoke
    </Button>
  );
}
