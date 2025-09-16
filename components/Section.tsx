import styles from './Section.module.css'

export default function Section({
  title, desc, right, children, id
}: { title: string; desc?: string; right?: React.ReactNode; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className={styles.section}>
      <header className={styles.head}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          {desc ? <p className={styles.desc}>{desc}</p> : null}
        </div>
        {right ? <div>{right}</div> : null}
      </header>
      {children}
    </section>
  )
}
