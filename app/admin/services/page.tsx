import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AdminSection from "../components/AdminSection";
import styles from "../admin.module.css";
import CreateServiceModal from "./CreateServiceModal";
import { unstable_noStore as noStore } from "next/cache";

export default async function ServicesPage() {
  noStore();
  const services = await prisma.service.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });

  return (
    <AdminSection title="Services" right={<CreateServiceModal />}>
      {services.length ? (
        <ul className={styles.companyList}>
          {services.map((service) => (
            <li key={service.id} className={styles.companyListItem}>
              <Link
                href={`/admin/services/${service.id}`}
                className={styles.companyCard}
              >
                <span className={styles.companyCardBody}>
                  <span className={styles.companyName}>{service.name}</span>
                  <span className={styles.companyUrl}>/{service.slug}</span>
                </span>
                <span className={styles.companyChevron}>→</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.emptyMessage}>
          No services yet. Add your first service to begin mapping providers.
        </p>
      )}
    </AdminSection>
  );
}
