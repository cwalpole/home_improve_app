import styles from "../admin.module.css";

export default function Row({ children }: { children: React.ReactNode }) {
  return <div className={styles.row}>{children}</div>;
}
