"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import homeStyles from "@/app/home.module.css";
import styles from "./CityGate.module.css";

type City = { name: string; slug: string };

const STORAGE_KEY = "home-improve:selected-city";

type State = "checking" | "prompt";

export default function CityGate({ cities }: { cities: City[] }) {
  const router = useRouter();
  const [state, setState] = useState<State>("checking");
  const [selection, setSelection] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      router.replace(`/${stored}`);
    } else {
      setState("prompt");
    }
  }, [router]);

  const handleConfirm = (slug: string) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, slug);
    }
    router.replace(`/${slug}`);
  };

  return (
    <main className={homeStyles.main}>
      <section className={homeStyles.hero}>
        <div className={homeStyles.heroBg} aria-hidden="true" />
        <div className={homeStyles.heroInner}>
          <div className={homeStyles.title}>Your Home, Our priority</div>
          <div className={homeStyles.subtitle}>
            Making Homes Shine, One Service at a Time
          </div>
        </div>
      </section>

      {state === "prompt" ? (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <header className={styles.modalHeader}>
              <h2>Select your city</h2>
              <p>
                Choose the city you call home so we can tailor services and
                providers to your area.
              </p>
            </header>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>City</span>
              <select
                className={styles.select}
                value={selection}
                onChange={(e) => setSelection(e.target.value)}
              >
                <option value="">Select a city…</option>
                {cities.map((city) => (
                  <option key={city.slug} value={city.slug}>
                    {city.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className={styles.confirmBtn}
              onClick={() => selection && handleConfirm(selection)}
              disabled={!selection}
            >
              Continue
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
