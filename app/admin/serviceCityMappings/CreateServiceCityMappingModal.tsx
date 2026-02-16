"use client";

import { useState } from "react";
import styles from "../admin.module.css";
import HtmlEditor from "../components/HtmlEditor";
import { mapServiceToCity } from "../actions/mappings";

type CityOption = { id: number; name: string; slug: string };
type ServiceOption = { id: number; name: string; slug: string };

type Props = {
  services: ServiceOption[];
  cities: CityOption[];
};

export default function CreateServiceCityMappingModal({ services, cities }: Props) {
  const [open, setOpen] = useState(false);
  const hasServices = services.length > 0;

  return (
    <>
      <button className={styles.btn} type="button" onClick={() => setOpen(true)}>
        + Map Service → City
      </button>

      {open ? (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
          <div className={styles.modalPanel}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Create service → city mapping</h3>
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <p className={styles.modalDescription}>
              Select a service and city to create or update the mapping content.
            </p>

            <form action={mapServiceToCity} className={styles.modalForm}>
              <select name="serviceId" className={styles.select} required disabled={!hasServices}>
                <option value="">
                  {hasServices ? "Select Service" : "All services mapped"}
                </option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {s.slug}
                  </option>
                ))}
              </select>

              <select name="cityId" className={styles.select} required>
                <option value="">Select City</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.slug}
                  </option>
                ))}
              </select>

              <HtmlEditor
                id="service-city-modal-content"
                name="contentHtml"
                label="Service page content (optional)"
                placeholder="Paste or write HTML content that should appear on the service page."
                helpText="Leave blank to use the default template."
              />

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.secondary}`}
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button className={styles.btn} type="submit" disabled={!hasServices}>
                  Save Mapping
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
