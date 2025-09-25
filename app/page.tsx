// app/page.tsx
import { prisma } from "@/lib/prisma";
import styles from "./home.module.css";
import Section from "@/components/Section";
import ServiceCard from "@/components/ServiceCard";
import Link from "next/link";

export const revalidate = 60; // ISR: re-generate periodically

// If you want city-based links from the homepage, set your defaults here:
const DEFAULT_REGION = "ab";
const DEFAULT_CITY = "calgary";

export default async function HomePage() {
  const services = await prisma.service.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    select: { id: true, name: true, slug: true, heroImage: true, order: true },
  });

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Licensed • Insured • Warranty</span>
          <div className={styles.title}>We build spaces that last</div>
          <p className={styles.subtitle}>
            Premium construction, renovations, and design-build services in your
            city. On-time and on-budget.
          </p>
          <div className={styles.ctaRow}>
            <Link href="/contact" className={styles.ctaPrimary}>
              Get a quote
            </Link>
          </div>
        </div>
      </section>

      <Section
        id="services"
        title="Services"
        desc="End-to-end delivery across commercial and residential work."
        // If you still use a generic /services index, change this href back to "/services"
        right={
          <Link href={`/${DEFAULT_REGION}/${DEFAULT_CITY}/services`}>
            All services →
          </Link>
        }
      >
        <div className={styles.grid}>
          {services.map((s) => (
            <div key={s.id} className={styles.col4}>
              <ServiceCard
                title={s.name}
                // omit excerpt since it's not in the new table; make it optional in ServiceCard props
                href={`/${DEFAULT_REGION}/${DEFAULT_CITY}/services/${s.slug}`}
                cover={s.heroImage ?? undefined}
              />
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}
