// app/page.tsx
import { prisma } from "@/lib/prisma";
import styles from "./home.module.css";
import Section from "@/components/Section";
import ServiceCard from "@/components/ServiceCard";
import Link from "next/link";
import { cookies } from "next/headers";

export const revalidate = 60; // ISR: re-generate periodically

const DEFAULT_CITY = "calgary";

export default async function HomePage() {
  const preferredCity =
    (await cookies()).get("preferred-city")?.value?.toLowerCase() ||
    DEFAULT_CITY;

  let services: { id: number; name: string; slug: string }[] = [];
  try {
    services = await prisma.service.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
      select: { id: true, name: true, slug: true },
    });
  } catch {
    services = [];
  }

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
        right={<Link href="/services">All services →</Link>}
      >
        <div className={styles.grid}>
          {services.map((s) => (
            <div key={s.id} className={styles.col4}>
              <ServiceCard
                title={s.name}
                href={`/${preferredCity}/services/${s.slug}`} // SEO city page
                cover={undefined}
              />
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}
