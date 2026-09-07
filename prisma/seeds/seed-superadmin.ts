import { randomUUID } from "crypto";

import { Role } from "@/admin/lib/permissions";

import { prisma } from "../client";

async function main() {
  const [email, name] = process.argv.slice(2);

  if (!email || !name) {
    console.error('Usage: bun seeds/seed-superadmin.ts "<email>" "<name>"');
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({
    where: { role: Role.superadmin },
  });
  if (existing) {
    console.error(`❌ Superadmin already exists: ${existing.email}`);
    process.exit(1);
  }

  const user = await prisma.user.create({
    data: {
      id: randomUUID(),
      email,
      name,
      emailVerified: true,
      role: Role.superadmin,
    },
  });

  console.log(`✅ Superadmin provisioned: ${user.email}`);
  console.log("Sign in via GitHub OAuth with this email to link the account.");
}

main()
  .catch((error: unknown) => {
    console.error("❌ Failed to provision superadmin:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
