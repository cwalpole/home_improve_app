export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import styles from "./services.module.css";

export default async function ServicesListPage() {
  let services: { id: number; name: string; slug: string }[] = [];
  try {
    services = await prisma.service.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });
  } catch {
    services = []; // DB not initialized yet; render an empty state instead of crashing build
  }
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.h1}>Services</h1>
        <Link className={styles.newBtn} href="/admin/services/new">
          + New Service
        </Link>
      </div>
      <ul className={styles.list}>
        {services.map((s) => (
          <li key={s.id} className={styles.item}>
            <Link href={`/admin/services/${s.id}/edit`} className={styles.link}>
              {s.name}
            </Link>
            <code className={styles.slug}>{s.slug}</code>
          </li>
        ))}
      </ul>
    </main>
  );
}
