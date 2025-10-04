import Link from "next/link";
import Image from "next/image";
import styles from "./ServiceCard.module.css";
import ServiceImage from "./ServiceImage";

type Props = {
  href: string;
  service: { name: string; slug: string; heroImage?: string | null };
  companyName?: string | null;
  coverExt?: "jpg" | "png" | "webp";
  isAd?: boolean; // featured rows pass this
};

export default function ServiceCard({
  href,
  service,
  companyName,
  coverExt = "png",
  isAd,
}: Props) {
  const { name, slug, heroImage } = service;

  return (
    <Link
      href={href}
      className={styles.linkWrapper}
      aria-label={`${name}${companyName ? ` — ${companyName}` : ""}`}
    >
      <article
        className={`${styles.card} ${isAd ? styles.featured : ""}`}
        aria-labelledby={`${slug}-title`}
      >
        {/* “Wall” with panel moulding */}
        <div className={styles.wall}>
          {/* Framed art */}
          <div className={styles.frame}>
            <div className={styles.mat}>
              <div className={styles.art}>
                (
                <ServiceImage
                  slug={slug}
                  ext={coverExt}
                  alt={`${name} image`}
                  fill
                  sizes="(max-width: 640px) 40vw, 220px"
                  className={styles.img}
                  isAd={isAd}
                />
                {/* Inside-caption for featured tiles */}
                {isAd && (
                  <div className={styles.captionInside} aria-hidden="false">
                    <div id={`${slug}-title`} className={styles.captionTitle}>
                      {name}
                    </div>
                    <div className={styles.captionCompany}>
                      {companyName ?? "No company linked"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* External title/meta for standard tiles only */}
        {!isAd && (
          <>
            <h3 id={`${slug}-title`} className={styles.title}>
              {name}
            </h3>
            <div
              className={styles.company}
              title={companyName || "No company linked"}
            >
              {companyName ?? "No company linked"}
            </div>
          </>
        )}
      </article>
    </Link>
  );
}
