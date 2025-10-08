import { prisma } from "@/lib/prisma";
import AdminSection from "../components/AdminSection";
import Row from "../components/Row";
import styles from "../admin.module.css";
import {
  mapServiceToCity,
  unmapServiceFromCity,
  mapCompanyToServiceCity,
  unmapCompanyFromServiceCity,
} from "../actions/mappings";

export default async function MappingsPage() {
  const [cities, services, serviceCities, companies] = await Promise.all([
    prisma.city.findMany({ orderBy: { name: "asc" } }),
    prisma.service.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] }),
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
    prisma.company.findMany({ orderBy: { name: "asc" } }),
  ]);

  // Services mapped count per serviceId
  const totalCityCount = cities.length;
  const serviceToCityCount = new Map<number, number>();
  for (const sc of serviceCities) {
    serviceToCityCount.set(
      sc.service.id,
      (serviceToCityCount.get(sc.service.id) ?? 0) + 1
    );
  }

  // Services already mapped to ALL cities
  const fullyMappedServiceIds = new Set(
    Array.from(serviceToCityCount.entries())
      .filter(([, count]) => count >= totalCityCount)
      .map(([serviceId]) => serviceId)
  );

  // Only show services that are NOT fully mapped everywhere
  const selectableServices = services.filter(
    (s) => !fullyMappedServiceIds.has(s.id)
  );

  // Only allow selecting Service•City pairs that have no company mapped yet
  const vacantServiceCities = serviceCities.filter(
    (sc) => sc.listings.length === 0
  );

  return (
    <>
      <AdminSection title="Map Service → City">
        <form action={mapServiceToCity} className={styles.formInline}>
          <select name="serviceId" className={styles.select} required>
            <option value="">
              {selectableServices.length
                ? "Select Service (by URL value)"
                : "All services are mapped to every city"}
            </option>
            {selectableServices.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.slug}
              </option>
            ))}
          </select>

          <select name="cityId" className={styles.select} required>
            <option value="">Select City (by URL value)</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.slug}
              </option>
            ))}
          </select>
          <button className={styles.btn}>Map</button>
        </form>
      </AdminSection>

      <AdminSection title="Map Company → ServiceCity">
        <form action={mapCompanyToServiceCity} className={styles.formInline}>
          <select name="companyId" className={styles.select} required>
            <option value="">Select Company</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select name="serviceCityId" className={styles.select} required>
            <option value="">
              {vacantServiceCities.length
                ? "Select Service • City (unassigned only)"
                : "No unassigned Service • City pairs"}
            </option>
            {vacantServiceCities.map((sc) => (
              <option key={sc.id} value={sc.id}>
                {sc.service.slug} — {sc.city.slug}
              </option>
            ))}
          </select>

          <input
            name="displayName"
            placeholder="Display name (optional)"
            className={styles.input}
          />
          <select name="isFeatured" className={styles.select}>
            <option value="false">Featured: No</option>
            <option value="true">Featured: Yes</option>
          </select>
          <button className={styles.btn}>Map</button>
        </form>
      </AdminSection>

      <AdminSection title="Current Mappings">
        {Object.values(
          serviceCities.reduce<
            Record<
              number,
              {
                city: { id: number; name: string; slug: string };
                items: typeof serviceCities;
              }
            >
          >((acc, sc) => {
            const key = sc.city.id;
            if (!acc[key]) acc[key] = { city: sc.city, items: [] as any };
            acc[key].items.push(sc);
            return acc;
          }, {})
        )
          .sort((a, b) => a.city.name.localeCompare(b.city.name))
          .map(({ city, items }) => (
            <details key={city.id} className={styles.cityGroup} open>
              <summary className={styles.citySummary}>
                <span>
                  {city.name}{" "}
                  <span className={styles.citySlug}>({city.slug})</span>
                </span>
                <span className={styles.cityMeta}>
                  {items.length} service{items.length !== 1 ? "s" : ""}
                </span>
              </summary>

              <div className={styles.cityBody}>
                {items
                  .sort((a, b) => a.service.name.localeCompare(b.service.name))
                  .map((sc) => (
                    <div
                      key={sc.id}
                      className={styles.section}
                      style={{ margin: "10px 0 14px" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <strong>
                          {sc.service.name}{" "}
                          <span style={{ opacity: 0.65 }}>
                            ({sc.service.slug})
                          </span>
                        </strong>

                        <form
                          action={async () => {
                            "use server";
                            await unmapServiceFromCity(sc.id);
                          }}
                        >
                          <button
                            className={`${styles.btn} ${styles.secondary}`}
                            type="submit"
                          >
                            Unmap Service↔City
                          </button>
                        </form>
                      </div>

                      {sc.listings.length === 0 ? (
                        <p style={{ opacity: 0.7, marginTop: 4 }}>
                          No companies mapped.
                        </p>
                      ) : (
                        sc.listings.map((l) => (
                          <Row key={`${l.companyId}-${sc.id}`}>
                            <div>
                              {l.displayName || l.company.name}{" "}
                              {l.isFeatured && (
                                <span style={{ opacity: 0.6 }}>• Featured</span>
                              )}
                            </div>
                            <form
                              action={async () => {
                                "use server";
                                await unmapCompanyFromServiceCity(
                                  l.companyId,
                                  sc.id
                                );
                              }}
                            >
                              <button
                                className={`${styles.btn} ${styles.secondary}`}
                                type="submit"
                              >
                                Remove
                              </button>
                            </form>
                          </Row>
                        ))
                      )}
                    </div>
                  ))}
              </div>
            </details>
          ))}
      </AdminSection>
    </>
  );
}
