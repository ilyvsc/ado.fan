import {
  Disc3,
  Eye,
  EyeOff,
  Link2,
  type LucideIcon,
  Music,
  Pencil,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  type Level,
  OVERRIDABLE,
  PermissionLevel,
  type Resource,
} from "@/admin/lib/permissions";

export const SECTION_META: Record<Resource, { label: string; icon: LucideIcon }> = {
  songs: { label: "Songs", icon: Music },
  albums: { label: "Albums", icon: Disc3 },
  externalLinks: { label: "External Links", icon: Link2 },
  members: { label: "Members", icon: Users },
  roles: { label: "Roles", icon: ShieldCheck },
};

export const LEVEL_META: Record<
  Level,
  { label: string; icon: LucideIcon; tone: string }
> = {
  [PermissionLevel.none]: {
    label: "None",
    icon: EyeOff,
    tone: "text-muted-foreground",
  },
  [PermissionLevel.read]: { label: "Read", icon: Eye, tone: "text-yellow-600" },
  [PermissionLevel.write]: { label: "Write", icon: Pencil, tone: "text-green-600" },
};

export interface AccessSummary {
  base: string;
  exceptions: { label: string; level: Level }[];
}

export function accessSummary(levels: Record<Resource, Level>): AccessSummary {
  const items = OVERRIDABLE.map((r) => ({
    label: SECTION_META[r].label,
    level: levels[r],
  }));

  if (items.every((i) => i.level === PermissionLevel.write)) {
    return { base: "All permissions", exceptions: [] };
  }
  if (items.some((i) => i.level === PermissionLevel.write)) {
    return {
      base: "All permissions except",
      exceptions: items.filter((i) => i.level !== PermissionLevel.write),
    };
  }
  if (items.every((i) => i.level === PermissionLevel.none)) {
    return { base: "No access", exceptions: [] };
  }
  if (items.every((i) => i.level === PermissionLevel.read)) {
    return { base: "Read only", exceptions: [] };
  }
  return { base: "", exceptions: items };
}
