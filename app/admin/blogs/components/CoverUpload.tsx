"use client";

import { useState, useRef } from "react";
import styles from "../../admin.module.css";

type Props = {
  onUploaded: (data: { url: string; publicId: string }) => void;
};

export default function CoverUpload({ onUploaded }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) {
        throw new Error("Upload failed");
      }
      const data: { url: string; publicId: string } = await res.json();
      onUploaded({ url: data.url, publicId: data.publicId });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div className={styles.uploadRow}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{ display: "none" }}
      />
      <button
        type="button"
        className={styles.btn}
        onClick={() => inputRef.current?.click()}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Select"}
      </button>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
