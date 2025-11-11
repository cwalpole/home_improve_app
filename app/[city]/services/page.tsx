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
  const alphabetical = services
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroGradient} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <h1 className={styles.title}>
              Home services crafted for {city.name}
            </h1>
            <p className={styles.subtitle}>
              {hasServices
                ? `Choose from ${totalServices} vetted service${totalServices === 1 ? "" : "s"} — from essential repairs to dream renovations. Our local partners respond quickly and are held to the Home Improve quality standard.`
                : `We’re onboarding trusted partners in ${city.name}. Tell us about your project and we’ll match you with the right pro as soon as they launch.`}
            </p>
          </div>
          {hasServices ? (
            <div className={styles.quickLinks}>
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
            </div>
          ) : null}
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
                      View
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}
