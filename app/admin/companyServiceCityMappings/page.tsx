import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AdminSection from "../components/AdminSection";
import styles from "../admin.module.css";
import { unstable_noStore as noStore } from "next/cache";
import CreateCompanyServiceCityMappingModal from "./CreateCompanyServiceCityMappingModal";

export default async function CompanyServiceCityMappingsPage(props: {
  searchParams?: Promise<{ city?: string }>;
}) {
  noStore();
  const sp = (await props.searchParams) ?? {};
  const selectedCitySlug = (sp.city || "").toLowerCase();

  const [companies, serviceCities] = await Promise.all([
    prisma.company.findMany({ orderBy: { name: "asc" } }),
    prisma.serviceCity.findMany({
      orderBy: [{ cityId: "asc" }],
      include: {
        city: { select: { id: true, name: true, slug: true } },
        service: { select: { id: true, name: true, slug: true } },
        listings: {
          include: { company: { select: { id: true, name: true } } },
          orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }],
        },
      },
    }),
  ]);

  const vacantServiceCities = serviceCities.filter((sc) => sc.listings.length === 0);
  const mappings = serviceCities.flatMap((sc) =>
    sc.listings.map((listing) => ({
      serviceCityId: sc.id,
      service: sc.service,
      city: sc.city,
      company: listing.company,
      displayName: listing.displayName,
      isFeatured: listing.isFeatured,
    }))
  );

  const filteredMappings = selectedCitySlug
    ? mappings.filter((mapping) => mapping.city.slug === selectedCitySlug)
    : mappings;

  const filteredVacantServiceCities = selectedCitySlug
    ? vacantServiceCities.filter((sc) => sc.city.slug === selectedCitySlug)
    : vacantServiceCities;

  const uniqueCities = Array.from(
    new Map(serviceCities.map((sc) => [sc.city.id, sc.city])).values()
  ).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <AdminSection
      title="Company → Service · City mappings"
      right={
        <CreateCompanyServiceCityMappingModal
          companies={companies}
          serviceCities={filteredVacantServiceCities.map((sc) => ({
            id: sc.id,
            service: sc.service,
            city: sc.city,
          }))}
        />
      }
    >
      <form
        method="get"
        className={`${styles.formInline} ${styles.filterControls}`}
        style={{ marginBottom: 16 }}
      >
        <select name="city" className={styles.select} defaultValue={selectedCitySlug}>
          <option value="">All cities</option>
          {uniqueCities.map((city) => (
            <option key={city.id} value={city.slug}>
              {city.name}
            </option>
          ))}
        </select>
        <button className={styles.btn} type="submit">
          Filter
        </button>
        {selectedCitySlug ? (
          <Link className={`${styles.btn} ${styles.secondary}`} href="/admin/companyServiceCityMappings">
            Clear
          </Link>
        ) : null}
      </form>

      {filteredMappings.length ? (
        <ul className={styles.companyList}>
          {filteredMappings
            .sort((a, b) => {
              const cityCompare = a.city.name.localeCompare(b.city.name);
              if (cityCompare !== 0) return cityCompare;
              const serviceCompare = a.service.name.localeCompare(b.service.name);
              if (serviceCompare !== 0) return serviceCompare;
              return a.company.name.localeCompare(b.company.name);
            })
            .map((mapping) => (
              <li
                key={`${mapping.serviceCityId}-${mapping.company.id}`}
                className={styles.companyListItem}
              >
                <Link
                  href={`/admin/companyServiceCityMappings/${mapping.serviceCityId}/${mapping.company.id}`}
                  className={styles.companyCard}
                >
                  <span className={styles.companyCardBody}>
                    <span className={styles.companyName}>
                      {mapping.company.name}
                    </span>
                    <span className={styles.companyUrl}>
                      {mapping.service.slug} / {mapping.city.slug}
                      {mapping.isFeatured ? " · Featured" : ""}
                    </span>
                  </span>
                  <span className={styles.companyChevron}>→</span>
                </Link>
              </li>
            ))}
        </ul>
      ) : (
        <p className={styles.emptyMessage}>
          {selectedCitySlug
            ? "No company mappings for the selected city."
            : "No company mappings yet."}
        </p>
      )}
    </AdminSection>
  );
}
