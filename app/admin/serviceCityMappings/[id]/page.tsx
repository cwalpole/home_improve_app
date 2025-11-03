import { prisma } from "@/lib/prisma";
import AdminSection from "../../components/AdminSection";
import styles from "../../admin.module.css";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import HtmlEditor from "../../components/HtmlEditor";
import {
  unmapServiceFromCity,
  updateServiceCityContent,
} from "../../actions/mappings";
import { unstable_noStore as noStore } from "next/cache";

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

        <form action={updateServiceCityContent} className={styles.contentForm}>
          <input type="hidden" name="serviceCityId" value={mapping.id} />
          <HtmlEditor
            id={`service-city-${mapping.id}-content-detail`}
            name="contentHtml"
            label="Service page content"
            defaultValue={mapping.contentHtml ?? ""}
            placeholder="Paste or write HTML content that should appear on the service page."
            helpText="Remove all content to fall back to the default template."
          />
          <div className={styles.formActions}>
            <button className={styles.btn} type="submit">
              Save content
            </button>
          </div>
        </form>

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
