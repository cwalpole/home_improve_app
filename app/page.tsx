// app/page.tsx
import { prisma } from "@/lib/prisma";
import styles from "./home.module.css";
import Section from "@/components/Section";
import Link from "next/link";
import ServiceGrid from "@/components/ServiceGrid";
import ServiceList from "@/components/ServiceList";
import SwitchCity from "@/components/SwitchCity";

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

type PageProps = {
  searchParams?: { view?: "grid" | "list"; city?: string };
};

export default async function HomePage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const view = ((sp.view as string) ?? "grid") as "grid" | "list";
  const selectedCitySlug = ((sp.city as string) ?? DEFAULT_CITY).toLowerCase();

  // --- fetch current city + all cities for the switcher ---
  const [city, cities] = await Promise.all([
    prisma.city.findUnique({
      where: { slug: selectedCitySlug },
      select: { id: true, name: true, slug: true },
    }),
    prisma.city.findMany({
      select: { name: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ]);

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

  // --- fetch services for selected city ---
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
  const allServices = normalized;

  const defaultFeatured: GridItem = {
    id: -1,
    name: "Your Company Here",
    slug: "default-ad",
    heroImage: null,
    companyName: null,
    featured: false,
  };

  // stay on the current page; preserve city while toggling view
  const gridHref = `?city=${city.slug}&view=grid#services`;
  const listHref = `?city=${city.slug}&view=list#services`;

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.title}>Your Home, Our priority</div>
          <div className={styles.subtitle}>
            Making Homes Shine, One Service at a Time
          </div>
        </div>
      </section>

      <Section
        id="services"
        title={
          <>
            Services in {city.name} {/* NEW: Switch City control */}
            <SwitchCity
              current={{ name: city.name, slug: city.slug }}
              cities={cities}
              currentView={view}
            />
          </>
        }
        desc="End-to-end delivery for residential work."
        right={
          <div className={styles.links}>
            <div className={styles.viewSwitch}>
              <Link
                href={gridHref}
                className={`${styles.viewBtn} ${
                  view === "grid" ? styles.active : ""
                }`}
                aria-current={view === "grid" ? "page" : undefined}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                </svg>
                Grid
              </Link>
              <Link
                href={listHref}
                className={`${styles.viewBtn} ${
                  view === "list" ? styles.active : ""
                }`}
                aria-current={view === "list" ? "page" : undefined}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
                </svg>
                List
              </Link>
            </div>
            <div className={styles.allServices}>
              <Link href={`/${city.slug}/services`} className={styles.allLink}>
                All services →
              </Link>
            </div>
          </div>
        }
      >
        {view === "grid" ? (
          <ServiceGrid
            citySlug={city.slug}
            services={allServices}
            featured={featuredItems}
            defaultFeatured={defaultFeatured}
          />
        ) : (
          <ServiceList
            citySlug={city.slug}
            services={allServices}
            featured={featuredItems}
            defaultFeatured={defaultFeatured}
            insertEvery={6}
          />
        )}
      </Section>
    </main>
  );
}
