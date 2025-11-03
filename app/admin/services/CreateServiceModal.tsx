"use client";

import { useCallback, useState } from "react";
import CreateServiceForm from "./CreateServiceForm";
import styles from "../admin.module.css";

export default function CreateServiceModal() {
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <button className={styles.btn} type="button" onClick={() => setOpen(true)}>
        + New Service
      </button>

      {open ? (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
          <div className={styles.modalPanel}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Add service</h3>
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
              Provide the service name and URL slug.
            </p>
            <CreateServiceForm onCompleted={handleClose} hideStatus />
          </div>
        </div>
      ) : null}
    </>
  );
}
