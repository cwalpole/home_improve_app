"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import homeStyles from "@/app/home.module.css";
import styles from "./CityGate.module.css";
import { Marcellus_SC } from "next/font/google";

type City = { name: string; slug: string };

const STORAGE_KEY = "home-improve:selected-city";

type State = "checking" | "prompt";

const marcellus = Marcellus_SC({
  subsets: ["latin"],
  weight: "400",
});

export default function CityGate({ cities }: { cities: City[] }) {
  const router = useRouter();
  const [state, setState] = useState<State>("checking");
  const [selection, setSelection] = useState<string>("");

  const highlights = [
    {
      title: "Curated local pros",
      copy: "Licensed, insured specialists vetted for craftsmanship, communication, and care.",
    },
    {
      title: "Personal project concierge",
      copy: "We match you with the right team, coordinate timelines, and keep you in the loop.",
    },
    {
      title: "Transparent pricing",
      copy: "Expect clear quotes, realistic timelines, and zero surprises from first call to finish.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Tell us about your home",
      copy: "Share your project wish list and schedule so we understand what a great outcome looks like.",
    },
    {
      number: "02",
      title: "Meet your perfect pro",
      copy: "We connect you with a trusted local crew, align on scope, and tailor the plan to your space.",
    },
    {
      number: "03",
      title: "Relax — we handle the rest",
      copy: "Enjoy consistent updates, tidy job sites, and workmanship backed by our quality promise.",
    },
  ];

  const testimonials = [
    {
      quote:
        "The team respected our home, stuck to the schedule, and the project manager checked in every step of the way.",
      name: "Taylor M.",
      city: "Calgary",
    },
    {
      quote:
        "Faster responses and better quality than any contractor I’ve hired before. I’m already planning the next project.",
      name: "Priya S.",
      city: "Edmonton",
    },
    {
      quote:
        "They made a big reno feel easy. Transparent pricing, gorgeous results, and zero stress.",
      name: "Jordan K.",
      city: "Vancouver",
    },
  ];

  const heroStats = [
    {
      title: "4.9 ★ rating",
      desc: "Average homeowner feedback across partnered cities.",
    },
    {
      title: "48 hour quotes",
      desc: "Get tailored plans fast, aligned with your schedule.",
    },
    {
      title: "Local experts",
      desc: "Licensed, insured crews ready for every project size.",
    },
  ];

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
        <div className={homeStyles.heroContent}>
          <div className={homeStyles.heroCopy}>
            <h1 className={`${homeStyles.heroTitle} ${marcellus.className}`}>
              Your Home, Our priority
            </h1>
            <p className={`${homeStyles.heroLead} ${marcellus.className}`}>
              Making Homes Shine, One Service at a Time
            </p>
            <div className={homeStyles.heroActions}>
              <button
                type="button"
                className={homeStyles.heroPrimary}
                onClick={() => {
                  setSelection("");
                  setState("prompt");
                }}
              >
                View local services
              </button>
              <a href="#how-it-works" className={homeStyles.heroSecondary}>
                See how it works
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className={homeStyles.trustStrip}>
        <div className={homeStyles.trustInner}>
          <div className={styles.trustCopy}>
            Great homes start with great partners. We blend craftsmanship,
            communication, and care for every project.
          </div>
        </div>
      </section>

      <section className={homeStyles.highlights}>
        <div className={homeStyles.sectionIntro}>
          <span className={homeStyles.sectionEyebrow}>The home advantage</span>
          <h2>Everything you need for projects done right</h2>
          <p>
            From the first conversation to the final walk-through, we design a
            better renovation and maintenance experience.
          </p>
        </div>
        <div className={homeStyles.highlightGrid}>
          {highlights.map((item) => (
            <article key={item.title} className={homeStyles.highlightCard}>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className={homeStyles.process}>
        <div className={homeStyles.sectionIntro}>
          <span className={homeStyles.sectionEyebrow}>How it works</span>
          <h2>Relax — we’ll guide every step</h2>
          <p>
            We simplify the process with transparent planning, proactive
            updates, and pros who respect your home.
          </p>
        </div>
        <ol className={homeStyles.processList}>
          {steps.map((step) => (
            <li key={step.number} className={homeStyles.processItem}>
              <span className={homeStyles.processNumber}>{step.number}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={homeStyles.testimonials}>
        <div className={homeStyles.sectionIntro}>
          <span className={homeStyles.sectionEyebrow}>Happy homeowners</span>
          <h2>Stories from projects we’re proud of</h2>
          <p>
            Real people, real renovations. We’re lucky to partner with
            homeowners who expect more.
          </p>
        </div>
        <div className={homeStyles.testimonialGrid}>
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className={homeStyles.testimonialCard}
            >
              <blockquote>“{testimonial.quote}”</blockquote>
              <figcaption>
                {testimonial.name} · {testimonial.city}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className={homeStyles.closingCta}>
        <div className={homeStyles.closingContent}>
          <h2>Let’s make your next project effortless</h2>
          <p>
            Share your city, tell us what you’re planning, and we’ll curate the
            right team with a plan tailored to your home.
          </p>
          <button
            type="button"
            className={homeStyles.heroPrimary}
            onClick={() => {
              setSelection("");
              setState("prompt");
            }}
          >
            Get matched with a pro
          </button>
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
