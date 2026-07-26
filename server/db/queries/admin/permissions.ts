import { prisma } from "@/prisma/client";

import type { Override, Resource } from "@/admin/lib/permissions";

/** Per-user resource permission overrides, layered on top of their role. */
export async function loadOverrides(userId: string): Promise<Override[]> {
  const rows = await prisma.userPermission.findMany({
    where: { userId },
    select: { resource: true, level: true },
  });
  return rows.map((r) => ({ resource: r.resource as Resource, level: r.level }));
}
