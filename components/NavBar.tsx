// components/NavBar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./NavBar.module.css";
import SocialIcons from "./SocialIcons";

export default function NavBar() {
  const [open, setOpen] = useState(false);

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

  // Smooth-scroll to #services if already on home; otherwise go home#services
  function handleServicesClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const onHome = window.location.pathname === "/";
    if (onHome) {
      e.preventDefault();
      const el = document.getElementById("services");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setOpen(false);
      } else {
        // Fallback to hash if element not present yet
        window.location.hash = "services";
      }
    }
  }

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
          <Link
            href="/#services"
            onClick={handleServicesClick}
            className={styles.link}
          >
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
          <Link
            href="/#services"
            onClick={handleServicesClick}
            className={styles.drawerLink}
          >
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
