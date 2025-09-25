import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ServiceForm from "../../_components/ServiceForm";
import { updateServiceAction, deleteServiceAction } from "../../actions";
import styles from "../../services.module.css";

export default async function EditServicePage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (Number.isNaN(id)) notFound();

  const svc = await prisma.service.findUnique({ where: { id } });
  if (!svc) notFound();

  async function deleteAction() {
    "use server";
    await deleteServiceAction(id);
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.h1}>Edit Service</h1>
      <ServiceForm
        action={updateServiceAction.bind(null, id)}
        submitLabel="Save Changes"
        initial={{
          name: svc.name,
          slug: svc.slug,
          heroImage: svc.heroImage,
          order: svc.order,
        }}
      />
      <form action={deleteAction} style={{ marginTop: 24 }}>
        <button className={styles.deleteBtn} type="submit">
          Delete Service
        </button>
      </form>
    </main>
  );
}
