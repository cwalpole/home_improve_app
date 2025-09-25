import { prisma } from "@/lib/prisma";
import AdminSection from "../components/AdminSection";
import Row from "../components/Row";
import styles from "../admin.module.css";
import CreateCompanyForm from "./CreateCompanyForm";
import UpdateCompanyForm from "./UpdateCompanyForm";
import { deleteCompany } from "../actions/companies";

export default async function CompaniesPage() {
  const items = await prisma.company.findMany({ orderBy: { name: "asc" } });

  return (
    <>
      <AdminSection title="Create Company">
        <CreateCompanyForm />
      </AdminSection>

      <AdminSection title="Companies">
        {items.map((c) => (
          <Row key={c.id}>
            <div>
              {c.name}{" "}
              <span style={{ opacity: 0.6 }}>{c.url ? `(${c.url})` : ""}</span>
            </div>

            <UpdateCompanyForm id={c.id} name={c.name} url={c.url} />

            <form
              action={async () => {
                "use server";
                await deleteCompany(c.id);
              }}
            >
              <button
                className={`${styles.btn} ${styles.secondary}`}
                type="submit"
              >
                Delete
              </button>
            </form>
          </Row>
        ))}
      </AdminSection>
    </>
  );
}
