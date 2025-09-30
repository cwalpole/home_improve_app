// app/page.tsx
import { prisma } from "@/lib/prisma";
import styles from "./home.module.css";
import Section from "@/components/Section";
import ServiceCard from "@/components/ServiceCard";
import Link from "next/link";
import { cookies } from "next/headers";

export const revalidate = 60;

const DEFAULT_CITY = "calgary";

export default async function HomePage() {
  const preferredCity =
    (await cookies()).get("preferred-city")?.value?.toLowerCase() ||
    DEFAULT_CITY;

  // Find city; if missing, fall back to default
  const city = await prisma.city.findUnique({
    where: { slug: preferredCity },
    select: { id: true, name: true, slug: true },
  });

  if (!city) {
    // Hard fallback if DB has no such city
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

  // Fetch only services available in this city, plus the top company for each
  const services = await prisma.service.findMany({
    where: { serviceCities: { some: { cityId: city.id } } },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      serviceCities: {
        where: { cityId: city.id },
        select: {
          listings: {
            orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }],
            take: 1,
            select: {
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
        <div className={styles.serviceGrid}>
          {services.map((s) => {
            const top = s.serviceCities[0]?.listings[0] ?? null;
            const companyName = top?.displayName ?? top?.company.name ?? null;

            return (
              <div key={s.id} className={styles.serviceItem}>
                <ServiceCard
                  href={`/${city.slug}/services/${s.slug}`}
                  service={{
                    name: s.name,
                    slug: s.slug,
                  }}
                  companyName={companyName ?? "No company linked"}
                />
              </div>
            );
          })}
        </div>
      </Section>
    </main>
  );
}
