// prisma.config.ts
// Only load dotenv in non-production environments; Heroku injects config vars.
if (process.env.NODE_ENV !== "production") {
  await import("dotenv/config");
}
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
  // migrations: {
  //   seed: "pnpm run -s seed:db",
  // },
});
