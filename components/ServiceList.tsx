"use client";

import Link from "next/link";
import styles from "./ServiceList.module.css";
import FeaturedPicks from "./FeaturedPicks";
import ServiceImage from "./ServiceImage";

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
    .slice()
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );

  type LogoColor = "blue" | "green" | "black";
  type RenderItem =
    | { kind: "service"; item: Item; key: string }
    | { kind: "logo"; key: string; color: LogoColor; spanFull?: boolean };

  const buildPattern = (
    pattern: Array<"svc" | LogoColor>,
    spanFullLogo = false
  ): RenderItem[] => {
    const items: RenderItem[] = [];
    let svcIndex = 0;
    while (svcIndex < standard.length) {
      for (const slot of pattern) {
        if (slot === "svc") {
          if (svcIndex < standard.length) {
            const svc = standard[svcIndex++];
            items.push({ kind: "service", item: svc, key: `svc-${svc.id}` });
          }
        } else {
          items.push({
            kind: "logo",
            key: `logo-${items.length}`,
            color: slot as LogoColor,
            spanFull: spanFullLogo,
          });
        }
      }
    }
    return items;
  };

  // Desktop: blue, svc, svc, green, svc, svc, black
  const desktopItems: RenderItem[] = [];
  const desktopPattern: Array<"svc" | LogoColor> = [
    "blue",
    "svc",
    "svc",
    "green",
    "svc",
    "svc",
    "black",
  ];
  {
    let svcIndex = 0;
    while (svcIndex < standard.length) {
      const rowItems: RenderItem[] = [];
      let servicesInRow = 0;
      for (const slot of desktopPattern) {
        if (slot === "svc") {
          if (svcIndex < standard.length) {
            const svc = standard[svcIndex++];
            rowItems.push({ kind: "service", item: svc, key: `svc-${svc.id}` });
            servicesInRow += 1;
          }
        } else {
          rowItems.push({
            kind: "logo",
            key: `logo-${desktopItems.length + rowItems.length}`,
            color: slot,
          });
        }
      }
      // If this final row only has 2 or 3 services, drop the last logo
      if (servicesInRow >= 2 && servicesInRow <= 3) {
        for (let i = rowItems.length - 1; i >= 0; i--) {
          if (rowItems[i].kind === "logo") {
            rowItems.splice(i, 1);
            break;
          }
        }
      }
      desktopItems.push(...rowItems);
    }
  }

  // Tablet: row1 svc svc blue svc svc, row2 svc svc green svc svc (repeat)
  const tabletItems: RenderItem[] = [];
  {
    const rowPatterns: Array<Array<"svc" | LogoColor>> = [
      ["svc", "svc", "blue", "svc", "svc"],
      ["svc", "svc", "green", "svc", "svc"],
    ];
    let svcIndex = 0;
    let row = 0;
    while (svcIndex < standard.length) {
      const pattern = rowPatterns[row % rowPatterns.length];
      let servicesInRow = 0;
      const rowItems: RenderItem[] = [];
      for (const slot of pattern) {
        if (slot === "svc") {
          if (svcIndex < standard.length) {
            const svc = standard[svcIndex++];
            rowItems.push({ kind: "service", item: svc, key: `svc-${svc.id}` });
            servicesInRow += 1;
          }
        } else {
          // only place a logo if the row already has at least one service
          if (servicesInRow > 0) {
            rowItems.push({
              kind: "logo",
              key: `logo-${tabletItems.length + rowItems.length}`,
              color: slot,
            });
          }
        }
      }
      // only add the row if we placed at least one service
      if (servicesInRow > 0) {
        tabletItems.push(...rowItems);
      } else {
        break;
      }
      row += 1;
    }
  }

  // Mobile: blue (centered), svc, svc, green (centered), svc, svc (repeat)
  const mobilePattern: Array<"svc" | LogoColor> = [
    "blue",
    "svc",
    "svc",
    "green",
    "svc",
    "svc",
  ];
  const mobileItems = buildPattern(mobilePattern, true);

  return (
    <div>
      <FeaturedPicks citySlug={citySlug} items={featured} />

      <section className={styles.section} aria-label="All services">
        <div className={styles.gridDesktop}>
          {desktopItems.map((entry) =>
            entry.kind === "logo" ? (
              <div
                className={`${styles.logoCard} ${
                  entry.color === "blue"
                    ? styles.logoBlue
                    : entry.color === "green"
                      ? styles.logoGreen
                      : styles.logoBlack
                }`}
                key={entry.key}
                aria-hidden="true"
              >
                <span className={styles.logoMaskSmall} />
              </div>
            ) : (
              <Link
                key={entry.key}
                href={`/${citySlug}/services/${entry.item.slug}`}
                className={styles.card}
                aria-label={`${entry.item.name}${
                  entry.item.companyName ? ` — ${entry.item.companyName}` : ""
                }`}
              >
                <div className={styles.bodySolo}>
                  <div className={styles.serviceThumb} aria-hidden="true">
                    <ServiceImage
                      slug={entry.item.slug}
                      alt={`${entry.item.name} image`}
                      width={92}
                      height={72}
                      className={styles.serviceImg}
                      sizes="120px"
                    />
                  </div>
                  <h4 className={styles.title}>{entry.item.name}</h4>
                </div>
              </Link>
            )
          )}
        </div>

        <div className={styles.gridTablet}>
          {tabletItems.map((entry) =>
            entry.kind === "logo" ? (
              <div
                className={`${styles.logoCard} ${
                  entry.color === "blue"
                    ? styles.logoBlue
                    : entry.color === "green"
                      ? styles.logoGreen
                      : styles.logoBlack
                }`}
                key={entry.key}
                aria-hidden="true"
              >
                <span className={styles.logoMaskSmall} />
              </div>
            ) : (
              <Link
                key={entry.key}
                href={`/${citySlug}/services/${entry.item.slug}`}
                className={styles.card}
                aria-label={`${entry.item.name}${
                  entry.item.companyName ? ` — ${entry.item.companyName}` : ""
                }`}
              >
                <div className={styles.bodySolo}>
                  <div className={styles.serviceThumb} aria-hidden="true">
                    <ServiceImage
                      slug={entry.item.slug}
                      alt={`${entry.item.name} image`}
                      width={92}
                      height={72}
                      className={styles.serviceImg}
                      sizes="120px"
                    />
                  </div>
                  <h4 className={styles.title}>{entry.item.name}</h4>
                </div>
              </Link>
            )
          )}
        </div>

        <div className={styles.gridMobile}>
          {mobileItems.map((entry) =>
            entry.kind === "logo" ? (
              <div
                className={`${styles.logoCard} ${
                  entry.color === "blue"
                    ? styles.logoBlue
                    : entry.color === "green"
                      ? styles.logoGreen
                      : styles.logoBlack
                } ${entry.spanFull ? styles.logoFullRow : ""}`}
                key={entry.key}
                aria-hidden="true"
              >
                <span className={styles.logoMaskSmall} />
              </div>
            ) : (
              <Link
                key={entry.key}
                href={`/${citySlug}/services/${entry.item.slug}`}
                className={styles.card}
                aria-label={`${entry.item.name}${
                  entry.item.companyName ? ` — ${entry.item.companyName}` : ""
                }`}
              >
                <div className={styles.bodySolo}>
                  <div className={styles.serviceThumb} aria-hidden="true">
                    <ServiceImage
                      slug={entry.item.slug}
                      alt={`${entry.item.name} image`}
                      width={92}
                      height={72}
                      className={styles.serviceImg}
                      sizes="120px"
                    />
                  </div>
                  <h4 className={styles.title}>{entry.item.name}</h4>
                </div>
              </Link>
            )
          )}
        </div>
      </section>
    </div>
  );
}
