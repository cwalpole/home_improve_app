import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// simple tally helper
const tally = () => {
  const s = { created: 0, skipped: 0 };
  return {
    inc: (k) => (s[k]++, s),
    get: () => s,
  };
};

async function main() {
  const totals = {
    company: tally(),
    services: tally(),
    projects: tally(),
    blogPosts: tally(),
    testimonials: tally(),
  };

  // ── Company: create one if none exists ────────────────────────────────────────
  const existingCompany = await prisma.company.findFirst();
  if (!existingCompany) {
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
    console.log("Company: created");
    totals.company.inc("created");
  } else {
    console.log(
      "Company: skipped (already exists id=" + existingCompany.id + ")"
    );
    totals.company.inc("skipped");
  }

  // ── Services: insert-only (unique: slug) ─────────────────────────────────────
  const serviceSeeds = [
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
  ];

  for (const s of serviceSeeds) {
    const existing = await prisma.service.findUnique({
      where: { slug: s.slug },
    });
    if (existing) {
      console.log(`Service: skipped (${s.slug})`);
      totals.services.inc("skipped");
    } else {
      await prisma.service.create({ data: s });
      console.log(`Service: created (${s.slug})`);
      totals.services.inc("created");
    }
  }

  // fetch service IDs for relations
  const svcDesign = await prisma.service.findUnique({
    where: { slug: "design-build" },
  });
  const svcResi = await prisma.service.findUnique({
    where: { slug: "residential-renovations" },
  });

  // ── Projects: insert-only (unique: slug) ─────────────────────────────────────
  const projectSeeds = [
    {
      slug: "riverside-kitchen",
      title: "Riverside Kitchen",
      excerpt: "A light-filled family kitchen",
      content:
        "<p>Custom cabinetry, quartz counters, wide-plank flooring, and integrated lighting.</p>",
      coverImage:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
      location: "Edmonton, AB",
      serviceId: svcResi?.id ?? null,
      published: true,
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
      serviceId: svcDesign?.id ?? null,
      published: true,
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
      serviceId: svcResi?.id ?? null,
      published: true,
    },
  ];

  for (const p of projectSeeds) {
    const existing = await prisma.project.findUnique({
      where: { slug: p.slug },
    });
    if (existing) {
      console.log(`Project: skipped (${p.slug})`);
      totals.projects.inc("skipped");
    } else {
      await prisma.project.create({ data: p });
      console.log(`Project: created (${p.slug})`);
      totals.projects.inc("created");
    }
  }

  // ── Blog posts: insert-only (unique: slug) ───────────────────────────────────
  const blogSeeds = [
    // Example:
    // { slug: 'hello-world', title: 'Hello World', excerpt: '…', content: '<p>…</p>', coverImage: '…', published: true, publishedAt: new Date() },
  ];

  for (const b of blogSeeds) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: b.slug },
    });
    if (existing) {
      console.log(`BlogPost: skipped (${b.slug})`);
      totals.blogPosts.inc("skipped");
    } else {
      await prisma.blogPost.create({
        data: { ...b, publishedAt: b.published ? new Date() : null },
      });
      console.log(`BlogPost: created (${b.slug})`);
      totals.blogPosts.inc("created");
    }
  }

  // ── Testimonials: insert-only (no unique key) ────────────────────────────────
  const testimonialSeeds = [
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
  ];

  for (const t of testimonialSeeds) {
    const exists = await prisma.testimonial.findFirst({
      where: { name: t.name, quote: t.quote },
      select: { id: true },
    });
    if (exists) {
      console.log(
        `Testimonial: skipped (${t.name} - "${t.quote.slice(0, 24)}…")`
      );
      totals.testimonials.inc("skipped");
    } else {
      await prisma.testimonial.create({ data: t });
      console.log(`Testimonial: created (${t.name})`);
      totals.testimonials.inc("created");
    }
  }

  // ── Summary ─────────────────────────────────────────────────────────────────
  const sum = {
    company: totals.company.get(),
    services: totals.services.get(),
    projects: totals.projects.get(),
    blogPosts: totals.blogPosts.get(),
    testimonials: totals.testimonials.get(),
  };

  console.log("\nSeed completed (insert-only).\nSummary:");
  console.table({
    Company: sum.company,
    Services: sum.services,
    Projects: sum.projects,
    BlogPosts: sum.blogPosts,
    Testimonials: sum.testimonials,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
