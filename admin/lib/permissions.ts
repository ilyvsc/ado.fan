// ─── Roles ────────────────────────────────────────────────────────────────────
// Hierarchy: superadmin > admin > contributor.
// Only one superadmin can exist; role changes are capped at admin/contributor.

export const ROLES = ["superadmin", "admin", "contributor"] as const;
export type Role = (typeof ROLES)[number];

// Const object mirrors the type so callers can write Role.admin instead of "admin".
export const Role = {
  superadmin: "superadmin" as const,
  admin: "admin" as const,
  contributor: "contributor" as const,
};

// Roles that can be assigned via an invite. Superadmin is excluded - it is
// bootstrapped once via BOOTSTRAP_SUPERADMIN_EMAIL and never re-assignable.
export const INVITE_ROLES = ["admin", "contributor"] as const;
export type InviteRole = (typeof INVITE_ROLES)[number];

// ─── Permission levels ────────────────────────────────────────────────────────

export const PermissionLevel = {
  none: "none",
  read: "read",
  write: "write",
} as const;
export type Level = (typeof PermissionLevel)[keyof typeof PermissionLevel];

export const LEVEL_OPTIONS = [
  PermissionLevel.none,
  PermissionLevel.read,
  PermissionLevel.write,
];

// ─── Resources ────────────────────────────────────────────────────────────────
// Everything the permission system can gate.

export const RESOURCES = [
  "songs",
  "albums",
  "externalLinks",
  "members",
  "roles",
] as const;
export type Resource = (typeof RESOURCES)[number];

// Resources where per-user overrides (and invite-carried permissions) are
// allowed. members/roles are admin-domain only - granting write access to
// those via an invite would let contributors promote/demote members, which
// bypasses the role hierarchy entirely.
export const OVERRIDABLE: Resource[] = RESOURCES.filter(
  (r) => r !== "members" && r !== "roles",
);

export interface Override {
  resource: Resource;
  level: Level;
}

export type Action = "read" | "write";

// ─── Baseline matrix ──────────────────────────────────────────────────────────
// Defines the default level each role gets on every resource, before any
// per-user overrides are applied.
//
//              songs  albums  externalLinks  members  roles
// superadmin   write  write   write          write    write
// admin        write  write   write          read     read
// contributor  read   read    read           none     none

export function roleBaseline(role: Role, resource: Resource): Level {
  if (role === Role.superadmin) return PermissionLevel.write;
  if (role === Role.admin) {
    if (resource === "members" || resource === "roles") return PermissionLevel.read;
    return PermissionLevel.write;
  }
  // contributor
  if (resource === "members" || resource === "roles") return PermissionLevel.none;
  return PermissionLevel.read;
}

// ─── Effective level ──────────────────────────────────────────────────────────
// Per-user override wins over the role baseline when present.

export function effectiveLevel(
  role: Role,
  overrides: Override[],
  resource: Resource,
): Level {
  const override = overrides.find((o) => o.resource === resource);
  return override?.level ?? roleBaseline(role, resource);
}

// ─── Authorization check ─────────────────────────────────────────────────────

export function can(
  role: Role,
  overrides: Override[],
  resource: Resource,
  action: Action,
): boolean {
  const level = effectiveLevel(role, overrides, resource);
  if (level === PermissionLevel.none) return false;
  if (action === "read") return true;
  return level === PermissionLevel.write;
}
