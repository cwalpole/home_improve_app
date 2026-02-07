"use client";

import Link from "next/link";
import styles from "./ServiceList.module.css";
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

  return (
    <div>
      <FeaturedPicks citySlug={citySlug} items={featured} />

      <section className={styles.section} aria-label="All services">
        <div className={styles.grid}>
          {standard.map((svc) => {
            return (
              <Link
                key={svc.id}
                href={`/${citySlug}/services/${svc.slug}`}
                className={styles.card}
                aria-label={`${svc.name}${
                  svc.companyName ? ` — ${svc.companyName}` : ""
                }`}
              >
                <div className={styles.bodySolo}>
                  <h4 className={styles.title}>{svc.name}</h4>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
