import Image from "next/image";
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

type GalleryImage = { url: string; publicId?: string | null };

type ServiceItem = { html: string };

function parseGalleryImages(input: unknown): GalleryImage[] {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const record = item as { url?: unknown; publicId?: unknown };
        const url = typeof record.url === "string" ? record.url.trim() : "";
        const publicId =
          typeof record.publicId === "string" ? record.publicId.trim() : null;
        if (!url) return null;
        return { url, publicId };
      })
      .filter((item): item is GalleryImage => Boolean(item));
  }
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      return parseGalleryImages(parsed);
    } catch {
      return [];
    }
  }
  return [];
}

function parseServiceItems(input: unknown): ServiceItem[] {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input
      .map((item) => {
        if (typeof item !== "string") return null;
        const html = item.trim();
        if (!html) return null;
        return { html };
      })
      .filter((item): item is ServiceItem => Boolean(item));
  }
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      return parseServiceItems(parsed);
    } catch {
      return [];
    }
  }
  return [];
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
  const companyName = listing?.displayName || listing?.company.name;
  const companyUrl = normalizeExternalUrl(listing?.company.url);
  const companyTagline = listing?.company.tagline?.trim();
  const companySummary = listing?.company.companySummary?.trim();
  const serviceLower = data.name.toLowerCase();

  const galleryImages = parseGalleryImages(listing?.company.galleryImages);
  const featuredIndexRaw = listing?.company.galleryFeaturedIndex;
  const featuredIndex =
    typeof featuredIndexRaw === "number" ? featuredIndexRaw : 0;
  const orderedGallery = galleryImages.length
    ? [
        ...(galleryImages[featuredIndex]
          ? [galleryImages[featuredIndex]]
          : []),
        ...galleryImages.filter((_, idx) => idx !== featuredIndex),
      ]
    : [];

  const servicesOfferedItems = parseServiceItems(
    listing?.company.servicesOffered
  );

  const heroImageUrl =
    cloudinaryUrl(
      listing?.company.heroImagePublicId,
      listing?.company.heroImageUrl || undefined
    ) ||
    listing?.company.logoUrl ||
    "/logo-placeholder.png";

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
      <div className={styles.heroGroup}>
        <section className={styles.hero}>
          <div className={styles.heroBg}>
            <Image
              src={heroImageUrl}
              alt={`${companyName ?? data.name} hero`}
              fill
              sizes="100vw"
              className={styles.heroBgImage}
              priority
            />
          </div>
          <div className={styles.heroOverlay} aria-hidden="true" />
          <div className={styles.heroContent}>
            <div className={styles.heroCopy}>
              <Image
                src={
                  cloudinaryUrl(
                    listing?.company.logoPublicId,
                    listing?.company.logoUrl
                  ) || "/logo-placeholder.png"
                }
                alt={`${companyName ?? data.name} logo`}
                width={200}
                height={200}
                className={styles.heroTitleLogo}
              />
              <div className={styles.heroText}>
                <h1 className={styles.heroTitle}>
                  <span className={styles.heroTitleName}>
                    {companyName ?? data.name}
                  </span>
                </h1>
                <p className={styles.heroLead}>
                  Premium {serviceLower} upgrades built for {city.name} homes.
                </p>
                <div className={styles.heroCtas}>
                  <a href="#contact" className={styles.ctaPrimary}>
                    Start Your Project
                  </a>
                  <a href="#gallery" className={styles.ctaSecondary}>
                    View Recent Work
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {companyTagline ? (
          <section className={styles.trustStrip}>
            <div className={styles.trustInner}>
              <p className={styles.trustCopy}>{companyTagline}</p>
            </div>
          </section>
        ) : null}
      </div>

      <section className={styles.meet}>
        <div className={styles.meetSplit}>
          <div className={styles.meetText}>
            <h2>
              {city.name}&apos;s Featured {data.name} Specialist
            </h2>
            <p>
              {companySummary ||
                `${companyName ?? data.name} has helped ${city.name} homeowners transform their ${serviceLower} for over 15 years. From epoxy flooring to full storage systems and door replacements, the team is known for durable results, clean craftsmanship, and clear communication.`}
            </p>
            {companyUrl ? (
              <a
                href={companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.meetLinkInline}
              >
                Visit Company Website
              </a>
            ) : null}
          </div>

          <div className={styles.meetLogoRow}>
            <div className={styles.logoBadgeCard}>
              {listing?.company.logoUrl ? (
                <Image
                  src={
                    cloudinaryUrl(
                      listing.company.logoPublicId,
                      listing.company.logoUrl
                    ) || "/logo-placeholder.png"
                  }
                  alt={`${companyName ?? data.name} logo`}
                  width={260}
                  height={160}
                  className={styles.meetLogo}
                />
              ) : (
                <div className={styles.meetLogoFallback}>
                  {companyName ?? data.name}
                </div>
              )}
              <span className={styles.partnerBadge}>
                A Trusted Give It Charm Partner
              </span>
            </div>
          </div>
        </div>

        <div id="gallery" className={`${styles.galleryGrid} ${styles.anchorTarget}`}>
          {orderedGallery.length ? (
            orderedGallery.slice(0, 5).map((image, index) => (
              <div key={`${image.url}-${index}`} className={styles.galleryItem}>
                <Image
                  src={cloudinaryUrl(image.publicId, image.url) || image.url}
                  alt={`${companyName ?? data.name} project ${index + 1}`}
                  fill
                  sizes="(max-width: 900px) 92vw, 320px"
                  className={styles.galleryImage}
                />
              </div>
            ))
          ) : (
            <div className={styles.galleryEmpty}>
              Gallery images are coming soon.
            </div>
          )}
        </div>
      </section>

      <section className={styles.servicesQuote}>
        <div className={styles.servicesCard}>
          <div className={styles.sectionIntro}>
            <span className={styles.sectionEyebrow}>
              {companyName ?? data.name}
            </span>
            <h2>Our Expertise</h2>
          </div>
          <div className={styles.servicesGrid}>
            {servicesOfferedItems.length ? (
              servicesOfferedItems.map((service, index) => (
                <div key={`${index}`} className={styles.serviceItem}>
                  <div className={styles.serviceIcon} aria-hidden="true" />
                  <div
                    className={styles.serviceItemContent}
                    dangerouslySetInnerHTML={{ __html: service.html }}
                  />
                </div>
              ))
            ) : (
              <div className={styles.servicesEmpty}>
                Services will be listed here soon.
              </div>
            )}
          </div>

          <figure className={styles.testimonialCard}>
            <blockquote>
              “{companyName ?? data.name} transformed our cold, cracked {serviceLower} into a
              space we actually use every day. Professional team with great attention
              to detail.”
            </blockquote>
            <figcaption>— Sarah R., {city.name}</figcaption>
          </figure>
        </div>

        <div id="contact" className={`${styles.quoteCard} ${styles.anchorTarget}`}>
          <div className={styles.quoteHeader}>
            <h2>Contact {companyName ?? data.name}</h2>
            <p>Tell us about your project and their team will reach out directly.</p>
          </div>
          <ContactForm
            city={city.name}
            citySlug={city.slug}
            service={data.name}
            serviceSlug={slug}
            providerCompanyId={listing?.companyId ?? null}
            serviceCityId={listing?.serviceCityId ?? null}
          />
          <ul className={styles.quotePerks}>
            <li>No obligation</li>
            <li>Fast response</li>
            <li>Local experts</li>
          </ul>
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
