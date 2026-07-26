"use client";

import { TriangleAlert } from "lucide-react";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { toast } from "sonner";

import { revokeAllSessions } from "@/admin/actions/roles";

import { confirmToast } from "@/admin/lib/toast";
import { Button } from "@/components/ui/button";

export function EmergencySignOut() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function run() {
    startTransition(async () => {
      try {
        const count = await revokeAllSessions();
        toast.success(
          `Signed out everyone (${count} session${count === 1 ? "" : "s"}).`,
        );
        router.refresh();
      } catch {
        toast.error("Could not sign everyone out.");
      }
    });
  }

  return (
    <Button
      variant="destructive"
      disabled={pending}
      onClick={() => {
        confirmToast("Sign out all other members now?", run);
      }}
      className="gap-2"
    >
      <TriangleAlert className="size-4" />
      Sign out everyone
    </Button>
  );
}
