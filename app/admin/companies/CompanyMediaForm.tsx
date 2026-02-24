"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import styles from "../admin.module.css";
import { updateCompanyMedia, type ActionState } from "../actions/companies";
import CoverUpload from "../blogs/components/CoverUpload";

const initialState: ActionState = { ok: false, error: null };

type GalleryImage = { url: string; publicId: string | null };

type Props = {
  companyId: number;
  galleryImages?: unknown | null;
  galleryFeaturedIndex?: number | null;
};

function normalizeGalleryImages(input: unknown): GalleryImage[] {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const record = item as { url?: unknown; publicId?: unknown };
        const url = typeof record.url === "string" ? record.url.trim() : "";
        const publicId =
          typeof record.publicId === "string" ? record.publicId.trim() : null;
        if (!url) return null;
        return { url, publicId };
      })
      .filter((item): item is GalleryImage => Boolean(item));
  }
  if (typeof input === "string") {
    try {
      return normalizeGalleryImages(JSON.parse(input));
    } catch {
      return [];
    }
  }
  return [];
}

export default function CompanyMediaForm({
  companyId,
  galleryImages,
  galleryFeaturedIndex,
}: Props) {
  const [state, formAction] = useActionState(updateCompanyMedia, initialState);
  const initialGallery = useMemo(
    () => normalizeGalleryImages(galleryImages),
    [galleryImages]
  );
  const [gallery, setGallery] = useState<GalleryImage[]>(initialGallery);
  const originalGallery = useRef(initialGallery);
  const [dirty, setDirty] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(
    typeof galleryFeaturedIndex === "number" ? galleryFeaturedIndex : 0
  );

  const maxGalleryImages = 5;
  const gallerySlotsLeft = Math.max(0, maxGalleryImages - gallery.length);

  useEffect(() => {
    if (state.ok && !state.error) {
      setDirty(false);
    }
  }, [state.ok, state.error]);

  return (
    <form action={formAction} className={styles.companyFormCard}>
      <div className={styles.companyFormIntro}>
        <h2 className={styles.companyFormTitle}>Company media</h2>
        <p className={styles.companyFormHint}>
          Upload a hero image and up to 5 gallery images for the public profile.
        </p>
      </div>

      <div className={styles.mediaSection}>
        <div className={styles.mediaHeader}>
          <h3>Gallery</h3>
          <span className={styles.mutedSmall}>
            {gallery.length}/{maxGalleryImages} images selected
          </span>
        </div>
        <p className={styles.mutedSmall}>
          Click Save Media to apply image changes.
        </p>
        <p className={styles.mutedSmall}>
          Ideal size: 1200×900px (4:3).
        </p>
        <div className={styles.mediaGalleryGrid}>
          {gallery.length ? (
            gallery.map((img, index) => (
              <div key={`${img.url}-${index}`} className={styles.mediaThumb}>
                <Image
                  src={img.url}
                  alt={`Gallery image ${index + 1}`}
                  width={160}
                  height={120}
                  className={styles.mediaThumbImage}
                  unoptimized
                />
                <button
                  type="button"
                  className={styles.mediaRemove}
                  onClick={() => {
                    setGallery((prev) => {
                      const next = prev.filter((_, itemIndex) => itemIndex !== index);
                      if (!next.length) {
                        setFeaturedIndex(0);
                      } else if (featuredIndex === index) {
                        setFeaturedIndex(0);
                      } else if (featuredIndex > index) {
                        setFeaturedIndex((prevIndex) => Math.max(0, prevIndex - 1));
                      }
                      return next;
                    });
                    setDirty(true);
                  }}
                >
                  Remove
                </button>
                <label className={styles.featuredSelect}>
                  <input
                    type="radio"
                    name="featuredGallery"
                    checked={featuredIndex === index}
                    onChange={() => {
                      setFeaturedIndex(index);
                      setDirty(true);
                    }}
                  />
                  Featured
                </label>
              </div>
            ))
          ) : (
            <div className={styles.mediaEmpty}>No gallery images yet.</div>
          )}
        </div>
        <div className={styles.mediaGalleryActions}>
          <CoverUpload
            onUploaded={({ url, publicId }) => {
              if (gallery.length >= maxGalleryImages) return;
              setGallery((prev) => [...prev, { url, publicId }]);
              setDirty(true);
              if (!gallery.length) {
                setFeaturedIndex(0);
              }
            }}
          />
          <span className={styles.mutedSmall}>
            {gallerySlotsLeft
              ? `${gallerySlotsLeft} upload${gallerySlotsLeft === 1 ? "" : "s"} remaining`
              : "Gallery limit reached"}
          </span>
        </div>
      </div>

      <input type="hidden" name="companyId" value={companyId} />
      <input
        type="hidden"
        name="galleryImages"
        value={JSON.stringify(gallery)}
      />
      <input
        type="hidden"
        name="galleryFeaturedIndex"
        value={featuredIndex}
      />
      <input
        type="hidden"
        name="existingGalleryImages"
        value={JSON.stringify(originalGallery.current)}
      />

      <div className={styles.formActions}>
        <button className={styles.btn} type="submit">
          Save Media
        </button>
        {state.ok && !state.error && !dirty ? (
          <span className={styles.statusPositive}>Saved</span>
        ) : null}
        {state.error ? (
          <span className={styles.statusNegative}>{state.error}</span>
        ) : null}
      </div>
    </form>
  );
}
