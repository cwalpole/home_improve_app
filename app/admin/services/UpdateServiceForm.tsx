"use client";
import { useActionState } from "react";
import { updateService, type ActionState } from "../actions/services";
import styles from "../admin.module.css";

const initial: ActionState = { ok: false, error: null };

export default function UpdateServiceForm(props: {
  id: number;
  name: string;
  slug: string;
  order: number;
}) {
  const [state, formAction] = useActionState(updateService, initial);

  return (
    <form action={formAction} className={styles.formInline}>
      <input type="hidden" name="id" value={props.id} />
      <input
        name="name"
        defaultValue={props.name}
        placeholder="Name"
        className={styles.input}
      />
      <input
        name="slug"
        defaultValue={props.slug}
        placeholder="URL (e.g., plumbing)"
        className={styles.input}
      />
      <input
        name="order"
        defaultValue={props.order}
        type="number"
        placeholder="Order"
        className={styles.input}
      />
      <button className={styles.btn}>Save</button>
      {state.error && <p style={{ color: "salmon" }}>{state.error}</p>}
      {state.ok && !state.error && <p style={{ color: "lightgreen" }}>Saved</p>}
    </form>
  );
}
