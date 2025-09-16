'use client'
import styles from './Hero.module.css'
import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <div className={styles.wrap}>
      <div className={styles.left}>
        <h1 className="sr-only">Acme Builders</h1>
        <div style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>
          We build spaces that last
        </div>
        <p style={{ maxWidth: 640 }}>
          Commercial &amp; residential construction, renovations, design-build. Licensed, insured, on-time and on-budget.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
          <Link href="/contact" className="btnPrimary">Get a quote</Link>
          <Link href="/projects" className="btnSecondary">See projects</Link>
        </div>

        <div className={styles.statRow}>
          <div className={styles.stat}><strong>250+</strong><span>Projects</span></div>
          <div className={styles.stat}><strong>15yr</strong><span>Experience</span></div>
          <div className={styles.stat}><strong>4.9★</strong><span>Avg rating</span></div>
        </div>
      </div>
      <div className={styles.right}>
        <Image src="https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1200&auto=format&fit=crop" alt="Construction site" width={600} height={400} />
      </div>
    </div>
  )
}
