"use client";

import { useCallback, useState } from "react";
import CreateCityForm from "./CreateCityForm";
import styles from "../admin.module.css";

export default function CreateCityModal() {
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <button className={styles.btn} type="button" onClick={() => setOpen(true)}>
        + New City
      </button>

      {open ? (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
          <div className={styles.modalPanel}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Add city</h3>
              <button
                type="button"
                className={styles.modalClose}
                onClick={handleClose}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <p className={styles.modalDescription}>
              Provide the city name, URL slug, and optional region code.
            </p>
            <CreateCityForm onCompleted={handleClose} hideStatus />
          </div>
        </div>
      ) : null}
    </>
  );
}
