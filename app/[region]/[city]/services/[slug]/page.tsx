import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import JsonLd from "@/components/JsonLd";
import styles from "./ServicePage.module.css";

type RouteParams = { region: string; city: string; slug: string };

export const revalidate = 60;

// Pre-render real combos only
export async function generateStaticParams() {
  try {
    const rows = await prisma.serviceCity.findMany({
      select: {
        service: { select: { slug: true } },
        city: { select: { slug: true, regionSlug: true } },
      },
    });
    return rows
      .filter((r) => !!r.city.regionSlug) // safety
      .map((r) => ({
        region: r.city.regionSlug!.toLowerCase(),
        city: r.city.slug,
        slug: r.service.slug,
      }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { region, city, slug } = await params;

  const row = await prisma.serviceCity.findFirst({
    where: {
      service: { slug },
      city: { slug: city, regionSlug: region.toLowerCase() },
    },
    include: { service: true, city: true },
  });
  if (!row) return {};

  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.example.com";
  const url = `${base}/${region}/${city}/services/${slug}`;
  const title = `${row.service.name} in ${row.city.name}, ${row.city.regionCode}`;

  return {
    title,
    alternates: { canonical: url },
    openGraph: {
      url,
      title,
      images: row.service.heroImage
        ? [{ url: row.service.heroImage }]
        : undefined,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { region, city, slug } = await params;

  const row = await prisma.serviceCity.findFirst({
    where: {
      service: { slug },
      city: { slug: city, regionSlug: region.toLowerCase() },
    },
    include: { service: true, city: true },
  });
  if (!row) notFound();

  const listings = await prisma.companyServiceCity.findMany({
    where: { serviceCityId: row.id },
    include: { company: true },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }],
  });

  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.example.com";
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: base },
      {
        "@type": "ListItem",
        position: 2,
        name: row.city.name,
        item: `${base}/${region}/${city}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Services",
        item: `${base}/${region}/${city}/services`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: row.service.name,
        item: `${base}/${region}/${city}/services/${slug}`,
      },
    ],
  };

  return (
    <main>
      <div className={styles.hero}>
        <div className={styles.inner}>
          <div className={styles.breadcrumbs}>
            <Link href="/">Home</Link> /{" "}
            <Link href={`/${region}/${city}`}>{row.city.name}</Link> /{" "}
            <Link href={`/${region}/${city}/services`}>Services</Link> /{" "}
            {row.service.name}
          </div>
          <h1 className={styles.title}>
            {row.service.name} in {row.city.name}, {row.city.regionCode}
          </h1>
        </div>
      </div>

      <section className={styles.wrap}>
        <div className={styles.media}>
          {row.service.heroImage ? (
            <Image
              src={row.service.heroImage}
              alt={row.service.name}
              width={1200}
              height={700}
            />
          ) : null}
        </div>

        <article className={styles.content}>
          {listings.length === 0 ? (
            <p>No companies listed yet for this service in this city.</p>
          ) : (
            <ul>
              {listings.map((l) => (
                <li key={`${l.companyId}-${l.serviceCityId}`}>
                  {l.displayName || l.company.name}
                  {l.isFeatured ? " (Featured)" : ""}
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>

      <JsonLd data={breadcrumbs} />
    </main>
  );
}
