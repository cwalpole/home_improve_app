import { prisma } from "@/lib/prisma";
import styles from "../home.module.css";
import Section from "@/components/Section";
import Link from "next/link";
import ServiceList from "@/components/ServiceList";
import SwitchCity from "@/components/SwitchCity";
import { Marcellus_SC } from "next/font/google";

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
              <h1 className={styles.heroTitle}>
                Let’s get you to the right spot
              </h1>
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
      title: "4.9 ★ Rating",
      desc: "Average homeowner feedback across partnered cities.",
    },
    {
      title: "48 Hour Quotes",
      desc: "Get tailored plans fast, aligned with your schedule.",
    },
    {
      title: "Local Experts",
      desc: "Licensed, insured crews ready for every project size.",
    },
  ];

  const highlights = [
    {
      title: "Neighborhood Expertise",
      copy: `We partner with professionals who live and work in ${city.name}, so your project benefits from local knowledge.`,
    },
    {
      title: "Curated Service Lineup",
      copy: "From emergency repairs to dream renovations, discover vetted specialists ready when you are.",
    },
    {
      title: "Seamless Coordination",
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

  const blogPosts = [
    {
      title: `Seasonal checklist for ${city.name} homeowners`,
      excerpt:
        "From gutter maintenance to HVAC tune-ups, here’s how to keep your home feeling fresh year-round.",
      date: "May 28, 2024",
      category: "Guides",
    },
    {
      title: "Inside a whole-home refresh with our lead designer",
      excerpt:
        "We sat down with Avery Chang to walk through material selections, color palettes, and layout wins.",
      date: "June 4, 2024",
      category: "Spotlight",
    },
    {
      title: "3 questions to ask every contractor before signing",
      excerpt:
        "Protect your timeline and budget with these conversation starters from our project concierge team.",
      date: "June 12, 2024",
      category: "Tips",
    },
  ];

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={styles.heroContent}>
          <div className={styles.heroCopy}>
            <h1 className={`${styles.heroTitle} ${marcellus.className}`}>
              Your Home, Our priority
            </h1>
            <p className={`${styles.heroLead} ${marcellus.className}`}>
              Making Homes Shine, One Service at a Time
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
          <span className={styles.sectionEyebrow}>
            Why homeowners choose us
          </span>
          <h2>Everything you need to get projects done right</h2>
          <p>
            From emergency fixes to dream renovations, we bring curated
            expertise and concierge-level support to {city.name}.
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
        title={city.name}
        titleEyebrow="Provided Services"
        desc="Explore the categories locals trust most across the city."
      >
        <div className={styles.switchRow}>
          <SwitchCity
            current={{ name: city.name, slug: city.slug }}
            cities={cities}
          />
        </div>
        <ServiceList citySlug={city.slug} services={allServices} />
      </Section>

      <section id="how-it-works" className={styles.process}>
        <div className={styles.sectionIntro}>
          <span className={styles.sectionEyebrow}>How it works</span>
          <h2>Local pros, smooth delivery</h2>
          <p>
            We coordinate estimates, scheduling, and updates while you stay
            focused on the results.
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
            We’re proud to help neighbors transform their spaces with trusted
            pros who deliver on promises.
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
            Pick a service, tell us what you need, and we’ll connect you with
            the right team sooner than you think.
          </p>
          <a href="#services" className={styles.heroPrimary}>
            Explore services
          </a>
        </div>
      </section>

      <section className={styles.blogSection}>
        <div className={styles.sectionIntro}>
          <span className={styles.sectionEyebrow}>From the blog</span>
          <h2>Ideas, insights, and inspiration</h2>
          <p>
            Stories from our team and community to help you plan smarter and
            love your home even more.
          </p>
        </div>
        <div className={styles.blogGrid}>
          {blogPosts.map((post) => (
            <article key={post.title} className={styles.blogCard}>
              <div className={styles.blogMeta}>
                <span>{post.category}</span>
                <span>{post.date}</span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <a className={styles.blogLink} href="/blog">
                Read article →
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.partnerCta}>
        <div className={styles.partnerContent}>
          <span className={styles.sectionEyebrow}>Partner with us</span>
          <h2>Want to join the {city.name} provider network?</h2>
          <p>
            We’re always looking for licensed, insured crews who care about
            craftsmanship and communication. Tell us about your services and
            we’ll reach out with next steps.
          </p>
          <Link href="/contact" className={styles.heroPrimary}>
            Reach the partnerships team
          </Link>
        </div>
      </section>
    </main>
  );
}
const marcellus = Marcellus_SC({
  subsets: ["latin"],
  weight: "400",
});
