"use client";

import { useActionState, useEffect, useState } from "react";
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
  const [showSaved, setShowSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (state.ok && !state.error) {
      setShowSaved(true);
    }
    if (state.ok || state.error) {
      setIsSubmitting(false);
    }
  }, [state.ok, state.error]);

  const markDirty = () => {
    if (isSubmitting) return;
    setShowSaved(false);
  };

  return (
    <form
      action={formAction}
      className={styles.contentForm}
      onSubmit={() => setIsSubmitting(true)}
    >
      <input type="hidden" name="serviceCityId" value={mappingId} />
      <HtmlEditor
        id={`service-city-${mappingId}-content-detail`}
        name="contentHtml"
        label="Service page content"
        defaultValue={defaultContent ?? ""}
        placeholder="Paste or write HTML content that should appear on the service page."
        helpText="Remove all content to fall back to the default template."
        onDirty={markDirty}
      />
      <div className={styles.formActions}>
        <button className={styles.btn} type="submit">
          Save
        </button>
        {showSaved && !state.error ? (
          <span style={{ color: "#86efac" }}>Saved</span>
        ) : null}
        {state.error ? (
          <span style={{ color: "#f87171" }}>{state.error}</span>
        ) : null}
      </div>
    </form>
  );
}
