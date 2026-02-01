// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

declare global {
  // allow global var reuse in dev to prevent creating many clients
  var prisma: PrismaClient | undefined;
}

function buildAdapter() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required to initialize PrismaClient.");
  }
  return new PrismaMariaDb(url);
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    adapter: buildAdapter(),
    log: ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
