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
            src="/logo-design.svg"
            alt="Give It Charm logo"
            width={160}
            height={26}
          />
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        {/* Social Icons */}
        <div className={styles.footerSocials}>
          <SocialIcons />
        </div>

        {/* Meta */}
        <div className={styles.meta}>
          <span>© {new Date().getFullYear()} Give It Charm</span>
          <span>All Rights Reserved</span>
        </div>
      </div>
    </footer>
  );
}
