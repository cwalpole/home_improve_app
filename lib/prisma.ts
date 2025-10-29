// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // allow global var reuse in dev to prevent creating many clients
  var prisma: PrismaClient | undefined;
}

function buildDatasourceUrl(): string | undefined {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) return undefined;

  try {
    const url = new URL(rawUrl);
    if (!url.searchParams.has("connection_limit")) {
      url.searchParams.set("connection_limit", "2");
    }
    if (!url.searchParams.has("pool_timeout")) {
      url.searchParams.set("pool_timeout", "10");
    }
    return url.toString();
  } catch {
    return rawUrl;
  }
}

const datasourceUrl = buildDatasourceUrl();

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ["warn", "error"],
    datasources: datasourceUrl ? { db: { url: datasourceUrl } } : undefined,
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
