// prisma.config.ts
import path from "node:path";
import { defineConfig } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
    // 👇 put your seed command here
    seed: "node prisma/seed.mjs",
    // If you use TS: seed: "tsx prisma/seed.ts"
  },
});
