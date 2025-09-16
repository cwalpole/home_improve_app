import Link from "next/link";
import { prisma } from "@/lib/prisma";
import styles from "./services.module.css";

export const metadata = {
  title: "Services",
  description: "All construction and renovation services we offer.",
};

export const revalidate = 60;

export default async function ServicesIndex() {
  const rows = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <main className={styles.wrap}>
      <h1 className={styles.title}>Services</h1>

      {rows.length === 0 ? (
        <p className={styles.empty}>
          No services yet. Add one in /admin/services.
        </p>
      ) : (
        <ul className={styles.list}>
          {rows.map((s) => (
            <li key={s.slug} className={styles.item}>
              <Link href={`/services/${s.slug}`} className={styles.card}>
                <div className={styles.cardTitle}>{s.title}</div>
                {s.excerpt ? (
                  <p className={styles.cardExcerpt}>{s.excerpt}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
