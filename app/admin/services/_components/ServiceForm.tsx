"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import styles from "./ServiceForm.module.css";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function SubmitBtn({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={styles.button} disabled={pending}>
      {pending ? "Saving…" : label}
    </button>
  );
}

export default function ServiceForm({
  action,
  initial,
  submitLabel = "Save Service",
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: {
    name?: string;
    slug?: string;
    heroImage?: string | null;
    order?: number;
  };
  submitLabel?: string;
}) {
  const [name, setName] = React.useState(initial?.name ?? "");
  const [slug, setSlug] = React.useState(initial?.slug ?? "");
  const [heroImage, setHeroImage] = React.useState(initial?.heroImage ?? "");
  const [order, setOrder] = React.useState(initial?.order ?? 0);

  return (
    <form action={action} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => {
            if (!slug) setSlug(slugify(name));
          }}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="slug" className={styles.label}>
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          required
          pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
          className={styles.input}
          value={slug}
          onChange={(e) => setSlug(e.target.value.toLowerCase())}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="heroImage" className={styles.label}>
          Hero Image URL (optional)
        </label>
        <input
          id="heroImage"
          name="heroImage"
          className={styles.input}
          placeholder="https://…"
          value={heroImage ?? ""}
          onChange={(e) => setHeroImage(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="order" className={styles.label}>
          Order
        </label>
        <input
          id="order"
          name="order"
          type="number"
          min={0}
          className={styles.input}
          value={order}
          onChange={(e) => setOrder(parseInt(e.target.value || "0", 10))}
        />
      </div>

      <div className={styles.row}>
        <SubmitBtn label={submitLabel} />
      </div>
    </form>
  );
}
