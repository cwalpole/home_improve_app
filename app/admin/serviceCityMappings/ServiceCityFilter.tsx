"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import styles from "../admin.module.css";

type CityOption = {
  id: number;
  name: string;
  slug: string;
};

export default function ServiceCityFilter(props: {
  cities: CityOption[];
  selectedCitySlug: string;
}) {
  const { cities, selectedCitySlug } = props;
  const router = useRouter();
  const [, startTransition] = useTransition();

  const handleChange = (value: string) => {
    startTransition(() => {
      if (value) {
        router.push(`/admin/serviceCityMappings?city=${value}`);
      } else {
        router.push("/admin/serviceCityMappings");
      }
    });
  };

  return (
    <div
      className={`${styles.formInline} ${styles.filterControls}`}
      style={{ marginBottom: 16, width: "fit-content" }}
    >
      <select
        name="city"
        className={styles.select}
        defaultValue={selectedCitySlug}
        onChange={(event) => handleChange(event.target.value)}
      >
        <option value="">All cities</option>
        {cities.map((city) => (
          <option key={city.id} value={city.slug}>
            {city.name}
          </option>
        ))}
      </select>
      {selectedCitySlug ? (
        <Link className={`${styles.btn} ${styles.secondary}`} href="/admin/serviceCityMappings">
          Clear
        </Link>
      ) : null}
    </div>
  );
}
