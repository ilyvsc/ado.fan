import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";
import { env } from "prisma/config";

import { Prisma, PrismaClient } from "./generated/client";

const databaseUrl = env("DATABASE_URL");

const prisma =
  process.env.NODE_ENV === "production"
    ? new PrismaClient({
        accelerateUrl: databaseUrl,
        log: ["error"],
      }).$extends(withAccelerate())
    : new PrismaClient({
        adapter: new PrismaPg({ connectionString: databaseUrl }),
        log: ["query", "error", "warn"],
      });

export { prisma, Prisma };
