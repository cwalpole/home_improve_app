"use client";
import { useActionState } from "react";
import { createService, type ActionState } from "../actions/services";
import styles from "../admin.module.css";

const initial: ActionState = { ok: false, error: null };

export default function CreateServiceForm() {
  const [state, formAction] = useActionState(createService, initial);
  return (
    <form action={formAction} className={styles.formInline}>
      <input name="name" placeholder="Name" className={styles.input} required />
      <input
        name="slug"
        placeholder="URL (e.g., plumbing)"
        className={styles.input}
        required
      />
      <input
        name="order"
        placeholder="order"
        type="number"
        className={styles.input}
      />
      <button className={styles.btn}>Create</button>
      {state.error && (
        <span style={{ color: "#f87171", marginLeft: 8 }}>{state.error}</span>
      )}
      {state.ok && !state.error && (
        <span style={{ color: "#86efac", marginLeft: 8 }}>Saved</span>
      )}
    </form>
  );
}
