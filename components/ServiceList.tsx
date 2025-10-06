"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./ServiceList.module.css";
import ServiceImage from "./ServiceImage";

export type Item = {
  id: number;
  name: string;
  slug: string;
  heroImage: string | null;
  companyName: string | null;
};

type Props = {
  citySlug: string;
  services: Item[]; // all services (may include featured; we’ll filter)
  featured?: Item[]; // zero or more ad items (consumed once)
  defaultFeatured?: Item | null; // optional fallback when we still want an ad
  insertEvery?: number; // after how many service rows to insert an ad (default 6)
};

export default function ServiceList({
  citySlug,
  services,
  featured = [],
  defaultFeatured = null,
  insertEvery = 6,
}: Props) {
  // remove duplicates so featured doesn’t also appear as a normal row
  const featuredIds = new Set(featured.map((f) => f.id));
  const standard = services.filter((s) => !featuredIds.has(s.id));

  // Build interleaved rows: service, service, ... (after N services) → ad (if available), repeat
  type Row = { type: "service"; item: Item } | { type: "ad"; item: Item };

  const rows: Row[] = [];
  let fIdx = 0;

  for (let i = 0; i < standard.length; i++) {
    rows.push({ type: "service", item: standard[i] });

    const isBoundary =
      insertEvery > 0 && (i + 1) % insertEvery === 0 && i + 1 < standard.length;

    if (isBoundary) {
      // try to inject one ad row
      let ad: Item | null = null;
      if (fIdx < featured.length) {
        ad = featured[fIdx++];
      } else if (defaultFeatured) {
        ad = defaultFeatured;
      }
      if (ad) rows.push({ type: "ad", item: ad });
    }
  }

  // If we still have featured left after the last chunk, append one more
  if (fIdx < featured.length) {
    rows.push({ type: "ad", item: featured[fIdx++] });
  } else if (!rows.some((r) => r.type === "ad") && defaultFeatured) {
    // Optional: ensure at least one ad shows (remove this if you prefer not to force)
    rows.push({ type: "ad", item: defaultFeatured });
  }

  return (
    <div className={styles.listWrapper}>
      {rows.map((row) =>
        row.type === "service" ? (
          <Link
            key={`svc-${row.item.id}`}
            href={`/${citySlug}/services/${row.item.slug}`}
            className={`${styles.row} ${styles.serviceRow}`}
            aria-label={`${row.item.name}${
              row.item.companyName ? ` — ${row.item.companyName}` : ""
            }`}
          >
            <div className={styles.serviceMedia}>
              (
              <ServiceImage
                slug={row.item.slug}
                alt={`${row.item.name} image`}
                fill
                sizes="96px"
                className={styles.serviceImg}
              />
              )
            </div>

            <div className={styles.serviceBody}>
              <div className={styles.serviceTitle}>{row.item.name}</div>
              <div className={styles.serviceCompany}>
                {row.item.companyName ?? "No company linked"}
              </div>
            </div>
          </Link>
        ) : (
          <Link
            key={`ad-${row.item.id}-${row.item.slug}`}
            href={`/${citySlug}/services/${row.item.slug}`}
            className={`${styles.row} ${styles.adRow}`}
            aria-label={`${row.item.name}${
              row.item.companyName ? ` — ${row.item.companyName}` : ""
            }`}
          >
            <div className={styles.adBadge} aria-hidden="true">
              Sponsored
            </div>

            <div className={styles.adMedia}>
              {row.item.heroImage ? (
                <Image
                  src={row.item.heroImage}
                  alt={`${row.item.name} image`}
                  fill
                  sizes="(max-width: 640px) 90vw, 1120px"
                  className={styles.adImg}
                />
              ) : (
                <ServiceImage
                  slug={row.item.slug}
                  alt={`${row.item.name} image`}
                  fill
                  sizes="(max-width: 640px) 90vw, 1120px"
                  className={styles.adImg}
                  isAd
                />
              )}

              <div
                className={styles.adCaption}
                title={
                  row.item.companyName
                    ? `${row.item.name} — ${row.item.companyName}`
                    : row.item.name
                }
              >
                <span className={styles.adService}>{row.item.name}</span>
                {row.item.companyName && (
                  <>
                    <span className={styles.adDash}> — </span>
                    <span className={styles.adCompany}>
                      {row.item.companyName}
                    </span>
                  </>
                )}
              </div>
            </div>
          </Link>
        )
      )}
    </div>
  );
}
