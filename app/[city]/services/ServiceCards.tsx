"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ServiceImage from "@/components/ServiceImage";
import styles from "./ServicesPage.module.css";

type ServiceCard = {
  name: string;
  slug: string;
  heroImage: string | null;
  contentHtml: string | null;
  summaryText: string;
};

type Props = {
  citySlug: string;
  services: ServiceCard[];
};

function buildExcerpt(text: string, max = 160) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

export default function ServiceCards({ citySlug, services }: Props) {
  const [active, setActive] = useState<ServiceCard | null>(null);

  const summaries = useMemo(() => {
    const map = new Map<string, string>();
    services.forEach((service) => {
      const raw = service.summaryText || "";
      map.set(service.slug, raw ? buildExcerpt(raw) : "");
    });
    return map;
  }, [services]);

  return (
    <>
      <div className={styles.grid}>
        {services.map((service) => {
          const excerpt = summaries.get(service.slug) || "";
          return (
            <article key={service.slug} className={styles.card}>
              <div className={styles.cardMedia}>
                <ServiceImage
                  slug={service.slug}
                  alt={`${service.name} hero`}
                  fill
                  sizes="(max-width: 768px) 90vw, (max-width: 1200px) 33vw, 280px"
                  className={styles.cardImage}
                />
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{service.name}</h3>
                {excerpt ? (
                  <p className={styles.cardSummary}>{excerpt}</p>
                ) : (
                  <p className={styles.cardSummary}>
                    Service details are coming soon.
                  </p>
                )}
                <div className={styles.cardActions}>
                  {service.contentHtml ? (
                    <button
                      type="button"
                      className={styles.readMore}
                      onClick={() => setActive(service)}
                    >
                      Overview
                    </button>
                  ) : (
                    <span />
                  )}
                  <Link
                    href={`/${citySlug}/services/${service.slug}`}
                    className={styles.cardLink}
                  >
                    View
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {active ? (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>{active.name}</h3>
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setActive(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div
              className={styles.modalBody}
              dangerouslySetInnerHTML={{ __html: active.contentHtml || "" }}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
