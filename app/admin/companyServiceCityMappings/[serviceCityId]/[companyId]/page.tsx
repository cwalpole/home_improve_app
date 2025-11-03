import { prisma } from "@/lib/prisma";
import AdminSection from "../../../components/AdminSection";
import styles from "../../../admin.module.css";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { unmapCompanyFromServiceCity } from "../../../actions/mappings";
import { unstable_noStore as noStore } from "next/cache";
import CompanyServiceCityFeatureForm from "../../CompanyServiceCityFeatureForm";

export default async function CompanyServiceCityMappingDetailPage(props: {
  params: Promise<{ serviceCityId: string; companyId: string }>;
}) {
  noStore();
  const { serviceCityId, companyId } = await props.params;
  const scId = Number(serviceCityId);
  const cId = Number(companyId);
  if (!scId || !cId) notFound();

  const serviceCity = await prisma.serviceCity.findUnique({
    where: { id: scId },
    include: {
      city: { select: { id: true, name: true, slug: true } },
      service: { select: { id: true, name: true, slug: true } },
      listings: {
        where: { companyId: cId },
        select: {
          companyId: true,
          company: { select: { id: true, name: true } },
          displayName: true,
          isFeatured: true,
        },
        take: 1,
      },
    },
  });

  if (!serviceCity || !serviceCity.listings.length) {
    notFound();
  }

  const listing = serviceCity.listings[0];

  return (
    <AdminSection
      title={`Mapping · ${listing.company.name} → ${serviceCity.service.name} (${serviceCity.city.name})`}
      right={
        <Link
          className={`${styles.btn} ${styles.secondary}`}
          href="/admin/companyServiceCityMappings"
        >
          ← Back to list
        </Link>
      }
    >
      <div className={styles.detailCard}>
        <div style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
          <div>
            Service: <strong>{serviceCity.service.name}</strong> (
            {serviceCity.service.slug})
          </div>
          <div>
            City: <strong>{serviceCity.city.name}</strong> (
            {serviceCity.city.slug})
          </div>
          <div>
            Company: <strong>{listing.company.name}</strong>
          </div>
        </div>

        <CompanyServiceCityFeatureForm
          serviceCityId={serviceCity.id}
          companyId={listing.companyId}
          isFeatured={listing.isFeatured}
        />

        <form
          action={async () => {
            "use server";
            await unmapCompanyFromServiceCity(
              listing.companyId,
              serviceCity.id
            );
            redirect("/admin/companyServiceCityMappings");
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
