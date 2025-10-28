import Image from "next/image";
import Link from "next/link";
import styles from "./ServiceDetail.module.css";
import { findCityBySlug } from "@/lib/city";
import { getServiceDetailForCityId } from "@/lib/queries";

function normalizeExternalUrl(u?: string | null) {
  if (!u) return undefined;
  const s = u.trim();
  if (!s) return undefined;
  if (/^https?:\/\//i.test(s) || /^\/\//.test(s)) return s; // already absolute
  return `https://${s}`;
}

export default async function CityServiceDetailPage(props: {
  params: Promise<{ city: string; slug: string }>;
}) {
  const { city: cityParam, slug } = await props.params;
  const city = await findCityBySlug(cityParam);
  if (!city) return <div>City not found</div>;

  const data = await getServiceDetailForCityId(slug, city.id);
  if (!data) return <div>Service not found</div>;

  // There should be exactly one listing for this Service•City
  const listing = data.listings[0] ?? null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: data.name,
    areaServed: city.name,
    ...(listing && {
      provider: {
        "@type": "Organization",
        name: listing.displayName ?? listing.company.name,
        url: listing.company.url || undefined,
        logo: listing.company.logoUrl || undefined,
      },
    }),
  };

  return (
    <main className={styles.main}>
      {/* HERO (unchanged) */}
      <section className={styles.hero}>
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Licensed • Insured • Warranty</span>
          <h1 className={styles.title}>
            {data.name} Service in {city.name}
          </h1>
          <p className={styles.subtitle}>
            Trusted local pros for {data.name.toLowerCase()} — fast quotes,
            clear pricing, and quality workmanship.
          </p>
          <div className={styles.ctaRow}>
            <a href="#contact" className={styles.ctaPrimary}>
              Get a free quote
            </a>
            <Link href={`/${city.slug}/services`} className={styles.ctaGhost}>
              Browse all services
            </Link>
          </div>
        </div>
      </section>

      {data.contentHtml ? (
        <section className={styles.section}>
          <div
            className={styles.richText}
            dangerouslySetInnerHTML={{ __html: data.contentHtml }}
          />
        </section>
      ) : null}

      {/* SINGLE PROVIDER */}
      <section className={styles.section}>
        <h2 className={styles.h2}>Featured provider</h2>

        {listing ? (
          <article className={styles.provider}>
            <div className={styles.providerBadge}>Preferred</div>

            <div className={styles.providerMedia}>
              {listing.company.logoUrl ? (
                <div className={styles.providerLogoWrap}>
                  <Image
                    src={listing.company.logoUrl}
                    alt={`${listing.displayName || listing.company.name} logo`}
                    fill
                    sizes="120px"
                    className={styles.providerLogo}
                  />
                </div>
              ) : (
                <div className={styles.providerLogoFallback}>
                  {(listing.displayName || listing.company.name)
                    .split(/\s+/)
                    .map((w) => w[0]!)
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>
              )}
            </div>

            <div className={styles.providerBody}>
              <div className={styles.providerName}>
                {listing.displayName || listing.company.name}
              </div>
              <div className={styles.providerMeta}>
                Serving {city.name} • Licensed & insured • Fast scheduling
              </div>
              <div className={styles.providerCtas}>
                <a href="#contact" className={styles.ctaPrimary}>
                  Get a free quote
                </a>
                {listing.company.url && (
                  <a
                    href={normalizeExternalUrl(listing.company.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.ctaGhost}
                  >
                    Visit website
                  </a>
                )}
              </div>
            </div>
          </article>
        ) : (
          <p className={styles.muted}>
            We’re onboarding a trusted provider for {data.name.toLowerCase()} in{" "}
            {city.name}. Tell us about your project and we’ll match you.
          </p>
        )}
      </section>

      {/* CONTACT FORM (pass IDs so leads route to the single provider) */}
      <section id="contact" className={styles.section}>
        <h2 className={styles.h2}>Get your free quote</h2>
        <p className={styles.muted}>
          Tell us a bit about your project. We’ll connect you with{" "}
          {listing
            ? listing.displayName || listing.company.name
            : "a vetted local pro"}
          .
        </p>

        <ContactForm
          city={city.name}
          citySlug={city.slug}
          service={data.name}
          serviceSlug={slug}
          providerCompanyId={listing?.company.name ?? null}
          serviceCityId={(listing as any)?.serviceCityId ?? null}
        />
      </section>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}

/* Inline import to avoid a separate file path in this snippet */
import ContactForm from "./ContactForm";
