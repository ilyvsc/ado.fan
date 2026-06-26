import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError } from "better-auth/api";
import { cookies } from "next/headers";

import { OVERRIDABLE, PermissionLevel, Role } from "@/admin/lib/permissions";
import { dbGetUserRole } from "@/db/queries/admin";

import { prisma } from "@/prisma/client";

import type { Level } from "@/admin/lib/permissions";

export const INVITE_COOKIE = "invite_token";

export const auth = betterAuth({
  appName: "ado.fan",
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    },
  },
  user: {
    additionalFields: {
      role: { type: "string", required: false, input: false },
    },
    deleteUser: {
      enabled: true,
      beforeDelete: async (user) => {
        const row = await dbGetUserRole(user.id);
        if (row?.role === Role.superadmin) {
          throw new APIError("FORBIDDEN", {
            message: "Superadmin account cannot be deleted.",
          });
        }
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const token = (await cookies()).get(INVITE_COOKIE)?.value;
          if (!token) {
            throw new APIError("FORBIDDEN", { message: "An invite is required." });
          }

          const invite = await prisma.invite.findUnique({ where: { token } });
          if (
            !invite ||
            invite.usedAt ||
            invite.revokedAt ||
            invite.expiresAt < new Date()
          ) {
            throw new APIError("FORBIDDEN", {
              message: "Invite is invalid, revoked, or expired.",
            });
          }

          return { data: { ...user, role: invite.role } };
        },

        after: async (user) => {
          const token = (await cookies()).get(INVITE_COOKIE)?.value;
          if (!token) return;

          const invite = await prisma.invite
            .update({
              where: { token },
              data: { usedAt: new Date(), usedBy: user.id },
            })
            .catch(() => null);

          const perms = invite?.permissions as Record<string, Level> | null;
          if (!perms) return;

          const rows = OVERRIDABLE.flatMap((resource) => {
            const level = perms[resource];
            return level && Object.values(PermissionLevel).includes(level)
              ? [{ userId: user.id, resource, level }]
              : [];
          });

          if (rows.length) {
            await prisma.userPermission
              .createMany({ data: rows })
              .catch(() => undefined);
          }
        },
      },
    },
  },
});
