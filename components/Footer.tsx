import styles from "./Footer.module.css";
import Link from "next/link";
import Image from "next/image";
import SocialIcons from "./SocialIcons";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Brand */}
        <div className={styles.brand}>
          <Image
            src="/logo3.svg"
            alt="Give It Charm logo"
            width={40}
            height={40}
          />
          <span className={styles.brandName}>Give It Charm</span>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        {/* Social Icons */}
        <SocialIcons />

        {/* Meta */}
        <div className={styles.meta}>
          <span>© {new Date().getFullYear()} Give It Charm</span>
          <span>All Rights Reserved</span>
        </div>
      </div>
    </footer>
  );
}
