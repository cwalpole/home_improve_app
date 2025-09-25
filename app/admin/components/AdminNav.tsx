import Link from "next/link";
import styles from "../admin.module.css";

export default function AdminNav() {
  return (
    <nav className={styles.nav}>
      <Link href="/admin/cities" className={styles.link}>
        Cities
      </Link>
      <Link href="/admin/services" className={styles.link}>
        Services
      </Link>
      <Link href="/admin/companies" className={styles.link}>
        Companies
      </Link>
      <Link href="/admin/mappings" className={styles.link}>
        Mappings
      </Link>
    </nav>
  );
}
