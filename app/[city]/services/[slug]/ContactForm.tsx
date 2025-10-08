"use client";

import { useState } from "react";
import styles from "./ServiceDetail.module.css";

type Props = {
  city: string;
  citySlug: string;
  service: string;
  serviceSlug: string;
  providerCompanyId: string | null;
  serviceCityId: number | null;
};

export default function ContactForm({
  city,
  citySlug,
  service,
  serviceSlug,
  providerCompanyId,
  serviceCityId,
}: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">(
    "idle"
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    const form = e.currentTarget;
    const body = new FormData(form);
    body.set("city", city);
    body.set("citySlug", citySlug);
    body.set("service", service);
    body.set("serviceSlug", serviceSlug);

    try {
      const res = await fetch("/api/contact", { method: "POST", body });
      setStatus(res.ok ? "ok" : "err");
      if (res.ok) form.reset();
    } catch {
      setStatus("err");
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {/* hidden context for routing the lead */}
      <input type="hidden" name="city" value={city} />
      <input type="hidden" name="citySlug" value={citySlug} />
      <input type="hidden" name="service" value={service} />
      <input type="hidden" name="serviceSlug" value={serviceSlug} />
      {providerCompanyId != null && (
        <input
          type="hidden"
          name="providerCompanyId"
          value={providerCompanyId}
        />
      )}
      {serviceCityId != null && (
        <input type="hidden" name="serviceCityId" value={serviceCityId} />
      )}

      <div className={styles.formRow}>
        <label className={styles.label}>
          Name
          <input name="name" type="text" required className={styles.input} />
        </label>

        <label className={styles.label}>
          Email
          <input name="email" type="email" required className={styles.input} />
        </label>

        <label className={styles.label}>
          Phone (optional)
          <input name="phone" type="tel" className={styles.input} />
        </label>

        <label className={styles.label}>
          Preferred date (optional)
          <input name="date" type="date" className={styles.input} />
        </label>

        <label className={`${styles.label} ${styles.colSpan}`}>
          Project details
          <textarea
            name="message"
            rows={5}
            placeholder={`Tell us about your ${service.toLowerCase()} needs…`}
            className={styles.textarea}
          />
        </label>
      </div>

      <div className={styles.formFoot}>
        <button
          className={styles.ctaPrimary}
          type="submit"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending…" : "Request free quote"}
        </button>
        <span className={styles.formNote}>
          By submitting, you agree to be contacted about your request.
        </span>
      </div>

      {status === "ok" && (
        <div className={styles.bannerOk}>
          Thanks! We’ll be in touch shortly.
        </div>
      )}
      {status === "err" && (
        <div className={styles.bannerErr}>
          Something went wrong. Please try again.
        </div>
      )}
    </form>
  );
}
