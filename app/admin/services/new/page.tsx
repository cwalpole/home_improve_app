import ServiceForm from "../_components/ServiceForm";
import { createServiceAction } from "../actions";
import styles from "../services.module.css";

export default function NewServicePage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.h1}>New Service</h1>
      <ServiceForm action={createServiceAction} submitLabel="Create Service" />
    </main>
  );
}
