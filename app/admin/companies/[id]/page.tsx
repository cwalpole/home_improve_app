import { prisma } from "@/lib/prisma";
import AdminSection from "../../components/AdminSection";
import UpdateCompanyForm from "../UpdateCompanyForm";
import styles from "../../admin.module.css";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { deleteCompany } from "../../actions/companies";

export default async function CompanyDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const companyId = Number(id);

  if (!companyId) {
    notFound();
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: { id: true, name: true, url: true, createdAt: true },
  });

  if (!company) {
    notFound();
  }

  return (
    <AdminSection
      title={`Company · ${company.name}`}
      right={
        <Link className={`${styles.btn} ${styles.secondary}`} href="/admin/companies">
          ← Back to list
        </Link>
      }
    >
      <div className={styles.detailCard}>
        <UpdateCompanyForm
          id={company.id}
          name={company.name}
          url={company.url}
        />

        <form
          action={async () => {
            "use server";
            await deleteCompany(company.id);
            redirect("/admin/companies");
          }}
        >
          <button type="submit" className={`${styles.btn} ${styles.danger}`}>
            Delete company
          </button>
        </form>
      </div>
    </AdminSection>
  );
}
