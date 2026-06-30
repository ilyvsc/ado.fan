"use client";

import { Copy, SlidersHorizontal, UserPlus } from "lucide-react";

import { useState } from "react";

import { toast } from "sonner";

import { createInvite, type InvitePermissions } from "@/admin/actions/invites";
import {
  INVITE_ROLES,
  OVERRIDABLE,
  LEVEL_OPTIONS,
  Role,
} from "@/admin/lib/permissions";

import { LEVEL_META, SECTION_META } from "@/admin/lib/sections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { InviteRole, Level, Resource } from "@/admin/lib/permissions";

export function InvitePermissionsDialog() {
  const [role, setRole] = useState<InviteRole>(Role.contributor);
  const [perms, setPerms] = useState<InvitePermissions>({});
  const [link, setLink] = useState("");
  const [pending, setPending] = useState(false);

  const customCount = Object.keys(perms).length;

  function setPerm(resource: Resource, value: Level | "inherit") {
    setPerms((prev) => {
      const { [resource]: _omit, ...rest } = prev;
      return value === "inherit" ? rest : { ...rest, [resource]: value };
    });
  }

  async function generate() {
    setPending(true);
    try {
      const path = await createInvite(role, perms);
      const url = `${window.location.origin}${path}`;
      setLink(url);
      await navigator.clipboard.writeText(url).catch(() => undefined);
      toast.success("Invite link generated and copied.");
    } catch {
      toast.error("Could not create invite.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Select
          value={role}
          onValueChange={(value) => {
            setRole(value as InviteRole);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {INVITE_ROLES.map((r) => (
              <SelectItem key={r} value={r} className="capitalize">
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="size-4" />
              Custom permissions
              {customCount > 0 && (
                <span className="rounded bg-foreground px-1.5 text-xs text-background">
                  {customCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <p className="mb-3 text-sm font-medium text-foreground">
              Starting permissions
            </p>
            <div className="flex flex-col gap-2">
              {OVERRIDABLE.map((resource) => {
                const Icon = SECTION_META[resource].icon;
                return (
                  <div
                    key={resource}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="flex items-center gap-2 text-sm text-foreground">
                      <Icon className="size-4 text-muted-foreground" />
                      {SECTION_META[resource].label}
                    </span>
                    <Select
                      value={perms[resource] ?? "inherit"}
                      onValueChange={(v) => {
                        setPerm(resource, v as Level | "inherit");
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inherit">Default</SelectItem>
                        {LEVEL_OPTIONS.map((level) => {
                          const LevelIcon = LEVEL_META[level].icon;
                          return (
                            <SelectItem key={level} value={level}>
                              <span className="flex items-center gap-2">
                                <LevelIcon className="size-3.5" />
                                {LEVEL_META[level].label}
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>

        <Button
          onClick={() => {
            void generate();
          }}
          disabled={pending}
          className="gap-2"
        >
          <UserPlus className="size-4" />
          Generate link
        </Button>
      </div>

      {link && (
        <div className="flex gap-2">
          <Input readOnly value={link} className="font-mono text-xs" />
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              void navigator.clipboard.writeText(link);
              toast.success("Copied.");
            }}
          >
            <Copy className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
