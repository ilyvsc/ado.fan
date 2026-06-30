"use client";

import { SiGithub } from "@icons-pack/react-simple-icons";

import { stashInviteToken } from "@/admin/actions/invites";
import { authClient } from "@/admin/auth/client";
import { Button } from "@/components/ui/button";

async function accept(token: string) {
  await stashInviteToken(token);
  await authClient.signIn.social({ provider: "github", callbackURL: "/admin" });
}

export function InviteConfirmation({ token }: { token: string }) {
  return (
    <Button
      className="w-full gap-2"
      onClick={() => {
        void accept(token);
      }}
    >
      <SiGithub className="size-4" />
      Continue with GitHub
    </Button>
  );
}
