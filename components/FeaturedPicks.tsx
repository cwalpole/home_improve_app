"use client";

import Link from "next/link";
import ServiceImage from "./ServiceImage";
import styles from "./FeaturedPicks.module.css";

export type FeaturedItem = {
  id: number;
  name: string;
  slug: string;
  companyName: string | null;
};

type Props = {
  citySlug: string;
  items: FeaturedItem[]; // already filtered to isFeatured
  title?: string;
  subtitle?: string;
};

export default function FeaturedPicks({
  citySlug,
  items,
  title = "Featured services",
  subtitle = "Expert picks in your area",
}: Props) {
  if (!items?.length) return null;

  return (
    <section
      className={styles.featuredSection}
      aria-label="Featured services"
      id="featured-services"
    >
      <header className={styles.featuredHeader}>
        <h2 className={styles.featuredTitle}>{title}</h2>
        {subtitle && <p className={styles.featuredSub}>{subtitle}</p>}
      </header>

      <div className={styles.featuredGrid}>
        {items.map((svc) => (
          <Link
            key={svc.id}
            href={`/${citySlug}/services/${svc.slug}`}
            className={styles.featuredCard}
            aria-label={`${svc.name}${
              svc.companyName ? ` — ${svc.companyName}` : ""
            }`}
          >
            <div className={styles.featuredMedia}>
              <ServiceImage
                slug={svc.slug}
                alt={`${svc.name} image`}
                fill
                sizes="(max-width: 640px) 90vw, 360px"
                className={styles.featuredImg}
              />
            </div>
            <div className={styles.featuredLabel}>
              <span className={styles.featuredName}>{svc.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
