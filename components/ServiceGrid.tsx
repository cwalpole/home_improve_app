"use client";

import { useEffect, useMemo, useState } from "react";
import ServiceCard from "./ServiceCard";
import styles from "./ServiceGrid.module.css";

export type Item = {
  id: number;
  name: string;
  slug: string;
  heroImage: string | null;
  companyName: string | null;
};

type Props = {
  /** All services (can include featured) — we’ll filter duplicates out */
  services: Item[];

  /** Zero or more featured items; consumed top→down across the grid */
  featured?: Item[];

  /** Optional fallback if a row has exactly one featured left */
  defaultFeatured?: Item | null;

  citySlug: string;
};

/** Map viewport to odd-row column count: 6→5→4→3→2→1 */
function useOddRowCols() {
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

export default function ServiceGrid({
  services,
  featured = [],
  defaultFeatured = null,
  citySlug,
}: Props) {
  const cols = useOddRowCols();

  // Remove featured items from standard list (avoid duplicates)
  const featuredIds = useMemo(
    () => new Set(featured.map((f) => f.id)),
    [featured]
  );
  const standard = useMemo(
    () => services.filter((s) => !featuredIds.has(s.id)),
    [services, featuredIds]
  );

  // Slice standard into rows of `cols`
  const stdRows = useMemo(() => {
    const out: Item[][] = [];
    if (cols <= 0) return out;
    for (let i = 0; i < standard.length; i += cols) {
      out.push(standard.slice(i, i + cols));
    }
    return out;
  }, [standard, cols]);

  // Interleave: std row → (0..1 featured row) → std row → ...
  const rows = useMemo(() => {
    const r: Array<{ type: "std" | "featured"; items: Item[] }> = [];
    let fIdx = 0;

    for (let i = 0; i < stdRows.length; i++) {
      // standard row
      r.push({ type: "std", items: stdRows[i] });

      // try to add one featured row using up to 2 featured items
      const left = featured.length - fIdx;
      if (left <= 0) continue; // none left → skip featured row

      const first = featured[fIdx++];
      let second: Item | null = null;

      if (fIdx < featured.length) {
        second = featured[fIdx++];
      } else if (defaultFeatured) {
        second = defaultFeatured;
      }

      r.push({ type: "featured", items: second ? [first, second] : [first] });
    }

    return r;
  }, [stdRows, featured, defaultFeatured]);

  return (
    <div className={styles.gridWrapper}>
      {rows.map((row, idx) =>
        row.type === "std" ? (
          <div
            key={`std-${idx}`}
            className={styles.rowStd}
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {row.items.map((item) => (
              <ServiceCard
                key={`std-${idx}-${item.id}`}
                href={`/${citySlug}/services/${item.slug}`}
                service={{
                  name: item.name,
                  slug: item.slug,
                  heroImage: item.heroImage ?? undefined,
                }}
                companyName={item.companyName ?? "No company linked"}
              />
            ))}
          </div>
        ) : (
          <div key={`feat-${idx}`} className={styles.rowFeatured}>
            {row.items.map((item) => (
              <ServiceCard
                key={`feat-${idx}-${item.id}`}
                href={`/${citySlug}/services/${item.slug}`}
                service={{
                  name: item.name,
                  slug: item.slug,
                  heroImage: item.heroImage ?? undefined,
                }}
                companyName={item.companyName ?? "No company linked"}
                isAd
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}
