"use client";

import { useActionState } from "react";
import { createCompany, type ActionState } from "../actions/companies";
import styles from "../admin.module.css";

const initial: ActionState = { ok: false, error: null };

export default function CreateCompanyForm() {
  const [state, formAction] = useActionState(createCompany, initial);

  return (
    <form action={formAction} className={styles.formInline}>
      <input name="name" placeholder="Name" className={styles.input} required />
      <input
        name="url"
        placeholder="https://companyUrl.com"
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
