// app/services/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import styles from "./services.module.css";

export const metadata = {
  title: "Services",
  description: "Browse all services.",
};

export const revalidate = 60;

// Default fallbacks for city-aware links from the generic index
const DEFAULT_REGION = "ab";
const DEFAULT_CITY = "calgary";

export default async function ServicesIndex() {
  const rows = await prisma.service.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    select: { slug: true, name: true, heroImage: true, id: true },
  });

  return (
    <main className={styles.wrap}>
      <h1 className={styles.title}>Services</h1>

      {rows.length === 0 ? (
        <p className={styles.empty}>
          No services yet. Add one in <code>/admin/services</code>.
        </p>
      ) : (
        <ul className={styles.list}>
          {rows.map((s) => (
            <li key={s.slug} className={styles.item}>
              <Link
                href={`/${DEFAULT_REGION}/${DEFAULT_CITY}/services/${s.slug}`}
                className={styles.card}
              >
                <div className={styles.cardTitle}>{s.name}</div>
                {/* If you want to show the hero image, add a small thumbnail block here */}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
