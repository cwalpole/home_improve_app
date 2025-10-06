// components/SwitchCity.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./SwitchCity.module.css";

type City = { name: string; slug: string };

export default function SwitchCity({
  current,
  cities,
  currentView = "grid",
}: {
  current: City;
  cities: City[];
  currentView?: "grid" | "list";
}) {
  const [open, setOpen] = useState(false);

  return (
    <span className={styles.inline}>
      <button
        type="button"
        className={styles.switchLink}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        · Switch City ·
      </button>

      {open && (
        <div className={styles.pop} role="listbox" aria-label="Choose a city">
          <div className={styles.popHead}>Select a city</div>
          <ul className={styles.list}>
            {cities.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`?city=${encodeURIComponent(
                    c.slug
                  )}&view=${currentView}#services`}
                  className={`${styles.cityItem} ${
                    c.slug === current.slug ? styles.current : ""
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </span>
  );
}
