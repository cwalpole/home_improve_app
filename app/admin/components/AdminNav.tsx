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
      <div className={styles.groupRule} aria-hidden="true" />
      <div className={styles.groupLabel}>Subscriptions</div>
      <Link href="/admin/subscriptions" className={styles.link}>
        Plans
      </Link>
      <Link href="/admin/subscriptions/current" className={styles.link}>
        Current Subscriptions
      </Link>
      <div className={styles.groupRule} aria-hidden="true" />
      <div className={styles.groupLabel}>Mappings</div>
      <Link href="/admin/serviceCityMappings" className={styles.link}>
        Service ↔ City
      </Link>
      <Link href="/admin/companyServiceCityMappings" className={styles.link}>
        Company ↔ ServiceCity
      </Link>
      <div className={styles.groupRule} aria-hidden="true" />
      <Link href="/admin/blogs" className={styles.link}>
        Blogs
      </Link>
      <div className={styles.groupRule} aria-hidden="true" />
      <form method="post" action="/api/auth/logout" className={styles.logoutForm}>
        <button type="submit" className={`${styles.link} ${styles.logoutButton}`}>
          Logout
        </button>
      </form>
    </nav>
  );
}
