/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await Promise.all([
    prisma.project.deleteMany(),
    prisma.service.deleteMany(),
    prisma.testimonial.deleteMany(),
    prisma.blogPost.deleteMany(),
    prisma.company.deleteMany(),
  ]);

  await prisma.company.create({
    data: {
      name: "Acme Builders",
      tagline: "We build spaces that last",
      phone: "+1-555-555-5555",
      email: "hello@example.com",
      city: "Edmonton",
      region: "AB",
      country: "CA",
    },
  });

  await prisma.service.createMany({
    data: [
      {
        slug: "design-build",
        title: "Design-Build",
        excerpt: "From concept to completion",
        content:
          "<p>We manage your project end-to-end: planning, permitting, construction, and delivery.</p>",
        heroImage:
          "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1200&auto=format&fit=crop",
        order: 1,
      },
      {
        slug: "residential-renovations",
        title: "Residential Renovations",
        excerpt: "Kitchens, bathrooms, basements",
        content:
          "<p>Upgrades that add value and comfort: kitchens, baths, basements, and whole-home.</p>",
        heroImage:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
        order: 2,
      },
      {
        slug: "commercial-construction",
        title: "Commercial Construction",
        excerpt: "Retail, office, hospitality",
        content:
          "<p>On-schedule retail, office, and hospitality build-outs with minimal downtime.</p>",
        heroImage:
          "https://images.unsplash.com/photo-1433840496881-cbd845929862?q=80&w=1200&auto=format&fit=crop",
        order: 3,
      },
    ],
  });

  const resi = await prisma.service.findUnique({
    where: { slug: "residential-renovations" },
  });
  const dnb = await prisma.service.findUnique({
    where: { slug: "design-build" },
  });

  await prisma.project.createMany({
    data: [
      {
        slug: "riverside-kitchen",
        title: "Riverside Kitchen",
        excerpt: "A light-filled family kitchen",
        content:
          "<p>Custom cabinetry, quartz counters, wide-plank flooring, and integrated lighting.</p>",
        coverImage:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
        location: "Edmonton, AB",
        serviceId: resi?.id ?? null,
      },
      {
        slug: "market-street-office",
        title: "Market Street Office",
        excerpt: "Warm, modern workspace",
        content:
          "<p>Open plan office with acoustic treatments, collaborative spaces, and biophilic design.</p>",
        coverImage:
          "https://images.unsplash.com/photo-1433840496881-cbd845929862?q=80&w=1200&auto=format&fit=crop",
        location: "Edmonton, AB",
        serviceId: dnb?.id ?? null,
      },
      {
        slug: "cedar-deck-pergola",
        title: "Cedar Deck & Pergola",
        excerpt: "Durable outdoor living",
        content:
          "<p>Rot-resistant cedar with powder-coated hardware and integrated lighting.</p>",
        coverImage:
          "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
        location: "St. Albert, AB",
        serviceId: resi?.id ?? null,
      },
    ],
  });

  await prisma.testimonial.createMany({
    data: [
      {
        name: "J. Smith",
        role: "Homeowner",
        quote: "Fantastic from design to finish.",
        company: "Private",
      },
      {
        name: "Acme Retail",
        role: "Owner",
        quote: "On time and under budget.",
        company: "Acme Retail",
      },
    ],
  });

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
