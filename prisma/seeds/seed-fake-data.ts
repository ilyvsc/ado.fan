import { faker } from "@faker-js/faker";

import { Role } from "@/admin/lib/permissions";

import { prisma } from "../client";

import type { PermissionLevel } from "../generated/enums";

type Provider = "discord" | "github";

const PROVIDERS: Provider[] = ["discord", "github"];
const RESOURCES = ["songs", "albums", "externalLinks", "members", "roles"];
const PERMISSION_LEVELS: PermissionLevel[] = ["none", "read", "write"];

function randomProvider(): Provider {
  return faker.helpers.arrayElement(PROVIDERS);
}

function randomRole(index: number): Role {
  if (index < 5) return "admin";
  return "contributor";
}

function pickOther<T>(arr: T[], exclude: T): T {
  const candidates = arr.filter((x) => x !== exclude);
  return faker.helpers.arrayElement(candidates);
}

async function clearDatabase() {
  console.log("🧹 Clearing database...");

  const firstUser = await prisma.user.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true, role: true },
  });

  if (firstUser?.role !== Role.superadmin) {
    await prisma.$transaction([
      prisma.invite.deleteMany(),
      prisma.userPermission.deleteMany(),
      prisma.account.deleteMany(),
      prisma.session.deleteMany(),
      prisma.user.deleteMany(),
    ]);

    return;
  }

  await prisma.$transaction([
    prisma.invite.deleteMany({
      where: {
        OR: [{ invitedBy: { not: firstUser.id } }, { usedBy: { not: firstUser.id } }],
      },
    }),
    prisma.userPermission.deleteMany({ where: { userId: { not: firstUser.id } } }),
    prisma.account.deleteMany({ where: { userId: { not: firstUser.id } } }),
    prisma.session.deleteMany({ where: { userId: { not: firstUser.id } } }),
    prisma.user.deleteMany({ where: { id: { not: firstUser.id } } }),
  ]);
}
async function seedUsers() {
  const usedEmails = new Set<string>();

  function uniqueEmail(firstName: string, lastName: string): string {
    let email: string;

    do {
      const separator = faker.helpers.arrayElement([".", "_", ""]);
      const suffix = faker.helpers.maybe(
        () => faker.number.int({ min: 1, max: 9999 }).toString(),
        { probability: 0.35 },
      );

      email =
        `${firstName.toLowerCase()}${separator}${lastName.toLowerCase()}${suffix ?? ""}@ado.fan`.replace(
          /[^a-z0-9@._-]/g,
          "",
        );
    } while (usedEmails.has(email));

    usedEmails.add(email);
    return email;
  }

  const users = Array.from({ length: 50 }, (_, i) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
      id: faker.string.uuid(),
      name: `${firstName} ${lastName}`,
      email: uniqueEmail(firstName, lastName),
      emailVerified: faker.datatype.boolean({ probability: 0.7 }),
      image: faker.helpers.maybe(() => faker.image.avatar(), {
        probability: 0.6,
      }),
      role: randomRole(i),
      createdAt: faker.date.past({ years: 2 }),
      updatedAt: faker.date.recent({ days: 30 }),
    };
  });

  await prisma.user.createMany({ data: users });
  console.log(`✅ Seeded ${users.length} users.`);

  return { users, usedEmails };
}

async function seedSessions(users: Awaited<ReturnType<typeof seedUsers>>["users"]) {
  const sessions = users.flatMap((user) =>
    Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
      id: faker.string.uuid(),
      expiresAt: faker.date.future({ years: 1 }),
      token: faker.string.alphanumeric(64),
      createdAt: user.createdAt,
      updatedAt: faker.date.recent({ days: 7 }),
      ipAddress: faker.helpers.maybe(() => faker.internet.ip(), { probability: 0.8 }),
      userAgent: faker.helpers.maybe(() => faker.internet.userAgent(), {
        probability: 0.8,
      }),
      userId: user.id,
    })),
  );

  await prisma.session.createMany({ data: sessions });
  console.log(`✅ Seeded ${sessions.length} sessions.`);
}

