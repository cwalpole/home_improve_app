// prisma/seed-admin.ts
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

function readCliFlag(name: string): string | undefined {
  const prefix = `--${name}=`;
  const arg = process.argv.find((a) => a.startsWith(prefix));
  return arg ? arg.substring(prefix.length) : undefined;
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to run admin seed.");
}

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(process.env.DATABASE_URL),
});

async function main() {
  const adminEmail = readCliFlag("admin-email");
  const adminPassword = readCliFlag("admin-password");

  if (!adminEmail) {
    throw new Error("Missing --admin-email flag for seeding admin user.");
  }
  if (!adminPassword) {
    throw new Error("Missing --admin-password flag for seeding admin user.");
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
      role: "admin",
    },
  });

  console.log(`Seeded admin user ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
