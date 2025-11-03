"use client";

import { useState } from "react";
import styles from "../admin.module.css";
import { mapCompanyToServiceCity } from "../actions/mappings";

type CompanyOption = { id: number; name: string };
type ServiceCityOption = {
  id: number;
  service: { name: string; slug: string };
  city: { name: string; slug: string };
};

type Props = {
  companies: CompanyOption[];
  serviceCities: ServiceCityOption[];
};

export default function CreateCompanyServiceCityMappingModal({
  companies,
  serviceCities,
}: Props) {
  const [open, setOpen] = useState(false);
  const hasPairs = serviceCities.length > 0;

  return (
    <>
      <button className={styles.btn} type="button" onClick={() => setOpen(true)}>
        + Map Company → ServiceCity
      </button>

      {open ? (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
          <div className={styles.modalPanel}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Create company mapping</h3>
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
              Assign a company to a service-city pair.
            </p>

            <form action={mapCompanyToServiceCity} className={styles.formInline} style={{ flexDirection: "column", gap: 12 }}>
              <select name="companyId" className={styles.select} required>
                <option value="">Select company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>

              <select name="serviceCityId" className={styles.select} required disabled={!hasPairs}>
                <option value="">
                  {hasPairs ? "Select service · city" : "No unassigned service · city pairs"}
                </option>
                {serviceCities.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.service.slug} — {sc.city.slug}
                  </option>
                ))}
              </select>

              <input
                name="displayName"
                placeholder="Display name (optional)"
                className={styles.input}
              />
              <select name="isFeatured" className={styles.select}>
                <option value="false">Featured: No</option>
                <option value="true">Featured: Yes</option>
              </select>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.secondary}`}
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button className={styles.btn} type="submit" disabled={!hasPairs}>
                  Save mapping
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
