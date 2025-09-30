// ui/ServiceImage.tsx
"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

type Props = {
  slug: string;
  /** Path to fallback image in /public, default '/services/default.jpg' */
  fallback?: string;
  alt?: string;
  /** File extension to try first for the per-service asset */
  ext?: "jpg" | "png" | "webp";
} & Omit<ImageProps, "src" | "alt">;

export default function ServiceImage({
  slug,
  fallback = "/services/default.png",
  ext = "png",
  alt,
  ...imgProps
}: Props) {
  const [src, setSrc] = useState(`/services/${slug}.${ext}`);
  return (
    <Image
      {...imgProps}
      src={src}
      alt={alt ?? `${slug} image`}
      onError={() => setSrc(fallback)}
    />
  );
}
