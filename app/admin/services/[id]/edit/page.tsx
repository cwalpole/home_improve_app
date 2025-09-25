import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ServiceForm from "../../_components/ServiceForm";
import { updateServiceAction, deleteServiceAction } from "../../actions";
import styles from "../../services.module.css";

type RouteParams = { id: string };

export default async function EditServicePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { id } = await params;
  const serviceId = Number(id);
  if (Number.isNaN(serviceId)) notFound();

  const svc = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!svc) notFound();

  async function deleteAction() {
    "use server";
    await deleteServiceAction(serviceId);
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.h1}>Edit Service</h1>
      <ServiceForm
        action={updateServiceAction.bind(null, serviceId)}
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
