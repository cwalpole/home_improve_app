import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://gothome.ca";

  const [cities, services] = await Promise.all([
    prisma.city.findMany({ select: { slug: true }, orderBy: { slug: "asc" } }),
    prisma.service.findMany({
      select: { slug: true },
      orderBy: { order: "asc" },
    }),
  ]);

  const global = [
    {
      url: `${base}/services`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    ...services.map((s) => ({
      url: `${base}/services/${s.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  const cityEntries = cities.flatMap((c) => [
    {
      url: `${base}/${c.slug}/services`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    ...services.map((s) => ({
      url: `${base}/${c.slug}/services/${s.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ]);

  return [...global, ...cityEntries];
}
