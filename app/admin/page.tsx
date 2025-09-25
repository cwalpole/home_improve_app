import { prisma } from "@/lib/prisma";
import AdminSection from "./components/AdminSection";
import styles from "./admin.module.css";

export default async function AdminHome() {
  const [cities, services, companies, serviceCities, companyLinks] =
    await Promise.all([
      prisma.city.count(),
      prisma.service.count(),
      prisma.company.count(),
      prisma.serviceCity.count(),
      prisma.companyServiceCity.count(),
    ]);

  return (
    <>
      <AdminSection title="Overview">
        <div className={styles.statList}>
          <div className={styles.statItem}>
            <div className={styles.statValueCol}>
              <span className={styles.statValue}>{cities}</span>
            </div>
            <div className={styles.statLabelCol}>
              <span className={styles.statLabel}>Cities</span>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statValueCol}>
              <span className={styles.statValue}>{services}</span>
            </div>
            <div className={styles.statLabelCol}>
              <span className={styles.statLabel}>Services</span>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statValueCol}>
              <span className={styles.statValue}>{companies}</span>
            </div>
            <div className={styles.statLabelCol}>
              <span className={styles.statLabel}>Companies</span>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statValueCol}>
              <span className={styles.statValue}>{serviceCities}</span>
            </div>
            <div className={styles.statLabelCol}>
              <span className={styles.statLabel}>Service ↔ City mappings</span>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statValueCol}>
              <span className={styles.statValue}>{companyLinks}</span>
            </div>
            <div className={styles.statLabelCol}>
              <span className={styles.statLabel}>
                Company ↔ ServiceCity mappings
              </span>
            </div>
          </div>
        </div>
      </AdminSection>
    </>
  );
}
