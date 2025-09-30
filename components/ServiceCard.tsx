import Link from "next/link";
import Image from "next/image";

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
  const { name, slug, heroImage } = service;

  return (
    <Link
      href={href}
      className={styles.card}
      aria-label={`${name}${companyName ? ` — ${companyName}` : ""}`}
    >
      <div className={styles.media}>
        {heroImage ? (
          <Image
            src={heroImage}
            alt={`${name} image`}
            width={125}
            height={125}
            className={styles.img}
            sizes="125px"
          />
        ) : (
          <ServiceImage
            slug={slug}
            ext={coverExt}
            alt={`${name} image`}
            width={125}
            height={125}
            className={styles.img}
          />
        )}

        {/* centered badge along the bottom of the image */}
        <div className={styles.badge} aria-hidden="true">
          {name}
        </div>
      </div>

      {/* text below the image */}
      <div className={styles.body}>
        <div
          className={styles.company}
          title={companyName || "No company linked"}
        >
          {companyName ?? "No company linked"}
        </div>
      </div>
    </Link>
  );
}
