"use client";

import { useActionState } from "react";
import { updateCompany, type ActionState } from "../actions/companies";
import styles from "../admin.module.css";

const initial: ActionState = { ok: false, error: null };

export default function UpdateCompanyForm(props: {
  id: number;
  name: string;
  url: string | null;
}) {
  const [state, formAction] = useActionState(updateCompany, initial);

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
        name="url"
        defaultValue={props.url ?? ""}
        className={styles.input}
        placeholder="Company URL"
      />
      <button className={styles.btn}>Save</button>
      {state.error && <p style={{ color: "salmon" }}>{state.error}</p>}
      {state.ok && !state.error && <p style={{ color: "lightgreen" }}>Saved</p>}
    </form>
  );
}
