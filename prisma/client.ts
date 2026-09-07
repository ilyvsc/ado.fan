import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "prisma/config";

import { Prisma, PrismaClient } from "./generated/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: env("DATABASE_URL") }),
  log: env("NODE_ENV") ? ["error"] : ["query", "error", "warn"],
});

export { prisma, Prisma };
