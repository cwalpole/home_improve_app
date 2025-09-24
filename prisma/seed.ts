// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Services (order defines display order)
  const services = [
    { name: "Plumbing", slug: "plumbing", order: 1 },
    { name: "Electrical", slug: "electrical", order: 2 },
    { name: "HVAC", slug: "hvac", order: 3 },
    { name: "Roofing", slug: "roofing", order: 4 },
  ];
  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: { name: s.name, order: s.order },
      create: s,
    });
  }

  // Cities (slugs power your URLs)
  const cities = [
    {
      name: "Calgary",
      slug: "calgary",
      regionCode: "AB",
      country: "Canada",
    },
    {
      name: "Winnipeg",
      slug: "winnipeg",
      regionCode: "MB",
      country: "Canada",
    },
  ];
  for (const c of cities) {
    await prisma.city.upsert({
      where: { slug: c.slug },
      update: {
        regionCode: c.regionCode,
        country: c.country,
      },
      create: c,
    });
  }

  // Create ServiceCity “slots” for each service in each city
  const [svcRows, cityRows] = await Promise.all([
    prisma.service.findMany({ select: { id: true, slug: true } }),
    prisma.city.findMany({ select: { id: true, slug: true } }),
  ]);

  await prisma.$transaction(
    svcRows.flatMap((s) =>
      cityRows.map((c) =>
        prisma.serviceCity.upsert({
          where: { serviceId_cityId: { serviceId: s.id, cityId: c.id } },
          update: {},
          create: { serviceId: s.id, cityId: c.id },
        })
      )
    )
  );

  // Demo companies
  const acme = await prisma.company.upsert({
    where: { id: 1 },
    update: { name: "ACME Home Services", url: "https://acme.example" },
    create: { name: "ACME Home Services", url: "https://acme.example" },
  });
  const maple = await prisma.company.upsert({
    where: { id: 2 },
    update: { name: "Maple City Plumbing", url: "https://mapleplumb.example" },
    create: { name: "Maple City Plumbing", url: "https://mapleplumb.example" },
  });

  // Opt companies into specific slots:
  const plumbing = await prisma.service.findUniqueOrThrow({
    where: { slug: "plumbing" },
  });
  const calgary = await prisma.city.findUniqueOrThrow({
    where: { slug: "calgary" },
  });
  const wpg = await prisma.city.findUniqueOrThrow({
    where: { slug: "winnipeg" },
  });

  const scPlumbCal = await prisma.serviceCity.findUniqueOrThrow({
    where: { serviceId_cityId: { serviceId: plumbing.id, cityId: calgary.id } },
  });
  const scPlumbWpg = await prisma.serviceCity.findUniqueOrThrow({
    where: { serviceId_cityId: { serviceId: plumbing.id, cityId: wpg.id } },
  });

  await prisma.companyServiceCity.upsert({
    where: {
      companyId_serviceCityId: {
        companyId: acme.id,
        serviceCityId: scPlumbCal.id,
      },
    },
    update: { isFeatured: true },
    create: {
      companyId: acme.id,
      serviceCityId: scPlumbCal.id,
      isFeatured: true,
    },
  });

  await prisma.companyServiceCity.upsert({
    where: {
      companyId_serviceCityId: {
        companyId: maple.id,
        serviceCityId: scPlumbWpg.id,
      },
    },
    update: {},
    create: { companyId: maple.id, serviceCityId: scPlumbWpg.id },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
