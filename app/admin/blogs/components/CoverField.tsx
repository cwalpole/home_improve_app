"use client";

import { useState } from "react";
import CoverUpload from "./CoverUpload";
import styles from "../../admin.module.css";

type Props = {
  id?: string;
  name?: string;
  defaultValue?: string;
  defaultPublicId?: string;
};

export default function CoverField({
  id = "coverImageUrl",
  name = "coverImageUrl",
  defaultValue = "",
  defaultPublicId = "",
}: Props) {
  const [value, setValue] = useState(defaultValue);
  const [publicId, setPublicId] = useState(defaultPublicId);

  return (
    <div className={styles.field}>
      <label htmlFor={id}>Cover Image URL</label>
      <div className={styles.inlineField}>
        <input
          id={id}
          name={name}
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <input type="hidden" name="coverImagePublicId" value={publicId} />
        <CoverUpload
          onUploaded={({ url, publicId }) => {
            setValue(url);
            setPublicId(publicId);
          }}
        />
      </div>
    </div>
  );
}
