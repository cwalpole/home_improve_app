import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AdminSection from "../components/AdminSection";
import styles from "../admin.module.css";
import { unstable_noStore as noStore } from "next/cache";
import CreateServiceCityMappingModal from "./CreateServiceCityMappingModal";

export default async function ServiceCityMappingsPage(props: {
  searchParams?: Promise<{ city?: string }>;
}) {
  noStore();
  const sp = (await props.searchParams) ?? {};
  const selectedCitySlug = (sp.city || "").toLowerCase();

  const [cities, services, serviceCities] = await Promise.all([
    prisma.city.findMany({ orderBy: { name: "asc" } }),
    prisma.service.findMany({ orderBy: { name: "asc" } }),
    prisma.serviceCity.findMany({
      orderBy: [{ cityId: "asc" }],
      include: {
        city: { select: { id: true, name: true, slug: true } },
        service: { select: { id: true, name: true, slug: true } },
      },
    }),
  ]);

  const totalCityCount = cities.length;
  const serviceToCityCount = new Map<number, number>();
  for (const sc of serviceCities) {
    serviceToCityCount.set(
      sc.service.id,
      (serviceToCityCount.get(sc.service.id) ?? 0) + 1
    );
  }

  const fullyMappedServiceIds = new Set(
    Array.from(serviceToCityCount.entries())
      .filter(([, count]) => count >= totalCityCount)
      .map(([serviceId]) => serviceId)
  );

  const selectableServices = services.filter(
    (s) => !fullyMappedServiceIds.has(s.id)
  );

  const filteredServiceCities = selectedCitySlug
    ? serviceCities.filter((sc) => sc.city.slug === selectedCitySlug)
    : serviceCities;

  return (
    <AdminSection
      title="Service → City mappings"
      right={<CreateServiceCityMappingModal services={selectableServices} cities={cities} />}
    >
      <form
        method="get"
        className={`${styles.formInline} ${styles.filterControls}`}
        style={{ marginBottom: 16 }}
      >
        <select name="city" className={styles.select} defaultValue={selectedCitySlug}>
          <option value="">All cities</option>
          {cities.map((city) => (
            <option key={city.id} value={city.slug}>
              {city.name}
            </option>
          ))}
        </select>
        <button className={styles.btn} type="submit">
          Filter
        </button>
        {selectedCitySlug ? (
          <Link className={`${styles.btn} ${styles.secondary}`} href="/admin/serviceCityMappings">
            Clear
          </Link>
        ) : null}
      </form>

      {filteredServiceCities.length ? (
        <ul className={styles.companyList}>
          {filteredServiceCities
            .sort((a, b) => {
              const cityCompare = a.city.name.localeCompare(b.city.name);
              if (cityCompare !== 0) return cityCompare;
              return a.service.name.localeCompare(b.service.name);
            })
            .map((sc) => (
              <li key={sc.id} className={styles.companyListItem}>
                <Link
                  href={`/admin/serviceCityMappings/${sc.id}`}
                  className={styles.companyCard}
                >
                  <span className={styles.companyCardBody}>
                    <span className={styles.companyName}>
                      {sc.service.name} · {sc.city.name}
                    </span>
                    <span className={styles.companyUrl}>
                      {sc.service.slug} / {sc.city.slug}
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
            ? "No service-city mappings for the selected city."
            : "No service-city mappings yet."}
        </p>
      )}
    </AdminSection>
  );
}
