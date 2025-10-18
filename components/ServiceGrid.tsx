"use client";

import { useEffect, useMemo, useState } from "react";
import ServiceCard from "./ServiceCard";
import styles from "./ServiceGrid.module.css";
import ServiceImage from "./ServiceImage";
import Link from "next/link";
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
  services: Item[];
  citySlug: string;
};

/** 6→5→4→3→2→1 */
function useResponsiveCols() {
  const [cols, setCols] = useState<number>(1);
  useEffect(() => {
    const m1536 = window.matchMedia("(min-width: 1536px)");
    const m1280 = window.matchMedia("(min-width: 1280px)");
    const m1024 = window.matchMedia("(min-width: 1024px)");
    const m768 = window.matchMedia("(min-width: 768px)");
    const m480 = window.matchMedia("(min-width: 480px)");
    const compute = () => {
      if (m1536.matches) return 6;
      if (m1280.matches) return 5;
      if (m1024.matches) return 4;
      if (m768.matches) return 3;
      if (m480.matches) return 2;
      return 1;
    };
    const update = () => setCols(compute());
    update();
    const mqls = [m1536, m1280, m1024, m768, m480];
    mqls.forEach((m) => m.addEventListener("change", update));
    return () => mqls.forEach((m) => m.removeEventListener("change", update));
  }, []);
  return cols;
}

export default function ServiceGrid({ services, citySlug }: Props) {
  const cols = useResponsiveCols();

  const featured = useMemo(
    () => services.filter((s) => !!s.featured),
    [services]
  );
  const standard = useMemo(
    () =>
      services
        .filter((s) => !s.featured)
        .slice()
        .sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
        ),
    [services]
  );

  // chunk standard into rows of `cols` for stability
  const stdRows = useMemo(() => {
    const out: Item[][] = [];
    for (let i = 0; i < standard.length; i += cols) {
      out.push(standard.slice(i, i + cols));
    }
    return out;
  }, [standard, cols]);

  // Featured uses its own stronger card, still in a grid
  return (
    <div className={styles.gridWrapper}>
      <FeaturedPicks citySlug={citySlug} items={featured} />

      <section aria-label="All services">
        <header className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>All services</h3>
        </header>

        <div className={styles.rows}>
          {stdRows.map((row, idx) => (
            <div
              key={`row-${idx}`}
              className={styles.row}
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
              {row.map((svc) => (
                <ServiceCard
                  key={svc.id}
                  href={`/${citySlug}/services/${svc.slug}`}
                  service={{
                    name: svc.name,
                    slug: svc.slug, // no heroImage
                  }}
                  companyName={svc.companyName ?? "No company linked"}
                />
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
