import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://gothome.ca";

  let cities: { slug: string }[] = [];
  let services: { slug: string }[] = [];

  async function withTimeout<T>(promise: Promise<T>, ms: number, label: string) {
    return Promise.race([
      promise,
      new Promise<T>((_resolve, reject) =>
        setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
      ),
    ]);
  }

  if (process.env.DATABASE_URL) {
    try {
      [cities, services] = await withTimeout(
        Promise.all([
          prisma.city.findMany({
            select: { slug: true },
            orderBy: { slug: "asc" },
          }),
          prisma.service.findMany({
            select: { slug: true },
            orderBy: { order: "asc" },
          }),
        ]),
        1000,
        "sitemap prisma queries"
      );
    } catch (err) {
      console.warn("[sitemap] fallback to static entries:", err);
    }
  } else {
    console.warn("[sitemap] DATABASE_URL not set; returning static entries only.");
  }

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
