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

function cloudinaryUrl(publicId?: string | null, fallback?: string | null) {
  if (publicId) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (cloudName) {
      return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${publicId}`;
    }
  }
  return fallback || undefined;
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
      <section className={styles.hero}>
        <div className={styles.heroGradient} aria-hidden="true" />
        <div className={styles.heroContent}>
          <div className={styles.heroCopy}>
            <h1 className={styles.title}>
              {data.name} experts serving {city.name}
            </h1>
            <p className={styles.lead}>
              Partner with vetted specialists who deliver premium{" "}
              {data.name.toLowerCase()} results, flexible scheduling, and clear
              communication from the first call to final walk-through.
            </p>

            <div className={styles.ctaRow}>
              <a href="#contact" className={styles.ctaPrimary}>
                Book your free quote
              </a>
              <Link href={`/${city.slug}/services`} className={styles.ctaGhost}>
                Browse all services
              </Link>
            </div>
          </div>

          <aside className={styles.heroAside}>
            <div className={styles.heroAsideCard}>
              <h3>
                Popular {data.name.toLowerCase()} projects in {city.name}
              </h3>
              <ul>
                <li>Complete {data.name.toLowerCase()} packages</li>
                <li>Emergency call-outs & repairs</li>
                <li>Maintenance plans and seasonal care</li>
              </ul>
              <p>
                Not sure where to start? Share a few details and we&apos;ll
                tailor recommendations for your home.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.providerSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>Featured provider</span>
          <h2 className={styles.sectionTitle}>Meet your local specialist</h2>
          <p className={styles.sectionLead}>
            We partner with trusted pros who know {city.name} homes inside and
            out.
          </p>
        </div>
        {listing ? (
          <article className={styles.providerCard}>
            <div className={styles.providerBadge}>Preferred partner</div>
            <div className={styles.providerHeader}>
              {listing.company.logoUrl ? (
                <div className={styles.providerLogoImageWrap}>
                  <Image
                    src={
                      cloudinaryUrl(
                        listing.company.logoPublicId,
                        listing.company.logoUrl
                      ) || "/logo-placeholder.png"
                    }
                    alt={`${listing.displayName || listing.company.name} logo`}
                    fill
                    sizes="220px"
                    className={styles.providerLogoImage}
                  />
                </div>
              ) : null}
              <div>
                <h3 className={styles.providerName}>
                  {listing.displayName || listing.company.name}
                </h3>
                <p className={styles.providerMeta}>
                  Serving {city.name} • Licensed & insured • Local team you can
                  reach directly
                </p>
              </div>
            </div>

            <ul className={styles.providerPoints}>
              <li>Upfront proposals and detailed progress updates</li>
              <li>Respectful crews that keep your home tidy</li>
              <li>Work backed by a satisfaction guarantee</li>
            </ul>

            <div className={styles.providerActions}>
              <a href="#contact" className={styles.ctaPrimary}>
                Start your project
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
          </article>
        ) : (
          <div className={styles.providerFallback}>
            <p>
              We’re currently onboarding a trusted {data.name.toLowerCase()}{" "}
              partner in {city.name}. Share your project details and we’ll match
              you within 24 hours.
            </p>
            <a href="#contact" className={styles.ctaPrimary}>
              Tell us about your project
            </a>
          </div>
        )}
      </section>

      <section className={styles.highlights}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>Why homeowners trust us</span>
          <h2 className={styles.sectionTitle}>
            A smoother {data.name.toLowerCase()} experience from hello to
            handover
          </h2>
          <p className={styles.sectionLead}>
            We curate the best local teams in {city.name}, so you can focus on
            the results instead of the research.
          </p>
        </div>
        <div className={styles.highlightGrid}>
          {[
            {
              title: "Vetted local pros",
              copy: `Every specialist is licensed, insured, and hand-reviewed for ${data.name.toLowerCase()} work in ${
                city.name
              }.`,
            },
            {
              title: "Crystal-clear pricing",
              copy: "Expect transparent estimates, detailed scopes, and easy scheduling without the back-and-forth.",
            },
            {
              title: "Service that stands out",
              copy: "Dedicated project support, proactive communication, and workmanship we stand behind.",
            },
          ].map((card) => (
            <article key={card.title} className={styles.highlightCard}>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>
      </section>

      {data.contentHtml ? (
        <section className={styles.story}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>In-depth guide</span>
            <h2 className={styles.sectionTitle}>
              {city.name}&apos;s take on {data.name.toLowerCase()}
            </h2>
          </div>
          <div
            className={styles.richText}
            dangerouslySetInnerHTML={{ __html: data.contentHtml }}
          />
        </section>
      ) : null}

      <section className={styles.process}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>How it works</span>
          <h2 className={styles.sectionTitle}>
            Simple steps to a finished project
          </h2>
        </div>
        <ol className={styles.stepList}>
          {[
            {
              title: "Share your vision",
              copy: `Tell us about your ${data.name.toLowerCase()} goals and timeline. It takes less than two minutes.`,
            },
            {
              title: "Receive a tailored plan",
              copy: "We pair you with the right crew, outline the scope, and schedule a site visit if needed.",
            },
            {
              title: "Relax while we get it done",
              copy: "Your dedicated pro keeps you updated, respects your home, and delivers the finish you expect.",
            },
          ].map((step, index) => (
            <li key={step.title}>
              <span className={styles.stepNumber}>{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="contact" className={styles.contactSection}>
        <div className={styles.contactInner}>
          <div className={styles.contactCopy}>
            <span className={styles.sectionEyebrow}>Get your free quote</span>
            <h2 className={styles.sectionTitle}>
              Ready to start your {data.name.toLowerCase()} project?
            </h2>
            <p className={styles.sectionLead}>
              Tell us a few details and we’ll connect you with{" "}
              {listing
                ? listing.displayName || listing.company.name
                : "a vetted local pro"}{" "}
              for a fast, friendly estimate.
            </p>
            <ul className={styles.contactPerks}>
              <li>No-obligation, personalized quotes</li>
              <li>Friendly follow-up—no spam</li>
              <li>Local experts who respect your home</li>
            </ul>
          </div>

          <ContactForm
            city={city.name}
            citySlug={city.slug}
            service={data.name}
            serviceSlug={slug}
            providerCompanyId={listing?.companyId ?? null}
            serviceCityId={listing?.serviceCityId ?? null}
          />
        </div>
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
