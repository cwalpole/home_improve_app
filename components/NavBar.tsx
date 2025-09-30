// components/NavBar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./NavBar.module.css";

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

          <div className={styles.socials} aria-label="Social media">
            {/* Simple SVG icons (replace hrefs with your profiles) */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.icon}
              aria-label="Facebook"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
              >
                <path d="M22 12.06C22 6.48 17.52 2 11.94 2S2 6.48 2 12.06c0 5 3.66 9.14 8.44 9.94v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.19 2.24.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.77l-.44 2.9h-2.33v7.03C18.34 21.2 22 17.06 22 12.06z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.icon}
              aria-label="Instagram"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
              >
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3.5A5.5 5.5 0 1 1 6.5 13 5.51 5.51 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zm5.75-2.75a1.25 1.25 0 1 1-1.25 1.25 1.25 1.25 0 0 1 1.25-1.25z" />
              </svg>
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.icon}
              aria-label="Pinterest"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
              >
                <path d="M12.04 2C6.55 2 3 5.71 3 10.12c0 2.45 1.36 5.5 3.54 6.46.33.15.52.08.6-.22.06-.23.21-.81.28-1.05.09-.22.05-.31-.13-.51-.7-.81-1.14-1.86-1.14-3.35 0-4.31 3.25-8.18 8.45-8.18 4.6 0 7.79 2.81 7.79 6.83 0 4.84-2.38 8.2-5.47 8.2-1.71 0-2.99-1.41-2.58-3.15.49-2.06 1.43-4.28 1.43-5.77 0-1.33-.71-2.44-2.18-2.44-1.73 0-3.12 1.79-3.12 4.19 0 1.53.52 2.56.52 2.56l-1.99 8.44c-.59 2.49.07 5.55.12 5.85.03.18.25.24.36.09.15-.19 2.06-2.56 2.7-4.94.18-.64 1.04-3.99 1.04-3.99.51.97 1.99 1.81 3.58 1.81 4.71 0 7.91-4.12 7.91-9.61C21.96 5.41 17.64 2 12.04 2z" />
              </svg>
            </a>
          </div>
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
