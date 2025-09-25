import { prisma } from "@/lib/prisma";
import AdminSection from "../components/AdminSection";
import Row from "../components/Row";
import styles from "../admin.module.css";
import CreateServiceForm from "./CreateServiceForm";
import UpdateServiceForm from "./UpdateServiceForm";
import { deleteService } from "../actions/services";

export default async function ServicesPage() {
  const items = await prisma.service.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });

  return (
    <>
      <AdminSection title="Create Service">
        <CreateServiceForm />
      </AdminSection>

      <AdminSection title="Services">
        {items.map((s) => (
          <Row key={s.id}>
            <div>
              {s.name} <span style={{ opacity: 0.6 }}>(/{s.slug})</span>
            </div>

            <UpdateServiceForm
              id={s.id}
              name={s.name}
              slug={s.slug}
              order={s.order}
            />

            <form
              action={async () => {
                "use server";
                await deleteService(s.id);
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
