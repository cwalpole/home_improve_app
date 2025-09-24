import { prisma } from "@/lib/prisma";
export default async function sitemap() {
  const base = "https://www.gothome.ca";
  const [services, projects, posts] = await Promise.all([
    prisma.service.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.project.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticRoutes = ["", "/about", "/contact"].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const dynamic = [
    ...services.map((s) => ({
      url: `${base}/services/${s.slug}`,
      lastModified: s.updatedAt,
    })),
    // ...projects.map((p) => ({
    //   url: `${base}/projects/${p.slug}`,
    //   lastModified: p.updatedAt,
    // })),
    ...posts.map((b) => ({
      url: `${base}/blog/${b.slug}`,
      lastModified: b.updatedAt,
    })),
  ];

  return [...staticRoutes, ...dynamic];
}
