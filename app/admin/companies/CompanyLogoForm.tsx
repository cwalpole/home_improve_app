"use client";

import { useActionState, useState, useRef } from "react";
import Image from "next/image";
import styles from "../admin.module.css";
import { updateCompanyLogo, type ActionState } from "../actions/companies";
import CoverUpload from "../blogs/components/CoverUpload";

const initialState: ActionState = { ok: false, error: null };

type Props = {
  companyId: number;
  logoUrl: string | null;
  logoPublicId?: string | null;
};

export default function CompanyLogoForm({ companyId, logoUrl, logoPublicId }: Props) {
  const [state, formAction] = useActionState(updateCompanyLogo, initialState);
  const [url, setUrl] = useState(logoUrl || "");
  const [publicId, setPublicId] = useState(logoPublicId || "");
  const originalPublicId = useRef(logoPublicId || "");

  return (
    <form action={formAction} className={`${styles.companyFormCard} ${styles.logoForm}`}>
      <div className={styles.companyFormIntro}>
        <h2 className={styles.companyFormTitle}>Logo</h2>
      </div>
      <div className={styles.companyLogoPreview}>
        <Image
          src={url || "/logo-placeholder.png"}
          alt="Company logo"
          width={160}
          height={160}
          className={styles.companyLogoImage}
          unoptimized
        />
      </div>
      <input type="hidden" name="companyId" value={companyId} />
      <input type="hidden" name="existingLogoPublicId" value={originalPublicId.current} />
      {/* submit the current logo URL */}
      <input type="hidden" name="logoUrl" value={url} />
      <input type="hidden" name="logoPublicId" value={publicId} />
      <div className={styles.inlineField}>
        <input
          name="logoUrl"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={styles.input}
          placeholder="https://...logo.png"
        />
        <CoverUpload
          onUploaded={({ url, publicId }) => {
            setUrl(url);
            setPublicId(publicId);
          }}
        />
      </div>
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
