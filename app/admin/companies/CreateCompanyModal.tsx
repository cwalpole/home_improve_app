"use client";

import { useCallback, useState } from "react";
import CreateCompanyForm from "./CreateCompanyForm";
import styles from "../admin.module.css";

export default function CreateCompanyModal() {
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <button className={styles.btn} type="button" onClick={() => setOpen(true)}>
        + New Company
      </button>

      {open ? (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
          <div className={styles.modalPanel}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Add company</h3>
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
              Enter the company name and optional website URL.
            </p>
            <CreateCompanyForm onCompleted={handleClose} hideStatus />
          </div>
        </div>
      ) : null}
    </>
  );
}
