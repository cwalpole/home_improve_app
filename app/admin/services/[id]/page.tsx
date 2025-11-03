import { prisma } from "@/lib/prisma";
import AdminSection from "../../components/AdminSection";
import UpdateServiceForm from "../UpdateServiceForm";
import styles from "../../admin.module.css";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { deleteService } from "../../actions/services";
import { unstable_noStore as noStore } from "next/cache";

export default async function ServiceDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  noStore();
  const { id } = await props.params;
  const serviceId = Number(id);

  if (!serviceId) {
    notFound();
  }

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  if (!service) {
    notFound();
  }

  return (
    <AdminSection
      title={`Service · ${service.name}`}
      right={
        <Link className={`${styles.btn} ${styles.secondary}`} href="/admin/services">
          ← Back to list
        </Link>
      }
    >
      <div className={styles.detailCard}>
        <UpdateServiceForm
          id={service.id}
          name={service.name}
          slug={service.slug}
        />

        <form
          action={async () => {
            "use server";
            await deleteService(service.id);
            redirect("/admin/services");
          }}
        >
          <button type="submit" className={`${styles.btn} ${styles.danger}`}>
            Delete service
          </button>
        </form>
      </div>
    </AdminSection>
  );
}
