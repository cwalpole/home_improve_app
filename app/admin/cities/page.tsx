import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AdminSection from "../components/AdminSection";
import styles from "../admin.module.css";
import CreateCityModal from "./CreateCityModal";

export default async function CitiesPage() {
  const cities = await prisma.city.findMany({ orderBy: { name: "asc" } });

  return (
    <AdminSection title="Cities" right={<CreateCityModal />}>
      {cities.length ? (
        <ul className={styles.companyList}>
          {cities.map((city) => (
            <li key={city.id} className={styles.companyListItem}>
              <Link
                href={`/admin/cities/${city.id}`}
                className={styles.companyCard}
              >
                <span className={styles.companyCardBody}>
                  <span className={styles.companyName}>{city.name}</span>
                  <span className={styles.companyUrl}>/{city.slug}</span>
                </span>
                <span className={styles.companyChevron}>→</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.emptyMessage}>
          No cities yet. Add your first city to begin mapping services.
        </p>
      )}
    </AdminSection>
  );
}
