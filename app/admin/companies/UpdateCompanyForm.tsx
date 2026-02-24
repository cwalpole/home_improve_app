"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { updateCompany, type ActionState } from "../actions/companies";
import styles from "../admin.module.css";
import HtmlEditor from "../components/HtmlEditor";

const initial: ActionState = { ok: false, error: null };

export default function UpdateCompanyForm(props: {
  id: number;
  name: string;
  tagline: string | null;
  url: string | null;
  companySummary: string | null;
  servicesOffered?: unknown | null;
}) {
  const [state, formAction] = useActionState(updateCompany, initial);
  const initialServices = useMemo(() => {
    if (!props.servicesOffered) return [] as string[];
    if (Array.isArray(props.servicesOffered)) {
      return props.servicesOffered
        .map((item) => (typeof item === "string" ? item : ""))
        .filter(Boolean);
    }
    if (typeof props.servicesOffered === "string") {
      try {
        const parsed = JSON.parse(props.servicesOffered);
        if (Array.isArray(parsed)) {
          return parsed
            .map((item) => (typeof item === "string" ? item : ""))
            .filter(Boolean);
        }
      } catch {
        return [];
      }
    }
    return [];
  }, [props.servicesOffered]);

  const [servicesOffered, setServicesOffered] = useState(
    initialServices.length ? initialServices : [""]
  );
  const maxServices = 6;
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (state.ok && !state.error) {
      setShowSaved(true);
    }
  }, [state.ok, state.error]);

  const markDirty = () => setShowSaved(false);

  return (
    <form action={formAction} className={styles.companyFormCard}>
      <div className={styles.companyFormIntro}>
        <h2 className={styles.companyFormTitle}>Company Details</h2>
        <p className={styles.companyFormHint}>
          Update the company name and optional public website link.
        </p>
      </div>
      <input type="hidden" name="id" value={props.id} />
      <label className={styles.companyField}>
        <span className={styles.companyFieldLabel}>Company Name</span>
        <input
          name="name"
          defaultValue={props.name}
          className={styles.input}
          placeholder="Enter company name"
          onChange={markDirty}
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
          onChange={markDirty}
        />
      </label>

      <label className={styles.companyField}>
        <span className={styles.companyFieldLabel}>Tag Line</span>
        <input
          name="tagline"
          defaultValue={props.tagline ?? ""}
          className={styles.input}
          placeholder="Premium upgrades built for local homeowners."
          onChange={markDirty}
        />
      </label>

      <label className={styles.companyField}>
        <span className={styles.companyFieldLabel}>Company Summary</span>
        <textarea
          name="companySummary"
          defaultValue={props.companySummary ?? ""}
          className={styles.textarea}
          placeholder="Short summary shown on the company profile."
          onChange={markDirty}
        />
      </label>

      <div className={styles.companyField}>
        <span className={styles.companyFieldLabel}>Services Offered</span>
        <span className={styles.companyFormHint}>
          Add up to {maxServices} list items. Each item supports rich text.
        </span>
        <div className={styles.servicesEditorList}>
          {servicesOffered.map((item, index) => (
            <div key={`${index}`} className={styles.servicesEditorItem}>
              <HtmlEditor
                name={`servicesOffered_${index}`}
                label={`List Item ${index + 1}`}
                defaultValue={item}
                placeholder="Describe a specific service offering."
                onDirty={markDirty}
              />
              {servicesOffered.length > 1 ? (
                <button
                  type="button"
                  className={styles.linkButton}
                  onClick={() => {
                    setServicesOffered((prev) =>
                      prev.filter((_, itemIndex) => itemIndex !== index)
                    );
                    markDirty();
                  }}
                >
                  Remove Item
                </button>
              ) : null}
            </div>
          ))}
        </div>
        <div className={styles.servicesEditorActions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.secondary}`}
            disabled={servicesOffered.length >= maxServices}
            onClick={() => {
              setServicesOffered((prev) => [...prev, ""]);
              markDirty();
            }}
          >
            Add Item
          </button>
          <span className={styles.mutedSmall}>
            {servicesOffered.length}/{maxServices} items
          </span>
        </div>
      </div>

      <input
        type="hidden"
        name="servicesOfferedCount"
        value={servicesOffered.length}
      />

      <div className={styles.actionsRow}>
        {showSaved && !state.error ? (
          <span className={styles.savedMessage}>Saved</span>
        ) : null}
        {state.error ? (
          <span className={styles.errorMessage}>{state.error}</span>
        ) : null}
        <button className={styles.btn}>Save Details</button>
      </div>
    </form>
  );
}
