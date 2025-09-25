import { prisma } from "@/lib/prisma";
import AdminSection from "../components/AdminSection";
import Row from "../components/Row";
import styles from "../admin.module.css";
import CreateCityForm from "./CreateCityForm";
import UpdateCityForm from "./UpdateCityForm";
import { deleteCityById } from "../actions/cities";

export default async function CitiesPage() {
  const items = await prisma.city.findMany({ orderBy: { name: "asc" } });

  return (
    <>
      <AdminSection title="Create City">
        <CreateCityForm />
      </AdminSection>

      <AdminSection title="Cities">
        {items.map((c) => (
          <Row key={c.id}>
            <div>
              {c.name} <span style={{ opacity: 0.6 }}>(/{c.slug})</span>
            </div>

            <UpdateCityForm
              id={c.id}
              name={c.name}
              slug={c.slug}
              regionCode={c.regionCode}
            />

            {/* Delete form — inline server action (your requested style) */}
            <form
              action={async () => {
                "use server";
                await deleteCityById(c.id);
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
