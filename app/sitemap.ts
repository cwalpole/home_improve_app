// app/sitemap.ts
import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gothome.ca";

  // Always include a minimal static set
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    }, // generic index
  ];

  try {
    // Blog posts
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });

    // All city pages (need regionSlug + city slug)
    const cities = await prisma.city.findMany({
      where: { regionSlug: { not: null } },
      select: { slug: true, regionSlug: true, id: true },
    });

    // All service-city combos (drives detail pages)
    const serviceCities = await prisma.serviceCity.findMany({
      select: {
        city: { select: { slug: true, regionSlug: true, id: true } },
        service: { select: { slug: true, updatedAt: true } },
      },
    });

    // City services index URLs
    // lastModified = max(updatedAt of any service offered in that city), fallback to now
    const cityLastMod = new Map<string, Date>();
    for (const sc of serviceCities) {
      const key = `${sc.city.regionSlug}/${sc.city.slug}`;
      const svcUpdated = sc.service.updatedAt ?? new Date();
      const cur = cityLastMod.get(key);
      if (!cur || svcUpdated > cur) cityLastMod.set(key, svcUpdated);
    }
    const cityIndexEntries: MetadataRoute.Sitemap = cities.map((c) => {
      const key = `${c.regionSlug}/${c.slug}`;
      return {
        url: `${base}/${c.regionSlug}/${c.slug}/services`,
        lastModified: cityLastMod.get(key) ?? new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      };
    });

    // City + Service detail URLs
    const serviceDetailEntries: MetadataRoute.Sitemap = serviceCities.map(
      (sc) => ({
        url: `${base}/${sc.city.regionSlug}/${sc.city.slug}/services/${sc.service.slug}`,
        lastModified: sc.service.updatedAt ?? new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      })
    );

    // Blog entries
    const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updatedAt ?? new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    return [
      ...staticRoutes,
      ...cityIndexEntries,
      ...serviceDetailEntries,
      ...blogEntries,
    ];
  } catch {
    // If DB isn’t reachable during build, return static only (keeps build green)
    return staticRoutes;
  }
}
