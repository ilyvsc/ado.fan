"use client";

import {
  SiAndroid,
  SiApple,
  SiFirefox,
  SiGooglechrome,
  SiLinux,
  SiMacos,
  SiOpera,
  SiSafari,
} from "@icons-pack/react-simple-icons";
import { LogOut, Monitor, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  listMemberSessions,
  revokeMemberSession,
  revokeMemberSessions,
} from "@/admin/actions/roles";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import type { Member } from "@/admin/actions/roles";

type Session = Awaited<ReturnType<typeof listMemberSessions>>[number];
type Icon = React.ComponentType<{ className?: string }>;

function parseUA(ua: string | null): { browser: string; os: string } {
  if (!ua) return { browser: "Unknown", os: "Unknown" };

  let os = "Unknown";
  if (/CrOS/i.test(ua)) os = "ChromeOS";
  else if (/Windows NT/i.test(ua)) os = "Windows";
  else if (/iPhone/i.test(ua)) os = "iOS";
  else if (/iPad/i.test(ua)) os = "iPadOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/Mac OS X/i.test(ua)) os = "macOS";
  else if (/Linux/i.test(ua)) os = "Linux";

  let browser = "Unknown";
  if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/OPR\/|Opera\//i.test(ua)) browser = "Opera";
  else if (/Firefox\/\d/i.test(ua)) browser = "Firefox";
  else if (/Chrome\/\d/i.test(ua)) browser = "Chrome";
  else if (/Version\/\d/i.test(ua) && /Safari/i.test(ua)) browser = "Safari";

  return { browser, os };
}

const OS_ICON: Record<string, Icon> = {
  macOS: SiMacos,
  iOS: SiApple,
  iPadOS: SiApple,
  Android: SiAndroid,
  Linux: SiLinux,
};

const BROWSER_ICON: Record<string, Icon> = {
  Chrome: SiGooglechrome,
  Firefox: SiFirefox,
  Safari: SiSafari,
  Opera: SiOpera,
};

function PlatformIcon({ ua, className }: { ua: string | null; className?: string }) {
  const { browser, os } = parseUA(ua);
  const Icon = OS_ICON[os] ?? BROWSER_ICON[browser] ?? Monitor;
  return <Icon className={className} />;
}

export function MemberSessionsDialog({ member }: { member: Member }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [pending, startTransition] = useTransition();

  function load() {
    setLoading(true);
    listMemberSessions(member.id)
      .then(setSessions)
      .catch(() => toast.error("Could not load sessions."))
      .finally(() => {
        setLoading(false);
      });
  }

  function revokeOne(sessionId: string) {
    startTransition(async () => {
      try {
        await revokeMemberSession(sessionId);
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        router.refresh();
      } catch {
        toast.error("Could not revoke session.");
      }
    });
  }

  function revokeAll() {
    startTransition(async () => {
      try {
        await revokeMemberSessions(member.id);
        setSessions([]);
        toast.success("All sessions revoked.");
        router.refresh();
      } catch {
        toast.error("Could not revoke sessions.");
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) load();
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={member.sessionCount === 0}
          className="h-7 gap-1.5 px-2 text-xs"
        >
          <LogOut className="size-3.5" />
          {member.sessionCount}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Sessions - {member.name}</DialogTitle>
          <DialogDescription>
            Active sessions. Revoke individually or all at once.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {loading ? (
            <>
              <Skeleton className="h-17 w-full" />
              <Skeleton className="h-17 w-full" />
              <Skeleton className="h-17 w-full" />
            </>
          ) : sessions.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No active sessions.
            </p>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              <div className="flex flex-col gap-1.5 pr-1">
                {sessions.map((session) => {
                  const { browser, os } = parseUA(session.userAgent);
                  const expired = session.expiresAt < new Date();
                  return (
                    <div
                      key={session.id}
                      title={session.userAgent ?? undefined}
                      className="flex items-center gap-3 rounded-lg border border-foreground/8 bg-foreground/2 p-3"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-foreground/6 text-muted-foreground">
                        <PlatformIcon ua={session.userAgent} className="size-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {browser === "Unknown" && os === "Unknown"
                            ? "Unknown device"
                            : browser === "Unknown"
                              ? os
                              : os === "Unknown"
                                ? browser
                                : `${browser} on ${os}`}
                        </p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {session.ipAddress ?? "Unknown IP"}
                        </p>
                        <p
                          className={cn(
                            "text-xs",
                            expired ? "text-destructive" : "text-muted-foreground/50",
                          )}
                        >
                          {expired ? "Expired" : "Expires"}{" "}
                          {session.expiresAt.toLocaleString()}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={pending}
                        onClick={() => {
                          revokeOne(session.id);
                        }}
                        className="hover:text-destructive size-7 shrink-0 text-muted-foreground"
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {sessions.length > 1 && (
          <div className="flex justify-end border-t border-foreground/8 pt-3">
            <Button
              variant="destructive"
              size="sm"
              disabled={pending}
              onClick={revokeAll}
            >
              Revoke all ({sessions.length})
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
