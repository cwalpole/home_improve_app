"use client";

import { useActionState } from "react";
import HtmlEditor from "../components/HtmlEditor";
import styles from "../admin.module.css";
import {
  updateServiceCityContent,
  type MappingActionState,
} from "../actions/mappings";

const initialState: MappingActionState = { ok: false, error: null };

type Props = {
  mappingId: number;
  defaultContent: string | null;
};

export default function ServiceCityContentForm({
  mappingId,
  defaultContent,
}: Props) {
  const [state, formAction] = useActionState(
    updateServiceCityContent,
    initialState
  );

  return (
    <form action={formAction} className={styles.contentForm}>
      <input type="hidden" name="serviceCityId" value={mappingId} />
      <HtmlEditor
        id={`service-city-${mappingId}-content-detail`}
        name="contentHtml"
        label="Service page content"
        defaultValue={defaultContent ?? ""}
        placeholder="Paste or write HTML content that should appear on the service page."
        helpText="Remove all content to fall back to the default template."
      />
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
