"use client";

import { useActionState } from "react";
import styles from "../admin.module.css";
import {
  MappingActionState,
  updateCompanyServiceCityFeatured,
} from "../actions/mappings";

const initialState: MappingActionState = { ok: false, error: null };

type Props = {
  serviceCityId: number;
  companyId: number;
  isFeatured: boolean;
};

export default function CompanyServiceCityFeatureForm({
  serviceCityId,
  companyId,
  isFeatured,
}: Props) {
  const [state, formAction] = useActionState(
    updateCompanyServiceCityFeatured,
    initialState
  );

  return (
    <form action={formAction} className={styles.contentForm}>
      <input type="hidden" name="serviceCityId" value={serviceCityId} />
      <input type="hidden" name="companyId" value={companyId} />
      <label className={styles.toggleWrap} htmlFor="isFeatured">
        <span className={styles.toggleSwitch}>
          <input
            id="isFeatured"
            name="isFeatured"
            type="checkbox"
            value="true"
            defaultChecked={isFeatured}
          />
          <span className={styles.toggleSlider} aria-hidden="true" />
        </span>
        Featured listing
      </label>

      <div className={styles.formActions}>
        <button className={styles.btn} type="submit">
          Save
        </button>
        {state.ok && !state.error ? (
          <span style={{ color: "#86efac" }}>Saved</span>
        ) : null}
        {state.error ? (
          <span style={{ color: "#f87171" }}>{state.error}</span>
        ) : null}
      </div>
    </form>
  );
}
