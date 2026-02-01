// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

declare global {
  // allow global var reuse in dev to prevent creating many clients
  var prisma: PrismaClient | undefined;
}

function normalizeDbUrl(urlString: string) {
  const url = new URL(urlString);
  if (!url.searchParams.has("connectionLimit")) {
    url.searchParams.set("connectionLimit", "2");
  }
  if (!url.searchParams.has("pool_timeout")) {
    url.searchParams.set("pool_timeout", "10000");
  }
  return url.toString();
}

function buildAdapter() {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL is required to initialize PrismaClient.");
  }
  return new PrismaMariaDb(normalizeDbUrl(raw));
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    adapter: buildAdapter(),
    log: ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
