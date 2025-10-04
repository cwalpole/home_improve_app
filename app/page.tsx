// app/page.tsx
import { prisma } from "@/lib/prisma";
import styles from "./home.module.css";
import Section from "@/components/Section";
import Link from "next/link";
import { cookies } from "next/headers";
import ServiceGrid from "@/components/ServiceGrid";

export const revalidate = 60;

const DEFAULT_CITY = "calgary";

type GridItem = {
  id: number;
  name: string;
  slug: string;
  heroImage: string | null;
  companyName: string | null;
  featured: boolean;
};

export default async function HomePage() {
  const preferredCity =
    (await cookies()).get("preferred-city")?.value?.toLowerCase() ||
    DEFAULT_CITY;

  const city = await prisma.city.findUnique({
    where: { slug: preferredCity },
    select: { id: true, name: true, slug: true },
  });

  if (!city) {
    return (
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.title}>Your Home, Our priority</div>
            <div className={styles.subtitle}>
              Making Homes Shine, One Service at a Time
            </div>
          </div>
        </section>

        <Section
          id="services"
          title="Services"
          desc="No city selected or city not found."
          right={<Link href="/services">All services →</Link>}
        >
          <p>Set up cities and mappings in the Admin, or pick another city.</p>
        </Section>
      </main>
    );
  }

  // include isFeatured for top listing and heroImage on service
  const services = await prisma.service.findMany({
    where: { serviceCities: { some: { cityId: city.id } } },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      heroImage: true,
      serviceCities: {
        where: { cityId: city.id },
        select: {
          listings: {
            orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }],
            take: 1,
            select: {
              isFeatured: true,
              displayName: true,
              company: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.title}>Your Home, Our priority</div>
          <div className={styles.subtitle}>
            Making Homes Shine, One Service at a Time
          </div>
        </div>
      </section>

      <Section
        id="services"
        title={`Services in ${city.name}`}
        desc="End-to-end delivery for residential work."
        right={<Link href={`/${city.slug}/services`}>All services →</Link>}
      >
        {(() => {
          const normalized: GridItem[] = services.map((s) => {
            const top = s.serviceCities?.[0]?.listings?.[0] ?? null;
            const companyName = top?.displayName ?? top?.company?.name ?? null;
            const featured = Boolean(top?.isFeatured);
            return {
              id: s.id,
              name: s.name,
              slug: s.slug,
              heroImage: s.heroImage ?? null,
              companyName,
              featured,
            };
          });

          const featuredItems = normalized.filter((x) => x.featured);
          const allServices = normalized; // pass everything; grid filters duplicates

          // Optional default featured card (only used when a row has one leftover)
          const defaultFeatured: GridItem = {
            id: -1,
            name: "Sponsored",
            slug: "default-ad", // add /public/ads/default-ad.jpg if you want a banner image
            heroImage: null,
            companyName: null,
            featured: false,
          };

          return (
            <ServiceGrid
              citySlug={city.slug}
              services={allServices}
              featured={featuredItems} // can be [], [one], or more
              defaultFeatured={defaultFeatured} // optional fallback
            />
          );
        })()}
      </Section>
    </main>
  );
}
