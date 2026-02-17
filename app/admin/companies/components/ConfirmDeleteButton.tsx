"use client";

import { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"button">;

export default function ConfirmDeleteButton({ children, ...rest }: Props) {
  return (
    <button
      {...rest}
      onClick={(e) => {
        if (!confirm("Delete this company and all its mappings? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
