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

  return (
    <>
      <AdminSection title="Map Service → City">
        <form action={mapServiceToCity} className={styles.formInline}>
          <select name="serviceId" className={styles.select} required>
            <option value="">Select Service (by URL value)</option>
            {services.map((s) => (
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
            <option value="">Select Service • City (by URL values)</option>
            {serviceCities.map((sc) => (
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
        {serviceCities.map((sc) => (
          <div
            key={sc.id}
            className={styles.section}
            style={{ marginBottom: 12 }}
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
                {sc.service.name} ({sc.service.slug}) — {sc.city.name} (
                {sc.city.slug})
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
              <p style={{ opacity: 0.7 }}>No companies mapped.</p>
            ) : (
              sc.listings.map((l) => (
                <Row key={`${l.companyId}-${sc.id}`}>
                  <div>
                    {l.displayName || l.company.name}{" "}
                    <span style={{ opacity: 0.6 }}>
                      {l.isFeatured ? "• Featured" : ""}
                    </span>
                  </div>
                  <form
                    action={async () => {
                      "use server";
                      await unmapCompanyFromServiceCity(l.companyId, sc.id);
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
      </AdminSection>
    </>
  );
}
