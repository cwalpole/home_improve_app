// prisma.config.ts
import "dotenv/config";
import path from "node:path";
import type { PrismaConfig } from "prisma";

export default {
  // point to your schema (file OR folder)
  schema: path.join("prisma", "schema.prisma"),

  // optional: customize migrations dir
  // migrations: { path: path.join('prisma', 'migrations') },

  // optional: seed command (works with `pnpm dlx prisma db seed`)
  // seed: 'node prisma/seed.mjs',

  // optional: mark externally-managed tables, adapters, etc.
} satisfies PrismaConfig;
