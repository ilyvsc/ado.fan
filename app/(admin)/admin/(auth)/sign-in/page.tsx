"use client";

import { SiGithub } from "@icons-pack/react-simple-icons";
import { ShieldCheck } from "lucide-react";

import { authClient } from "@/admin/auth/client";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-xl shadow-black/10">
          <div className="flex flex-col items-center gap-5 px-8 py-10 text-center">
            <div className="border-border bg-muted flex size-12 items-center justify-center rounded-xl border">
              <ShieldCheck className="size-5 text-foreground" />
            </div>

            <div className="flex flex-col gap-1.5">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                ado.fan Administration Panel
              </h1>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Access is restricted to invited contributors.
                <br />
                Sign in with your GitHub account to continue.
              </p>
            </div>

            <Button
              className="w-full gap-2"
              onClick={() => {
                void authClient.signIn.social({
                  provider: "github",
                  callbackURL: "/admin",
                });
              }}
            >
              <SiGithub className="size-4" />
              Sign in with GitHub
            </Button>
          </div>

          <div className="border-border border-t px-8 py-4">
            <p className="text-center text-xs text-muted-foreground">
              Don&apos;t have access?{" "}
              <span className="text-foreground">
                Request an invite from a superadmin.
              </span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
