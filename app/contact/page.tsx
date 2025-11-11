import type { Metadata } from "next";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Partner With Us | Give It Charm",
  description:
    "Future providers can learn how to join the Give It Charm network and contact our partnerships team.",
};

const benefits = [
  {
    title: "Consistent, high-quality work",
    copy:
      "We coordinate estimates, scheduling, and homeowner updates so you can stay focused on craft and crew management.",
  },
  {
    title: "Transparent collaboration",
    copy:
      "You’ll always know the scope, budget, and timeline expectations before a project kicks off.",
  },
  {
    title: "Community exposure",
    copy:
      "Your business appears in curated city pages, newsletters, and recommendation lists seen by motivated homeowners.",
  },
];

const requirements = [
  "Licensed and insured in the provinces you serve",
  "Demonstrated track record of craftsmanship and communication",
  "Ability to provide references or portfolio of recent work",
  "Agreement to Give It Charm’s service and communication standards",
];

export default function ContactPage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1>Join the Give It Charm Provider Network</h1>
        <p>
          We’re always looking for renovation, repair, and specialty crews who
          care about homeowners as much as we do. Tell us about your craft, your
          coverage area, and how we can build amazing projects together.
        </p>
      </section>

      <section className={styles.grid}>
        {benefits.map((item) => (
          <article key={item.title} className={styles.card}>
            <h2>{item.title}</h2>
            <p>{item.copy}</p>
          </article>
        ))}
      </section>

      <section className={styles.card}>
        <h2>What we look for</h2>
        <p>
          Give It Charm partners with specialists who deliver premium work,
          communicate clearly, and respect every home they enter. If that sounds
          like your team, we’d love to hear from you.
        </p>
        <ul className={styles.list}>
          {requirements.map((req) => (
            <li key={req}>{req}</li>
          ))}
        </ul>
      </section>

      <section className={styles.contactBlock}>
        <h3>Ready to start?</h3>
        <p>
          Email our partnerships team with your company details, core services,
          service area, and any supporting links (portfolio, certifications,
          etc.). We respond within two business days.
        </p>
        <a className={styles.contactLink} href="mailto:partners@giveitcharm.com">
          partners@giveitcharm.com
        </a>
        <p>
          Prefer a call? Leave your number in the email and we’ll schedule a
          time that works for you.
        </p>
      </section>
    </main>
  );
}
