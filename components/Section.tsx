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
  const hideTitleRow = !title;

  return (
    <section id={id} className={styles.section}>
      <header className={styles.sectionHead}>
        <div className={styles.sectionIntro}>
          {titleEyebrow ? (
            <span className={styles.sectionEyebrow}>{titleEyebrow}</span>
          ) : null}
          {!hideTitleRow ? (
            <div className={styles.sectionTitleRow}>
              <h2 className={styles.sectionTitle}>{title}</h2>
              {titleAside ? (
                <div className={styles.sectionTitleAside}>{titleAside}</div>
              ) : null}
            </div>
          ) : null}
          {desc ? <div className={styles.sectionDesc}>{desc}</div> : null}
        </div>
        {right ? <div className={styles.sectionActions}>{right}</div> : null}
      </header>
      {children}
    </section>
  );
}
