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
    <form action={formAction} className={styles.companyFormCard}>
      <div className={styles.companyFormIntro}>
        <h2 className={styles.companyFormTitle}>Company details</h2>
        <p className={styles.companyFormHint}>
          Update the company name and optional public website link.
        </p>
      </div>
      <input type="hidden" name="id" value={props.id} />
      <label className={styles.companyField}>
        <span className={styles.companyFieldLabel}>Company name</span>
        <input
          name="name"
          defaultValue={props.name}
          className={styles.input}
          placeholder="Enter company name"
          required
        />
      </label>

      <label className={styles.companyField}>
        <span className={styles.companyFieldLabel}>Website URL</span>
        <input
          name="url"
          defaultValue={props.url ?? ""}
          className={styles.input}
          placeholder="https://company.com"
        />
      </label>

      <div className={styles.formActions}>
        <button className={styles.btn}>Save details</button>
        {state.ok && !state.error ? (
          <span className={styles.statusPositive}>Saved</span>
        ) : null}
        {state.error ? (
          <span className={styles.statusNegative}>{state.error}</span>
        ) : null}
      </div>
    </form>
  );
}
