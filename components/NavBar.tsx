// components/NavBar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./NavBar.module.css";
import SocialIcons from "./SocialIcons";
import { usePathname } from "next/navigation";

const STATIC_PREFIXES = new Set([
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
const DEFAULT_CITY = "calgary";
const LOCAL_STORAGE_KEY = "home-improve:selected-city";

function readCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${name}=([^;]+)`, "i"),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function getStoredCity() {
  if (typeof window === "undefined") return null;
  return (
    window.localStorage.getItem(LOCAL_STORAGE_KEY) ||
    window.localStorage.getItem("preferred-city")
  );
}

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
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length) {
      const candidate = segments[0];
      if (!STATIC_PREFIXES.has(candidate)) {
        setCitySlug(candidate);
        return;
      }
    }
    const cookieCity = readCookie("preferred-city");
    const storedCity = getStoredCity();
    setCitySlug(cookieCity || storedCity || DEFAULT_CITY);
  }, [pathname]);

  const resolvedCity = citySlug || DEFAULT_CITY;
  const servicesHref = `/${resolvedCity}/services`;

  return (
    <header className={styles.sticky}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>
          <Image
            src="/logo-design.svg"
            alt="Give It Charm logo"
            width={182}
            height={30}
            priority
          />
        </Link>

        <div className={styles.menu}>
          <Link
            href={servicesHref}
            className={`${styles.link} ${styles.brandLink}`}
          >
            Services
          </Link>
          <Link href="/blog" className={`${styles.link} ${styles.brandLink}`}>
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
          <Link
            href={servicesHref}
            className={`${styles.drawerLink} ${styles.brandLink}`}
          >
            Services
          </Link>
          <Link
            href="/blog"
            className={`${styles.drawerLink} ${styles.brandLink}`}
          >
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
