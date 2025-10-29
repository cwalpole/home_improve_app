import { findCityBySlug } from "@/lib/city";
import { getServicesForCityId } from "@/lib/queries";
import type { Metadata } from "next";
import Link from "next/link";
import ServiceImage from "@/components/ServiceImage";
import styles from "./ServicesPage.module.css";

export async function generateMetadata(props: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: cityParam } = await props.params;
  const city = await findCityBySlug(cityParam);
  const cityName = city?.name ?? cityParam;

  return {
    title: `Home Services in ${cityName}`,
    alternates: { canonical: `/${cityParam}/services` },
    robots: { index: true, follow: true },
  };
}

export default async function CityServicesPage(props: {
  params: Promise<{ city: string }>;
}) {
  const { city: cityParam } = await props.params;
  const city = await findCityBySlug(cityParam);
  if (!city) return <div>City not found</div>;

  const services = await getServicesForCityId(city.id);
  const hasServices = services.length > 0;
  const totalServices = services.length;
  const topServices = services.slice(0, 3);
  const alphabetical = services
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
  const primaryServiceSlug = hasServices ? services[0]!.slug : null;

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroGradient} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Serving {city.name}</span>
            <h1 className={styles.title}>
              Home services crafted for {city.name}
            </h1>
            <p className={styles.subtitle}>
              {hasServices
                ? `Choose from ${totalServices} vetted service${totalServices === 1 ? "" : "s"} — from essential repairs to dream renovations. Our local partners respond quickly and are held to the Home Improve quality standard.`
                : `We’re onboarding trusted partners in ${city.name}. Tell us about your project and we’ll match you with the right pro as soon as they launch.`}
            </p>

            {hasServices ? (
              <div className={styles.heroActions}>
                <Link
                  className={styles.ctaPrimary}
                  href={`/${cityParam}/services/${primaryServiceSlug}`}
                >
                  View popular services
                </Link>
                <Link className={styles.ctaGhost} href={`/${cityParam}`}>
                  Back to city overview
                </Link>
              </div>
            ) : (
              <div className={styles.heroActions}>
                <Link className={styles.ctaPrimary} href={`/${cityParam}`}>
                  Explore the city guide
                </Link>
                <Link className={styles.ctaGhost} href="#join-list">
                  Join the waitlist
                </Link>
              </div>
            )}

            <dl className={styles.stats}>
              <div>
                <dt>Total services</dt>
                <dd>{totalServices}</dd>
              </div>
              <div>
                <dt>Response window</dt>
                <dd>Under 24 hrs</dd>
              </div>
              <div>
                <dt>Local satisfaction</dt>
                <dd>4.8 ★ avg</dd>
              </div>
            </dl>

            {hasServices ? (
              <div className={styles.popular}>
                <span className={styles.popularLabel}>Popular right now</span>
                <div className={styles.popularList}>
                  {topServices.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/${cityParam}/services/${service.slug}`}
                      className={styles.popularChip}
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className={styles.heroAside}>
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>Need a tailored quote?</h2>
              <p className={styles.panelCopy}>
                Tell us about your project and our concierge team will match you
                with the best-fit professional in {city.name}.
              </p>
              <Link
                className={styles.panelCta}
                href={hasServices ? `/${cityParam}/services/${services[0]!.slug}#contact` : "/contact"}
              >
                Speak with a coordinator
              </Link>
              <ul className={styles.panelList}>
                <li>Licensed & insured specialists</li>
                <li>Transparent quotes up front</li>
                <li>Quality guaranteed workmanship</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {hasServices ? (
        <>
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <div>
                <h2 className={styles.sectionTitle}>Browse by project type</h2>
                <p className={styles.sectionDesc}>
                  Each service is delivered by a vetted local team that knows{" "}
                  {city.name}. Explore the categories below and start planning
                  your next project with confidence.
                </p>
              </div>
              <Link
                href={`/${cityParam}`}
                className={styles.sectionLink}
                aria-label={`See more about ${city.name}`}
              >
                City insights →
              </Link>
            </div>

            <div className={styles.grid}>
              {services.map((service) => (
                <article key={service.slug} className={styles.card}>
                  <div className={styles.cardMedia}>
                    <ServiceImage
                      slug={service.slug}
                      alt={`${service.name} hero`}
                      fill
                      sizes="(max-width: 768px) 90vw, (max-width: 1200px) 33vw, 280px"
                      className={styles.cardImage}
                    />
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{service.name}</h3>
                    <p className={styles.cardSummary}>
                      Trusted {service.name.toLowerCase()} pros delivering quick
                      scheduling, clear pricing, and workmanship that stands up
                      to {city.name}&apos;s standards.
                    </p>
                    <Link
                      href={`/${cityParam}/services/${service.slug}`}
                      className={styles.cardLink}
                    >
                      View details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.quickLinks}>
            <div className={styles.quickHead}>
              <h2 className={styles.quickTitle}>Quick links</h2>
              <p className={styles.quickDesc}>
                Already know what you need? Jump straight to a service page and
                request your quote.
              </p>
            </div>
            <div className={styles.quickList}>
              {alphabetical.map((service) => (
                <Link
                  key={`quick-${service.slug}`}
                  href={`/${cityParam}/services/${service.slug}`}
                  className={styles.quickChip}
                >
                  {service.name}
                </Link>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className={styles.emptyState} id="join-list">
          <div className={styles.emptyCard}>
            <h2>Be first in line</h2>
            <p>
              We’re curating trusted home service providers in {city.name}. Drop
              us a line and we’ll notify you the moment booking opens.
            </p>
            <Link className={styles.ctaPrimary} href="/contact">
              Join the waitlist
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
