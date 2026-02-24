"use client";

import { useActionState, useRef, useState } from "react";
import Image from "next/image";
import styles from "../admin.module.css";
import { updateCompanyHero, type ActionState } from "../actions/companies";
import CoverUpload from "../blogs/components/CoverUpload";

const initialState: ActionState = { ok: false, error: null };

type Props = {
  companyId: number;
  heroImageUrl: string | null;
  heroImagePublicId?: string | null;
};

export default function CompanyHeroForm({
  companyId,
  heroImageUrl,
  heroImagePublicId,
}: Props) {
  const [state, formAction] = useActionState(updateCompanyHero, initialState);
  const [heroUrl, setHeroUrl] = useState(heroImageUrl || "");
  const [heroPublicId, setHeroPublicId] = useState(heroImagePublicId || "");
  const originalHeroPublicId = useRef(heroImagePublicId || "");

  return (
    <form action={formAction} className={styles.companyFormCard}>
      <div className={styles.companyFormIntro}>
        <h2 className={styles.companyFormTitle}>Hero Image</h2>
        <p className={styles.companyFormHint}>
          Ideal size: 1920×1080px (16:9).
        </p>
        <p className={styles.companyFormHint}>
          Click Save Hero Image to apply image changes.
        </p>
      </div>

      <div className={styles.heroPreview}>
        <Image
          src={heroUrl || "/logo-placeholder.png"}
          alt="Company hero"
          width={640}
          height={360}
          className={styles.heroPreviewImage}
          unoptimized
        />
      </div>
      <div className={styles.inlineField}>
        <input
          name="heroImageUrl"
          value={heroUrl}
          onChange={(e) => setHeroUrl(e.target.value)}
          className={styles.input}
          placeholder="https://...hero.jpg"
        />
        <CoverUpload
          onUploaded={({ url, publicId }) => {
            setHeroUrl(url);
            setHeroPublicId(publicId);
          }}
        />
      </div>
      <button
        type="button"
        className={`${styles.btn} ${styles.secondary}`}
        onClick={() => {
          setHeroUrl("");
          setHeroPublicId("");
        }}
      >
        Clear Hero Image
      </button>

      <input type="hidden" name="companyId" value={companyId} />
      <input
        type="hidden"
        name="heroImagePublicId"
        value={heroPublicId}
      />
      <input
        type="hidden"
        name="existingHeroImagePublicId"
        value={originalHeroPublicId.current}
      />

      <div className={styles.formActions}>
        <button className={styles.btn} type="submit">
          Save Hero Image
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
