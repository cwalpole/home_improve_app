export function serviceImageUrl(
  slug: string,
  ext: "jpg" | "png" | "webp" = "png"
) {
  return `/services/${slug}.${ext}`;
}
