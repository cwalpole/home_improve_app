"use client";

import Link from "next/link";
import styles from "./ServiceList.module.css";
import ServiceImage from "./ServiceImage";
import FeaturedPicks from "./FeaturedPicks";

export type Item = {
  id: number;
  name: string;
  slug: string;
  companyName: string | null;
  /** Derived from CompanyServiceCity.isFeatured */
  featured?: boolean | null;
};

type Props = {
  citySlug: string;
  services: Item[];
};

export default function ServiceList({ citySlug, services }: Props) {
  const featured = services.filter((s) => !!s.featured);
  const standard = services
    .filter((s) => !s.featured)
    .slice()
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );

  console.log("services", services);
  console.log("featured", featured);

  return (
    <div className={styles.wrapper}>
      <FeaturedPicks citySlug={citySlug} items={featured} />

      <section className={styles.section} aria-label="All services">
        <header className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>All services</h3>
        </header>
        <div className={styles.grid}>
          {standard.map((svc) => (
            <Link
              key={svc.id}
              href={`/${citySlug}/services/${svc.slug}`}
              className={styles.card}
              aria-label={`${svc.name}${
                svc.companyName ? ` — ${svc.companyName}` : ""
              }`}
            >
              <div className={styles.media}>
                <ServiceImage
                  slug={svc.slug}
                  alt={`${svc.name} image`}
                  fill
                  sizes="(max-width: 640px) 50vw, 400px"
                  className={styles.img}
                />
              </div>
              <div className={styles.body}>
                <div className={styles.title}>{svc.name}</div>
                <div className={styles.company}>
                  {svc.companyName ?? "No company linked"}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
