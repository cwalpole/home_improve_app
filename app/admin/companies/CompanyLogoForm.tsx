"use client";

import { useActionState } from "react";
import styles from "../admin.module.css";
import { updateCompanyLogo, type ActionState } from "../actions/companies";

const initialState: ActionState = { ok: false, error: null };

type Props = {
  companyId: number;
  logoUrl: string | null;
};

export default function CompanyLogoForm({ companyId, logoUrl }: Props) {
  const [state, formAction] = useActionState(updateCompanyLogo, initialState);

  return (
    <form action={formAction} className={`${styles.companyFormCard} ${styles.logoForm}`}>
      <div className={styles.companyFormIntro}>
        <h2 className={styles.companyFormTitle}>Logo</h2>
        <p className={styles.companyFormHint}>
          Recommended square PNG, SVG, or WEBP up to 1 MB.
        </p>
      </div>
      <div className={styles.companyLogoPreview}>
        <img
          src={logoUrl || "/logo-placeholder.png"}
          alt="Company logo"
          className={styles.companyLogoImage}
        />
      </div>
      <input type="hidden" name="companyId" value={companyId} />
      <input
        name="logo"
        type="file"
        accept="image/*"
        className={styles.input}
        aria-label="Upload company logo"
        required
      />
      <div className={styles.formActions}>
        <button className={styles.btn} type="submit">
          Upload logo
        </button>
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
