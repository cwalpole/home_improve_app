import { prisma } from "@/lib/prisma";
import styles from "../home.module.css";
import Section from "@/components/Section";
import Link from "next/link";
import ServiceList from "@/components/ServiceList";
import SwitchCity from "@/components/SwitchCity";

type GridItem = {
  id: number;
  name: string;
  slug: string;
  heroImage: string | null;
  companyName: string | null;
  featured: boolean;
};

export default async function CityHomePage(props: {
  params: Promise<{ city: string }>;
}) {
  const { city: cityParam } = await props.params;
  const selectedCitySlug = cityParam.toLowerCase();

  const [city, cities] = await Promise.all([
    prisma.city.findUnique({
      where: { slug: selectedCitySlug },
      select: { id: true, name: true, slug: true },
    }),
    prisma.city.findMany({
      select: { name: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!city) {
    return (
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroBg} aria-hidden="true" />
          <div className={styles.heroContent}>
            <div className={styles.heroCopy}>
              <span className={styles.heroEyebrow}>City not found</span>
              <h1 className={styles.heroTitle}>Let’s get you to the right spot</h1>
              <p className={styles.heroLead}>
                We couldn’t locate that city. Head back to the home page to pick
                another location and explore services tailored to your area.
              </p>
              <div className={styles.heroActions}>
                <Link href="/" className={styles.heroSecondary}>
                  Choose a different city
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Section
          id="services"
          title="Services"
          desc="No city selected or city not found."
          right={<Link href="/services">All services →</Link>}
        >
          <p>Set up cities and mappings in the Admin, or pick another city.</p>
        </Section>
      </main>
    );
  }

  const services = await prisma.service.findMany({
    where: { serviceCities: { some: { cityId: city.id } } },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      heroImage: true,
      serviceCities: {
        where: { cityId: city.id },
        select: {
          listings: {
            orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }],
            take: 1,
            select: {
              isFeatured: true,
              displayName: true,
              company: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  const allServices: GridItem[] = services.map((s) => {
    const top = s.serviceCities?.[0]?.listings?.[0] ?? null;
    const companyName = top?.displayName ?? top?.company?.name ?? null;
    const featured = Boolean(top?.isFeatured);
    return {
      id: s.id,
      name: s.name,
      slug: s.slug,
      heroImage: s.heroImage ?? null,
      companyName,
      featured,
    };
  });

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

  const highlights = [
    {
      title: "Neighborhood expertise",
      copy: `We partner with professionals who live and work in ${city.name}, so your project benefits from local knowledge.`,
    },
    {
      title: "Curated service lineup",
      copy: "From emergency repairs to dream renovations, discover vetted specialists ready when you are.",
    },
    {
      title: "Seamless coordination",
      copy: "We streamline planning, updates, and timelines so you can relax while the work gets done.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: `Share your ${city.name} project`,
      copy: "Tell us what you’re tackling, from timelines to must-haves. We’ll capture every detail.",
    },
    {
      number: "02",
      title: "Meet your local pro",
      copy: "We pair you with the right specialist, align on scope, and build a plan tailored to your home.",
    },
    {
      number: "03",
      title: "Enjoy the finished result",
      copy: "Stay in the loop with proactive updates and enjoy workmanship backed by our quality promise.",
    },
  ];

  const testimonials = [
    {
      quote:
        "Our kitchen refresh stayed on schedule and the team left the space spotless every day. Couldn’t ask for better.",
      name: "Morgan R.",
    },
    {
      quote:
        "Transparent quotes and friendly crews. We’ve already recommended them to neighbors on our street.",
      name: "Elena & Marcus L.",
    },
    {
      quote:
        "It felt like a concierge experience. They handled the details so we could focus on the family.",
      name: "Jia H.",
    },
  ];

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={styles.heroContent}>
          <div className={styles.heroCopy}>
            <h1 className={styles.heroTitle}>
              Perfectly finished projects, locally crafted for your home
            </h1>
            <p className={styles.heroLead}>
              Match with vetted specialists across renovations, repairs, and
              seasonal upkeep. We handle the legwork so you can enjoy a smoother,
              better-looking home.
            </p>
            <div className={styles.heroActions}>
              <a href="#services" className={styles.heroPrimary}>
                View local services
              </a>
              <a href="#how-it-works" className={styles.heroSecondary}>
                See how it works
              </a>
            </div>
          </div>
          <dl className={styles.heroStats}>
            {heroStats.map((stat) => (
              <div key={stat.title}>
                <dt>{stat.title}</dt>
                <dd>{stat.desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={styles.trustStrip}>
        <div className={styles.trustInner}>
          <div className={styles.trustCopy}>
            Great homes start with great partners. We blend craftsmanship,
            communication, and care for every project.
          </div>
        </div>
      </section>

      <section className={styles.highlights}>
        <div className={styles.sectionIntro}>
          <span className={styles.sectionEyebrow}>Why homeowners choose us</span>
          <h2>Everything you need to get projects done right</h2>
          <p>
            From emergency fixes to dream renovations, we bring curated expertise
            and concierge-level support to {city.name}.
          </p>
        </div>
        <div className={styles.highlightGrid}>
          {highlights.map((item) => (
            <article key={item.title} className={styles.highlightCard}>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <Section
        id="services"
        title={
          <>
            Services in {city.name}
            <SwitchCity current={{ name: city.name, slug: city.slug }} cities={cities} />
          </>
        }
        desc="Explore the categories locals trust most across the city."
        right={
          <Link href={`/${city.slug}/services`} className={styles.sectionLink}>
            All services →
          </Link>
        }
      >
        <ServiceList citySlug={city.slug} services={allServices} />
      </Section>

      <section id="how-it-works" className={styles.process}>
        <div className={styles.sectionIntro}>
          <span className={styles.sectionEyebrow}>How it works</span>
          <h2>Local pros, smooth delivery</h2>
          <p>
            We coordinate estimates, scheduling, and updates while you stay focused
            on the results.
          </p>
        </div>
        <ol className={styles.processList}>
          {steps.map((step) => (
            <li key={step.number} className={styles.processItem}>
              <span className={styles.processNumber}>{step.number}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.testimonials}>
        <div className={styles.sectionIntro}>
          <span className={styles.sectionEyebrow}>Loved by locals</span>
          <h2>What {city.name} homeowners are saying</h2>
          <p>
            We’re proud to help neighbors transform their spaces with trusted pros
            who deliver on promises.
          </p>
        </div>
        <div className={styles.testimonialGrid}>
          {testimonials.map((testimonial) => (
            <figure key={testimonial.name} className={styles.testimonialCard}>
              <blockquote>“{testimonial.quote}”</blockquote>
              <figcaption>{testimonial.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className={styles.closingCta}>
        <div className={styles.closingContent}>
          <h2>Ready to start your next {city.name} project?</h2>
          <p>
            Pick a service, tell us what you need, and we’ll connect you with the
            right team sooner than you think.
          </p>
          <a href="#services" className={styles.heroPrimary}>
            Explore services
          </a>
        </div>
      </section>
    </main>
  );
}
