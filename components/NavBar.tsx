// components/NavBar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./NavBar.module.css";
import SocialIcons from "./SocialIcons";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [citySlug, setCitySlug] = useState<string | null>(null);
  const pathname = usePathname();

  // Close mobile menu on route change or hash scroll
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("hashchange", close);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("hashchange", close);
      window.removeEventListener("resize", close);
    };
  }, []);

  useEffect(() => {
    const staticPrefixes = new Set([
      "",
      "services",
      "blog",
      "admin",
      "api",
      "contact",
      "privacy",
      "terms",
      "search",
    ]);
    const segments = pathname.split("/").filter(Boolean);
    if (!segments.length) {
      setCitySlug(null);
      return;
    }
    const candidate = segments[0];
    if (staticPrefixes.has(candidate)) {
      setCitySlug(null);
      return;
    }
    setCitySlug(candidate);
  }, [pathname]);

  const servicesHref = citySlug ? `/${citySlug}/services` : "/services";

  return (
    <header className={styles.sticky}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>
          <Image
            src="/logo-svg.svg"
            alt="Give It Charm logo"
            width={60}
            height={60}
            priority
          />
          <span className={styles.brandText}>Give It Charm</span>
        </Link>

        <div className={styles.menu}>
          <Link href={servicesHref} className={styles.link}>
            Services
          </Link>
          <Link href="/blog" className={styles.link}>
            Blog
          </Link>
        </div>

        {/* Right: Search + Socials (desktop) */}
        <div className={styles.right}>
          <form action="/search" className={styles.searchForm}>
            <input
              name="q"
              type="search"
              placeholder="Search…"
              className={styles.searchInput}
              aria-label="Search"
            />
          </form>

          <SocialIcons />
        </div>

        {/* Hamburger (mobile) */}
        <button
          className={styles.burger}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Mobile drawer */}
        <div className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}>
          <Link href={servicesHref} className={styles.drawerLink}>
            Services
          </Link>
          <Link href="/blog" className={styles.drawerLink}>
            Blog
          </Link>

          <form action="/search" className={styles.drawerSearch}>
            <input
              name="q"
              type="search"
              placeholder="Search…"
              className={styles.searchInput}
            />
          </form>

          <div className={styles.drawerSocials}>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.icon}
              aria-label="Facebook"
            >
              F
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.icon}
              aria-label="Instagram"
            >
              I
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.icon}
              aria-label="Pinterest"
            >
              P
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
