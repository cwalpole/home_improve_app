import styles from './ServiceCard.module.css'
import Link from 'next/link'

export default function ServiceCard({ title, excerpt, href }:{ title:string; excerpt?:string; href:string }) {
  return (
    <Link href={href} className={styles.card}>
      <div className={styles.title}>{title}</div>
      {excerpt ? <div className={styles.excerpt}>{excerpt}</div> : null}
      <div className={styles.link}>Learn more →</div>
    </Link>
  )
}
