"use client";

import { useActionState, useEffect, useRef } from "react";
import { createCity, type ActionState } from "../actions/cities";
import styles from "../admin.module.css";

const initial: ActionState = { ok: false, error: null };

type Props = {
  onCompleted?: () => void;
  hideStatus?: boolean;
};

export default function CreateCityForm({
  onCompleted,
  hideStatus = false,
}: Props) {
  const [state, formAction] = useActionState(createCity, initial);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (state.ok && !state.error) {
      formRef.current?.reset();
      onCompleted?.();
    }
  }, [state.ok, state.error, onCompleted]);

  return (
    <form ref={formRef} action={formAction} className={styles.formInline}>
      <input name="name" placeholder="Name" className={styles.input} required />
      <input
        name="slug"
        placeholder="URL (e.g., calgary)"
        className={styles.input}
        required
      />
      <input
        name="regionCode"
        placeholder="regionCode (e.g., AB)"
        className={styles.input}
      />
      <button className={styles.btn}>Create</button>
      {!hideStatus && state.error && (
        <span style={{ color: "#f87171", marginLeft: 8 }}>{state.error}</span>
      )}
      {!hideStatus && state.ok && !state.error && (
        <span style={{ color: "#86efac", marginLeft: 8 }}>Saved</span>
      )}
    </form>
  );
}
