import { prisma } from "@/lib/prisma";
import { createPlacement } from "./actions";
import styles from "./placements.module.css";

export const revalidate = 60;

export default async function PlacementsPage() {
  const [cities, services, companies] = await Promise.all([
    prisma.city.findMany({
      orderBy: [{ regionSlug: "asc" }, { name: "asc" }],
      select: { slug: true, regionSlug: true, name: true },
    }),
    prisma.service.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
      select: { slug: true, name: true },
    }),
    prisma.company.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  async function action(formData: FormData) {
    "use server";
    await createPlacement(formData);
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.h1}>Match Company to Service & City</h1>
      <form action={action} className={styles.form}>
        <label className={styles.label}>
          City
          <select name="citySlug" className={styles.select} required>
            {cities.map((c) => (
              <option
                key={`${c.regionSlug}/${c.slug}`}
                value={c.slug}
                data-region={c.regionSlug!}
              >
                {c.name} ({c.regionSlug})
              </option>
            ))}
          </select>
        </label>

        <label className={styles.label}>
          Region
          <select
            name="regionSlug"
            className={styles.select}
            defaultValue={cities[0]?.regionSlug ?? ""}
            required
          >
            {[...new Set(cities.map((c) => c.regionSlug!))].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.label}>
          Service
          <select name="serviceSlug" className={styles.select} required>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.label}>
          Company
          <select name="companyId" className={styles.select} required>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.inline}>
          <input type="checkbox" name="isFeatured" value="true" /> Featured
        </label>

        <label className={styles.label}>
          Display name (optional)
          <input
            name="displayName"
            className={styles.input}
            placeholder="Override company name for this listing"
          />
        </label>

        <div className={styles.row}>
          <button className={styles.btn} type="submit">
            Save placement
          </button>
        </div>
      </form>
    </main>
  );
}