async function seedAccounts(users: Awaited<ReturnType<typeof seedUsers>>["users"]) {
  const usedProviderPairs = new Set<string>();

  const accounts = users.flatMap((user) => {
    const result = [];
    const numAccounts = faker.number.int({ min: 1, max: 2 });
    const usedProviders = new Set<Provider>();

    for (let i = 0; i < numAccounts; i++) {
      let provider: Provider;
      let attempts = 0;
      do {
        provider = randomProvider();
        attempts++;
      } while (usedProviders.has(provider) && attempts < 10);

      const pairKey = `${user.id}::${provider}`;
      if (usedProviders.has(provider) || usedProviderPairs.has(pairKey)) continue;

      usedProviders.add(provider);
      usedProviderPairs.add(pairKey);

      result.push({
        id: faker.string.uuid(),
        accountId: faker.string.numeric(18),
        providerId: provider,
        userId: user.id,
        accessToken: faker.string.alphanumeric(40),
        refreshToken: null,
        idToken: faker.string.alphanumeric(80),
        accessTokenExpiresAt: faker.date.future({ years: 1 }),
        refreshTokenExpiresAt: null,
        scope: "read:user user:email",
        createdAt: user.createdAt,
        updatedAt: faker.date.recent({ days: 30 }),
      });
    }

    return result;
  });

  await prisma.account.createMany({ data: accounts });
  console.log(`✅ Seeded ${accounts.length} accounts.`);
}

async function seedPermissions(
  users: Awaited<ReturnType<typeof seedUsers>>["users"],
) {
  const permissions = users.flatMap((user) => {
    if (user.role === "superadmin") return [];

    const numPerms = faker.number.int({ min: 0, max: 3 });
    const assignedResources = faker.helpers.arrayElements(RESOURCES, numPerms);

    return assignedResources.map((resource) => ({
      id: faker.string.uuid(),
      userId: user.id,
      resource,
      level: faker.helpers.arrayElement(PERMISSION_LEVELS),
      createdAt: faker.date.past({ years: 1 }),
    }));
  });

  await prisma.userPermission.createMany({ data: permissions });
  console.log(`✅ Seeded ${permissions.length} permissions.`);
}

async function seedInvites(
  users: Awaited<ReturnType<typeof seedUsers>>["users"],
  usedEmails: Set<string>,
) {
  const userIds = users.map((u) => u.id);

  function uniqueEmail(): string {
    let email: string;

    do {
      const firstName = faker.person.firstName().toLowerCase();
      const lastName = faker.person.lastName().toLowerCase();
      const separator = faker.helpers.arrayElement([".", "_", ""]);
      const suffix = faker.helpers.maybe(
        () => faker.number.int({ min: 1, max: 9999 }).toString(),
        { probability: 0.35 },
      );

      email = `${firstName}${separator}${lastName}${suffix ?? ""}@ado.fan`.replace(
        /[^a-z0-9@._-]/g,
        "",
      );
    } while (usedEmails.has(email));

    usedEmails.add(email);
    return email;
  }

  const invites = users.map((user) => {
    const invitedBy = pickOther(userIds, user.id);
    const createdAt = faker.date.past({ years: 1 });
    const expiresAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);
    const isUsed = faker.datatype.boolean({ probability: 0.5 });
    const isRevoked = !isUsed && faker.datatype.boolean({ probability: 0.15 });

    const permissionsJson =
      faker.helpers.maybe(
        () =>
          Object.fromEntries(
            faker.helpers
              .arrayElements(RESOURCES, faker.number.int({ min: 1, max: 3 }))
              .map((r) => [r, faker.helpers.arrayElement(PERMISSION_LEVELS)]),
          ),
        { probability: 0.6 },
      ) ?? null;

    return {
      id: faker.string.uuid(),
      token: faker.string.uuid(),
      role: randomRole(faker.number.int({ min: 1, max: 49 })),
      invitedBy,
      email: faker.helpers.maybe(() => uniqueEmail(), { probability: 0.7 }) ?? null,
      permissions: permissionsJson,
      expiresAt,
      usedAt: isUsed ? faker.date.between({ from: createdAt, to: expiresAt }) : null,
      usedBy: isUsed ? pickOther(userIds, invitedBy) : null,
      revokedAt: isRevoked
        ? faker.date.between({ from: createdAt, to: new Date() })
        : null,
      createdAt,
    };
  });

  await prisma.invite.createMany({ data: invites });
  console.log(`✅ Seeded ${invites.length} invites.`);
}

async function main() {
  await prisma.$connect();

  try {
    await clearDatabase();

    const { users, usedEmails } = await seedUsers();

    await seedSessions(users);
    await seedAccounts(users);
    await seedPermissions(users);
    await seedInvites(users, usedEmails);

    console.log("\n🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("\n❌ Database seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

await main();
