// prisma.config.ts
import "dotenv/config";
import path from "node:path";
import type { PrismaConfig } from "prisma";

export default {
  // point to your schema (file OR folder)
  schema: path.join("prisma", "schema.prisma"),

  // migrations: {
  //   seed: "pnpm run -s seed:db", // runs local tsx
  // },
  // optional: mark externally-managed tables, adapters, etc.
} satisfies PrismaConfig;
