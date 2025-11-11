import { ReactNode } from "react";
import styles from "./Section.module.css";

type Props = {
  title: ReactNode;
  titleEyebrow?: ReactNode;
  desc?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
  id?: string;
  titleAside?: ReactNode;
};

export default function Section({
  title,
  titleEyebrow,
  desc,
  right,
  children,
  id,
  titleAside,
}: Props) {
  return (
    <section id={id} className={styles.section}>
      <header className={styles.sectionHead}>
        <div className={styles.sectionIntro}>
          {titleEyebrow ? (
            <span className={styles.sectionEyebrow}>{titleEyebrow}</span>
          ) : null}
          <div className={styles.sectionTitleRow}>
            <h2 className={styles.sectionTitle}>{title}</h2>
            {titleAside ? (
              <div className={styles.sectionTitleAside}>{titleAside}</div>
            ) : null}
          </div>
          {desc ? <p className={styles.sectionDesc}>{desc}</p> : null}
        </div>
        {right ? <div className={styles.sectionActions}>{right}</div> : null}
      </header>
      {children}
    </section>
  );
}
