"use client";

import { useActionState } from "react";
import { updateCity, type ActionState } from "../actions/cities";
import styles from "../admin.module.css";

const initial: ActionState = { ok: false, error: null };

export default function UpdateCityForm(props: {
  id: number;
  name: string;
  slug: string;
  regionCode: string | null;
}) {
  const [state, formAction] = useActionState(updateCity, initial);

  return (
    <form action={formAction} className={styles.formInline}>
      <input type="hidden" name="id" value={props.id} />
      <input
        name="name"
        defaultValue={props.name}
        className={styles.input}
        placeholder="Name"
        required
      />
      <input
        name="slug"
        defaultValue={props.slug}
        className={styles.input}
        placeholder="URL (e.g., calgary)"
        required
      />
      <input
        name="regionCode"
        defaultValue={props.regionCode ?? ""}
        placeholder="regionCode (e.g., AB)"
        className={styles.input}
      />
      <button className={styles.btn}>Save</button>
      {state.error && <p style={{ color: "salmon" }}>{state.error}</p>}
      {state.ok && !state.error && <p style={{ color: "lightgreen" }}>Saved</p>}
    </form>
  );
}
