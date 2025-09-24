// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // allow global var reuse in dev to prevent creating many clients
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
