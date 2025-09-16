import styles from './ProjectCard.module.css'
import Image from 'next/image'
import Link from 'next/link'

export default function ProjectCard({ title, excerpt, href, cover }:{ title:string; excerpt?:string; href:string; cover?:string }) {
  return (
    <Link href={href} className={styles.card}>
      {cover ? <Image src={cover} alt={title} width={800} height={600} /> : null}
      <div className={styles.body}>
        <div className={styles.title}>{title}</div>
        {excerpt ? <div className={styles.excerpt}>{excerpt}</div> : null}
      </div>
    </Link>
  )
}
