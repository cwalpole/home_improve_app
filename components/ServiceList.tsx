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
  const cityLabel = citySlug.replace(/-/g, " ");
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
            const companyDisplay = svc.companyName ?? "Future Provider";
            const hasCompany = Boolean(svc.companyName);
            const helperCopy = hasCompany
              ? `Our Trusted Professional`
              : "Join our network of experts";
            const companyClass = hasCompany
              ? styles.company
              : `${styles.company} ${styles.companyPlaceholder}`;
            return (
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
                  <h4 className={styles.title}>{svc.name}</h4>
                  <p className={companyClass} title={companyDisplay}>
                    {companyDisplay}
                  </p>
                  <p className={styles.description}>{helperCopy}</p>
                  <span className={styles.cardLink}>
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
