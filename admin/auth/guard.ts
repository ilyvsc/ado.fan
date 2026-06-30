"use server";

import { headers } from "next/headers";

import { auth } from "@/admin/auth/server";
import { can, Role } from "@/admin/lib/permissions";
import { loadOverrides } from "@/db/queries/admin";

import type { Action, Resource } from "@/admin/lib/permissions";

const devBypass = process.env.ADMIN_DEV_BYPASS === "allow";

const BYPASS_SUPERUSER = {
  id: "dev-bypass",
  name: "Superadmin",
  email: "dev@localhost",
  role: Role.superadmin,
  image: "https://avatars.githubusercontent.com/u/68219934",
} as const;

async function getSessionUser() {
  if (devBypass) return BYPASS_SUPERUSER;
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

async function getSessionIdentity() {
  if (devBypass) return { id: BYPASS_SUPERUSER.id, role: BYPASS_SUPERUSER.role };
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  if (!user) return null;
  return { id: user.id, role: user.role as Role | null };
}

async function getVerifiedSessionUser() {
  if (devBypass) return BYPASS_SUPERUSER;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user.role) return null;
  return session.user;
}

async function requireSuperadmin() {
  if (devBypass) return BYPASS_SUPERUSER;
  const user = await getSessionUser();
  if (user?.role !== Role.superadmin) {
    throw new Error("Forbidden: superadmin only.");
  }
  return user;
}

async function requireResource(resource: Resource, action: Action) {
  if (devBypass && action === "write")
    throw new Error(`Forbidden: read-only in dev bypass.`);
  const user = await getSessionUser();
  if (!user) throw new Error(`Forbidden: ${action} ${resource}.`);

  const overrides = await loadOverrides(user.id);
  if (!can(user.role as Role, overrides, resource, action)) {
    throw new Error(`Forbidden: ${action} ${resource}.`);
  }
  return user;
}

export {
  getSessionUser,
  getSessionIdentity,
  getVerifiedSessionUser,
  requireSuperadmin,
  loadOverrides,
  requireResource,
};
