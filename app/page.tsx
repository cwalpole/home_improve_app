import { prisma } from "@/lib/prisma";
import styles from "./home.module.css";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import ServiceCard from "@/components/ServiceCard";
import Link from "next/link";

export const revalidate = 60; // ISR: re-generate periodically

export default async function HomePage() {
  const [services] = await Promise.all([
    prisma.service.findMany({ orderBy: { order: "asc" } }),
  ]);

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
                title={s.title}
                excerpt={s.excerpt ?? undefined}
                href={`/services/${s.slug}`}
                cover={s.heroImage ?? undefined}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* <Section
        id="projects"
        title="Featured Projects"
        desc="A small selection of recent work. See the full gallery for more."
        right={<Link href="/projects">All projects →</Link>}
      >
        <div className={styles.grid}>
          {projects.map((p) => (
            <div key={p.id} className={styles.col4}>
              <ProjectCard
                title={p.title}
                excerpt={p.excerpt ?? undefined}
                href={`/projects/${p.slug}`}
                cover={p.coverImage ?? undefined}
              />
            </div>
          ))}
        </div>
      </Section> */}
    </main>
  );
}
