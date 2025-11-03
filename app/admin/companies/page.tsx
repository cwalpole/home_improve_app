import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AdminSection from "../components/AdminSection";
import styles from "../admin.module.css";
import CreateCompanyModal from "./CreateCompanyModal";

export default async function CompaniesPage() {
  const companies = await prisma.company.findMany({ orderBy: { name: "asc" } });

  return (
    <AdminSection title="Companies" right={<CreateCompanyModal />}>
      {companies.length ? (
        <ul className={styles.companyList}>
          {companies.map((company) => (
            <li key={company.id} className={styles.companyListItem}>
              <Link
                href={`/admin/companies/${company.id}`}
                className={styles.companyCard}
              >
                <span className={styles.companyCardBody}>
                  <span className={styles.companyName}>{company.name}</span>
                  {company.url ? (
                    <span className={styles.companyUrl}>{company.url}</span>
                  ) : null}
                </span>
                <span className={styles.companyChevron}>→</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.emptyMessage}>
          No companies yet. Add your first partner to get started.
        </p>
      )}
    </AdminSection>
  );
}
