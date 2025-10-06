import { ReactNode } from "react";
import styles from "./Section.module.css";

type Props = {
  title: ReactNode;
  desc?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
  id?: string;
};

export default function Section({ title, desc, right, children, id }: Props) {
  return (
    <section id={id} className={styles.section}>
      <header className={styles.sectionHead}>
        <div>
          <h2 className={styles.sectionTitle}>{title}</h2>
          {desc ? <p className={styles.sectionDesc}>{desc}</p> : null}
        </div>
        {right ? <div>{right}</div> : null}
      </header>
      {children}
    </section>
  );
}
