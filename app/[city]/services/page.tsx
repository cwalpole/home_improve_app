import { findCityBySlug } from "@/lib/city";
import { getServicesForCityId } from "@/lib/queries";
import type { Metadata } from "next";
import Link from "next/link";
import styles from "./ServicesPage.module.css";
import ServiceCards from "./ServiceCards";

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
  const servicesWithSummaries = services.map((service) => ({
    ...service,
    summaryText: service.contentHtml
      ? service.contentHtml
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
      : "",
  }));

  return (
    <main className={styles.main}>
      <section className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          <span className={styles.pageTitleIcon} aria-hidden="true" />
          Services
        </h1>
        <div className={styles.pageCity}>{city.name}</div>
        <p className={styles.pageSubtitle}>
          {hasServices
            ? `Choose from ${totalServices} vetted service${totalServices === 1 ? "" : "s"} — from essential repairs to dream renovations. Our local partners respond quickly and are held to the Home Improve quality standard.`
            : `We’re onboarding trusted partners in ${city.name}. Tell us about your project and we’ll match you with the right pro as soon as they launch.`}
        </p>
        {hasServices ? (
          <div className={styles.quickLinks}>
            <div className={styles.quickHead}>
              <h2 className={styles.quickTitle}>Quick Links</h2>
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
      </section>

      {hasServices ? (
        <>
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <div>
                <h2 className={styles.sectionTitle}>Browse by Project Type</h2>
                <p className={styles.sectionDesc}>
                  Each service is delivered by a vetted local team that knows{" "}
                  {city.name}. Explore the categories below and start planning
                  your next project with confidence.
                </p>
              </div>
            </div>

            <ServiceCards citySlug={cityParam} services={servicesWithSummaries} />
          </section>
        </>
      ) : null}
    </main>
  );
}
