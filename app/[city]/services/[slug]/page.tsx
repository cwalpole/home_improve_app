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

type GalleryImage = { url: string; publicId?: string | null };

type ServiceItem = { html: string };

function parseGalleryImages(input: unknown): GalleryImage[] {
  if (!input) return [];
  if (Array.isArray(input)) {
    const results: GalleryImage[] = [];
    for (const item of input) {
      if (!item || typeof item !== "object") continue;
      const record = item as { url?: unknown; publicId?: unknown };
      const url = typeof record.url === "string" ? record.url.trim() : "";
      const publicId =
        typeof record.publicId === "string" ? record.publicId.trim() : null;
      if (!url) continue;
      results.push({ url, publicId });
    }
    return results;
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

  if (!data.listings.length) {
    const contentHtml = data.contentHtml?.trim();
    return (
      <main className={styles.main}>
        <section>
          <div className={styles.serviceContent}>
            <div className={styles.sectionIntro}>
              <h2 className={styles.serviceTitle}>
                <span className={styles.serviceTitleIcon} aria-hidden="true" />
                {data.name}
              </h2>
              <div className={styles.serviceCity}>
                We’re Expanding to {city.name}!
              </div>
              <div className={styles.serviceIntroNote}>
                <p>
                  We’re currently vetting experienced roofing professionals who
                  meet our quality standards.
                </p>
                <p>
                  Check back soon — or submit your project details and we’ll
                  follow up once a partner is available.
                </p>
              </div>
            </div>
            {contentHtml ? (
              <div
                className={styles.serviceContentBody}
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            ) : (
              <p className={styles.serviceContentEmpty}>
                Service details are coming soon.
              </p>
            )}
          </div>
        </section>

        <section className={styles.partnerContactRow}>
          <div className={styles.partnerCta}>
            <div className={styles.partnerContent}>
              <span className={styles.sectionEyebrow}>Partner with us</span>
              <h2>Want to join the {city.name} provider network?</h2>
              <p>
                We’re always looking for licensed, insured crews who care about
                craftsmanship and communication. Tell us about your services and
                we’ll reach out with next steps.
              </p>
              <Link href="/contact" className={styles.partnerCtaButton}>
                Become a Partner
              </Link>
            </div>
          </div>

          <div className={`${styles.quoteCard} ${styles.partnerContactForm}`}>
            <div className={styles.quoteHeader}>
              <h2>Contact Give It Charm</h2>
              <p>
                Tell us about your project and we’ll follow up once a partner
                is available.
              </p>
            </div>
            <ContactForm
              city={city.name}
              citySlug={city.slug}
              service={data.name}
              serviceSlug={slug}
              providerCompanyId={null}
              serviceCityId={null}
            />
            <ul className={styles.quotePerks}>
              <li>No obligation</li>
              <li>Fast response</li>
              <li>Local experts</li>
            </ul>
          </div>
        </section>
      </main>
    );
  }

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
  const hasCompanyLogo = Boolean(listing?.company.logoUrl);

  const heroImageUrl =
    cloudinaryUrl(
      listing?.company.heroImagePublicId,
      listing?.company.heroImageUrl || undefined
    ) ||
    listing?.company.logoUrl ||
    "/logo-placeholder.png";
  const heroLogoUrl = cloudinaryUrl(
    listing?.company.logoPublicId,
    listing?.company.logoUrl
  );

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
              {heroLogoUrl ? (
                <Image
                  src={heroLogoUrl}
                  alt={`${companyName ?? data.name} logo`}
                  width={200}
                  height={200}
                  className={styles.heroTitleLogo}
                />
              ) : null}
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

          {hasCompanyLogo ? (
            <div className={styles.meetLogoRow}>
              <div className={styles.logoBadgeCard}>
                <Image
                  src={
                    cloudinaryUrl(
                      listing?.company.logoPublicId,
                      listing?.company.logoUrl
                    ) || "/logo-placeholder.png"
                  }
                  alt={`${companyName ?? data.name} logo`}
                  width={260}
                  height={160}
                  className={styles.meetLogo}
                />
                <span className={styles.partnerBadge}>
                  A Trusted Give It Charm Partner
                </span>
              </div>
            </div>
          ) : null}
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
          <div className={`${styles.sectionIntro} ${styles.sectionIntroCentered}`}>
            <span className={styles.sectionEyebrow}>
              {companyName ?? data.name}
            </span>
            <h2>Our Expertise</h2>
            <p className={styles.servicesIntro}>
              A focused lineup of premium services tailored to your project.
            </p>
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

      {data.contentHtml ? (
        <section className={styles.serviceContentAfter}>
          <div className={styles.sectionIntro}>
            <h2 className={styles.serviceTitle}>
              <span className={styles.serviceTitleIcon} aria-hidden="true" />
              {data.name}
            </h2>
          </div>
          <div
            className={styles.serviceContentBody}
            dangerouslySetInnerHTML={{ __html: data.contentHtml }}
          />
        </section>
      ) : null}

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
