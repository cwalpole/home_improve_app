import styles from "./ServiceCard.module.css";
import Link from "next/link";
import Image from "next/image";

interface Props {
  cover?: string;
  title: string;
  excerpt?: string;
  href: string;
}

export default function ServiceCard({ cover, title, excerpt, href }: Props) {
  return (
    <Link href={href} className={styles.card}>
      {cover ? (
        <Image src={cover} alt={title} width={800} height={600} />
      ) : null}
      <div className={styles.body}>
        <div className={styles.title}>{title}</div>
        {excerpt ? <div className={styles.excerpt}>{excerpt}</div> : null}
      </div>
    </Link>
  );
}
