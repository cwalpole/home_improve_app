import { prisma } from "@/lib/prisma";
import styles from "../home.module.css";
import Section from "@/components/Section";
import Link from "next/link";
import ServiceList from "@/components/ServiceList";
import SwitchCity from "@/components/SwitchCity";

export const dynamic = "force-dynamic";

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

  const steps = [
    {
      number: "1",
      title: "Tell us what you need",
      copy: "Share your project details, goals, and timing. We’ll make sure everything is clearly defined from the start.",
    },
    {
      number: "2",
      title: "Work with the city’s top provider",
      copy: "We connect you directly with the single, vetted pro we trust for that service in your area — no guesswork, no competing bids.",
    },
    {
      number: "3",
      title: "Get results you can trust",
      copy: "Enjoy high-quality workmanship, clear communication, and results backed by our standard of excellence.",
    },
  ];

  const blogPosts = await prisma.blogPost.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { cities: { some: { cityId: city.id } } },
        { cities: { none: {} } }, // global
      ],
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 3,
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      category: true,
      publishedAt: true,
      createdAt: true,
      coverImageUrl: true,
    },
  });

  const formatCategory = (cat: string) => {
    if (cat === "PLANNING_GUIDE") return "Planning Guide";
    if (cat === "HOMEOWNER_TIPS") return "Homeowner Tips";
    if (cat === "EXPERT_SPOTLIGHT") return "Expert Spotlight";
    return cat;
  };
  const fmtDate = (d?: Date | null) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={styles.heroContent}>
          <div className={styles.heroCopy}>
            <div className={`${styles.heroTitle}`}>Your Home, Our Priority</div>
            <div className={styles.heroActions}>
              <Link href="#featured-services" className={styles.heroPrimary}>
                Choose Your Service
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.trustStrip}>
        <div className={styles.trustInner}>
          <div className={styles.trustCopy}>Making Homes Shine, One Service at a Time</div>
        </div>
      </section>

      {/* <section className={styles.highlights}>
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
      </section> */}

      <Section
        id="services"
        title={null}
        titleEyebrow={null}
        desc={null}
      >
        <ServiceList citySlug={city.slug} services={allServices} />
        <div className={styles.switchRow}>
          <span className={styles.sectionLabel}>{city.name} Services · </span>
          <SwitchCity
            current={{ name: city.name, slug: city.slug }}
            cities={cities}
          />
        </div>
      </Section>

      <section id="how-it-works" className={styles.process}>
        <div className={styles.sectionIntro}>
          <span className={styles.sectionEyebrow}>How it works</span>
          <h2>One Trusted Pro</h2>
          <p>
            We don’t give you a list to compare. For each service in your city,
            we partner with one proven, top-tier professional — selected for
            quality, reliability, and consistency — so you can move forward with
            confidence.
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

      <section className={styles.blogSection}>
        <div className={styles.blogHeader}>
          <span className={styles.sectionEyebrow}>From the blog</span>
          <h2>Ideas, Insights, and Inspiration</h2>
          <p className={styles.blogSubhead}>
            Practical advice from our team and vetted professionals to help you plan smarter
            and move forward with confidence.
          </p>
          <p className={styles.blogTrust}>
            Written by our team and the professionals we partner with — not paid contributors.
          </p>
        </div>

        <div className={styles.blogGrid}>
          {blogPosts.map((post) => (
            <article key={post.id} className={styles.blogCard}>
              {post.coverImageUrl && (
                <div className={styles.blogThumbSmall}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.coverImageUrl} alt="" />
                </div>
              )}
              <div className={styles.blogMeta}>
                <span>{formatCategory(post.category)}</span>
                <span>{fmtDate(post.publishedAt ?? post.createdAt)}</span>
              </div>
              <div className={styles.blogBody}>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </div>
              <Link className={styles.blogLink} href={`/${city.slug}/blog/${post.slug}`}>
                Read article →
              </Link>
            </article>
          ))}
        </div>

        <div className={styles.blogCtaRow}>
          <Link className={styles.blogCta} href={`/${city.slug}/blog`}>
            Explore all homeowner guides →
          </Link>
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
            Become a Partner
          </Link>
        </div>
      </section>
    </main>
  );
}
