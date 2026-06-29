"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { getMemberOverrides, setMemberOverride } from "@/admin/actions/roles";
import {
  LEVEL_OPTIONS,
  OVERRIDABLE,
  PermissionLevel,
  roleBaseline,
} from "@/admin/lib/permissions";
import { LEVEL_META, SECTION_META } from "@/admin/lib/sections";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import type { Level, Role } from "@/admin/lib/permissions";

type Section = (typeof OVERRIDABLE)[number];

export function PermissionsDialog({
  userId,
  userName,
  role,
}: {
  userId: string;
  userName: string;
  role: Role;
}) {
  const [open, setOpen] = useState(false);
  const [levels, setLevels] = useState<Partial<Record<Section, Level>>>({});
  const [pending, startTransition] = useTransition();

  function load() {
    getMemberOverrides(userId)
      .then((overrides) => {
        setLevels(Object.fromEntries(overrides.map((o) => [o.resource, o.level])));
      })
      .catch(() => {
        toast.error("Could not load permissions.");
      });
  }

  function change(resource: Section, value: Level | "inherit") {
    const level = value === "inherit" ? null : value;
    startTransition(async () => {
      try {
        await setMemberOverride(userId, resource, level);
        setLevels((prev) => {
          const next = { ...prev };
          if (level === null) {
            Reflect.deleteProperty(next, resource);
          } else {
            next[resource] = level;
          }
          return next;
        });
        toast.success("Permission updated.");
      } catch {
        toast.error("Could not update permission.");
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
        <Button variant="outline" size="sm" className="h-7 gap-1.5 px-2 text-xs">
          <SlidersHorizontal className="size-3.5" />
          Permissions
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Permissions - {userName}</DialogTitle>
          <DialogDescription>
            Per-section overrides for this {role}. Inherit follows the role default.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col">
          {OVERRIDABLE.map((resource) => {
            const Icon = SECTION_META[resource].icon;
            const baseline = roleBaseline(role, resource);
            const current = levels[resource];

            return (
              <div
                key={resource}
                className="flex items-center justify-between gap-4 border-b border-foreground/6 py-3 last:border-0"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {SECTION_META[resource].label}
                  </span>
                </div>

                <div className="flex items-center gap-0.5 rounded-lg border border-foreground/10 bg-foreground/3 p-0.5">
                  <SegButton
                    active={!current}
                    disabled={pending}
                    onClick={() => {
                      change(resource, "inherit");
                    }}
                  >
                    {LEVEL_META[baseline].label}
                    <span className="text-muted-foreground/50">*</span>
                  </SegButton>

                  {LEVEL_OPTIONS.map((level) => (
                    <SegButton
                      key={level}
                      active={current === level}
                      disabled={pending}
                      tone={
                        level === PermissionLevel.write
                          ? "green"
                          : level === PermissionLevel.read
                            ? "yellow"
                            : "red"
                      }
                      onClick={() => {
                        change(resource, level);
                      }}
                    >
                      {LEVEL_META[level].label}
                    </SegButton>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SegButton({
  active,
  disabled,
  tone,
  onClick,
  children,
}: {
  active: boolean;
  disabled: boolean;
  tone?: "green" | "yellow" | "red";
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-md px-2.5 py-1 text-xs font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
        active
          ? [
              "bg-background shadow-sm",
              tone === "green" && "text-green-600",
              tone === "yellow" && "text-yellow-600",
              tone === "red" && "text-destructive",
              !tone && "text-foreground",
            ]
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
