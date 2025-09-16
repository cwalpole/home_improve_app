"use client";
import { useActionState } from "react";
import { createOrUpdateService } from "./actions";
import styles from "./form.module.css";

export default function AdminServices() {
  const [state, action] = useActionState(createOrUpdateService, {
    ok: false,
  } as any);

  return (
    <main className={styles.wrap}>
      <h1 className={styles.title}>Services (Admin)</h1>

      {state?.error && <p className={styles.error}>{state.error}</p>}
      {state?.ok && <p className={styles.success}>Saved ✓</p>}

      <form action={action} className={styles.form}>
        <div className={styles.row}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            required
            className={styles.input}
            placeholder="Residential Renovations"
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="slug">Slug</label>
          <div className={styles.inline}>
            <input
              id="slug"
              name="slug"
              required
              className={styles.input}
              placeholder="residential-renovations"
            />
            <input
              id="order"
              name="order"
              type="number"
              className={styles.input}
              placeholder="order (0…)"
            />
          </div>
          <div className={styles.hint}>
            Used in the URL (unique). Keep it short and lowercase.
          </div>
        </div>

        <div className={styles.row}>
          <label htmlFor="heroImage">Hero image URL</label>
          <input
            id="heroImage"
            name="heroImage"
            className={styles.input}
            placeholder="https://…"
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="excerpt">Excerpt</label>
          <textarea
            id="excerpt"
            name="excerpt"
            className={styles.textarea}
            placeholder="Short summary shown in lists and SEO."
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="content">Content (HTML)</label>
          <textarea
            id="content"
            name="content"
            className={styles.textarea}
            placeholder="<p>Full service description…</p>"
          />
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.btn}>
            Save
          </button>
          <button type="reset" className={styles.secondary}>
            Reset
          </button>
        </div>
      </form>
    </main>
  );
}
