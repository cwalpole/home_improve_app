import Link from "next/link";
import styles from "./admin.module.css";
import AdminNav from "./components/AdminNav";

export const dynamic = "force-dynamic"; // always fresh for admin

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <aside className={styles.aside}>
        <Link href="/admin" className={styles.brand}>
          Admin Dashboard
        </Link>
        <AdminNav />
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
