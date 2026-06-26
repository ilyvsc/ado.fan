import { headers } from "next/headers";

import { auth } from "@/admin/auth/server";
import { can, Role } from "@/admin/lib/permissions";
import { loadOverrides } from "@/db/queries/admin";

import type { Action, Resource } from "@/admin/lib/permissions";

async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

async function getSessionIdentity() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  if (!user) return null;
  return { id: user.id, role: user.role as Role | null };
}

async function getVerifiedSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user.role) return null;
  return session.user;
}

async function requireSuperadmin() {
  const user = await getSessionUser();
  if (user?.role !== Role.superadmin) {
    throw new Error("Forbidden: superadmin only.");
  }
  return user;
}

async function requireResource(resource: Resource, action: Action) {
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
