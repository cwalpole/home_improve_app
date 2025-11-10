import Link from "next/link";
import styles from "./ServiceCard.module.css";
import ServiceImage from "./ServiceImage";

type Props = {
  href: string;
  service: { name: string; slug: string; heroImage?: string | null };
  companyName?: string | null;
  coverExt?: "jpg" | "png" | "webp";
};

export default function ServiceCard({
  href,
  service,
  companyName,
  coverExt = "png",
}: Props) {
  const { name, slug } = service;
  const companyDisplay = companyName ?? "Feature Your Company";

  return (
    <Link
      href={href}
      className={styles.linkWrapper}
      aria-label={`${name}${companyName ? ` — ${companyName}` : ""}`}
    >
      <article className={`${styles.card} `} aria-labelledby={`${slug}-title`}>
        <div className={styles.wall}>
          <div className={styles.frame}>
            <div className={styles.mat}>
              <div className={styles.art}>
                <ServiceImage
                  slug={slug}
                  ext={coverExt}
                  alt={`${name} image`}
                  fill
                  sizes="(max-width: 640px) 40vw, 220px"
                  className={styles.img}
                />
              </div>
            </div>
          </div>
        </div>

        <>
          <h3 id={`${slug}-title`} className={styles.title}>
            {name}
          </h3>
          <p className={styles.company} title={companyDisplay}>
            {companyDisplay}
          </p>
        </>
      </article>
    </Link>
  );
}
