import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";
import { env } from "prisma/config";

import { PrismaClient } from "./generated/client";

const adapter = new PrismaPg({ connectionString: env("DATABASE_URL") });
export const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
}).$extends(withAccelerate());
