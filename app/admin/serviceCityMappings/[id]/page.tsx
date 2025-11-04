import { prisma } from "@/lib/prisma";
import AdminSection from "../../components/AdminSection";
import styles from "../../admin.module.css";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  unmapServiceFromCity,
} from "../../actions/mappings";
import { unstable_noStore as noStore } from "next/cache";
import ServiceCityContentForm from "../ServiceCityContentForm";

export default async function ServiceCityMappingDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  noStore();
  const { id } = await props.params;
  const mappingId = Number(id);
  if (!mappingId) notFound();

  const mapping = await prisma.serviceCity.findUnique({
    where: { id: mappingId },
    include: {
      city: { select: { id: true, name: true, slug: true } },
      service: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!mapping) notFound();

  return (
    <AdminSection
      title={`Mapping · ${mapping.service.name} → ${mapping.city.name}`}
      right={
        <Link
          className={`${styles.btn} ${styles.secondary}`}
          href="/admin/serviceCityMappings"
        >
          ← Back to list
        </Link>
      }
    >
      <div className={styles.detailCard}>
        <div style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
          <div>
            Service: <strong>{mapping.service.name}</strong> ({mapping.service.slug})
          </div>
          <div>
            City: <strong>{mapping.city.name}</strong> ({mapping.city.slug})
          </div>
        </div>

        <ServiceCityContentForm
          mappingId={mapping.id}
          defaultContent={mapping.contentHtml}
        />

        <form
          action={async () => {
            "use server";
            await unmapServiceFromCity(mapping.id);
            redirect("/admin/serviceCityMappings");
          }}
        >
          <button type="submit" className={`${styles.btn} ${styles.danger}`}>
            Delete mapping
          </button>
        </form>
      </div>
    </AdminSection>
  );
}
