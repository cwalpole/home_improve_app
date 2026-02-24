"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { deleteImage } from "@/lib/cloudinary";

export type ActionState = { ok: boolean; error: string | null };
type GalleryImage = { url: string; publicId: string | null };

export async function createCompany(
  prev: ActionState,
  fd: FormData
): Promise<ActionState> {
  const name = String(fd.get("name") || "").trim();
  const url = (String(fd.get("url") || "").trim() || null) as string | null;
  if (!name) return { ok: false, error: "Name is required" };

  await prisma.company.create({ data: { name, url } });
  revalidatePath("/admin/companies");
  return { ok: true, error: null };
}

export async function updateCompany(
  prev: ActionState,
  fd: FormData
): Promise<ActionState> {
  const id = Number(fd.get("id"));
  const name = String(fd.get("name") || "").trim();
  const url = (String(fd.get("url") || "").trim() || null) as string | null;
  const tagline = (String(fd.get("tagline") || "").trim() || null) as
    | string
    | null;
  const companySummary = (String(fd.get("companySummary") || "").trim() ||
    null) as string | null;
  const servicesOfferedCount = Number(fd.get("servicesOfferedCount") || 0);
  const servicesOffered = normalizeServicesOffered(fd, servicesOfferedCount);
  if (!id || !name) return { ok: false, error: "Missing fields" };

  await prisma.company.update({
    where: { id },
    data: {
      name,
      url,
      tagline,
      companySummary,
      servicesOffered: servicesOffered.length
        ? servicesOffered
        : Prisma.DbNull,
    },
  });
  revalidatePath("/admin/companies");
  revalidatePath(`/admin/companies/${id}`);
  return { ok: true, error: null };
}

export async function updateCompanyLogo(
  prev: ActionState,
  fd: FormData
): Promise<ActionState> {
  const id = Number(fd.get("companyId"));
  const logoUrl = String(fd.get("logoUrl") || "").trim();
  const rawPublicId = String(fd.get("logoPublicId") || "").trim();
  const logoPublicId =
    rawPublicId ||
    extractPublicIdFromCloudinaryUrl(logoUrl) ||
    null;
  const existingLogoPublicId = String(fd.get("existingLogoPublicId") || "").trim() || null;

  if (!id || !logoUrl) {
    return { ok: false, error: "Logo URL is required" };
  }

  await prisma.company.update({
    where: { id },
    data: { logoUrl, logoPublicId },
  });

  if (existingLogoPublicId && existingLogoPublicId !== logoPublicId) {
    await deleteImage(existingLogoPublicId);
  }

  revalidatePath("/admin/companies");
  revalidatePath(`/admin/companies/${id}`);
  return { ok: true, error: null };
}

export async function updateCompanyMedia(
  prev: ActionState,
  fd: FormData
): Promise<ActionState> {
  const id = Number(fd.get("companyId"));
  if (!id) return { ok: false, error: "Missing company ID" };

  const galleryImages = normalizeGalleryImages(
    String(fd.get("galleryImages") || "")
  ).slice(0, 5);
  const featuredIndexRaw = Number(fd.get("galleryFeaturedIndex"));
  const featuredIndex =
    Number.isFinite(featuredIndexRaw) && featuredIndexRaw >= 0
      ? featuredIndexRaw
      : 0;
  const existingGalleryImages = normalizeGalleryImages(
    String(fd.get("existingGalleryImages") || "")
  );

  await prisma.company.update({
    where: { id },
    data: {
      galleryImages: galleryImages.length ? galleryImages : Prisma.DbNull,
      galleryFeaturedIndex: galleryImages.length
        ? Math.min(featuredIndex, galleryImages.length - 1)
        : null,
    },
  });

  const previousIds = new Set(
    existingGalleryImages.map((img) => img.publicId).filter(Boolean)
  );
  const nextIds = new Set(
    galleryImages.map((img) => img.publicId).filter(Boolean)
  );
  for (const publicId of previousIds) {
    if (!nextIds.has(publicId)) {
      await deleteImage(publicId);
    }
  }

  revalidatePath("/admin/companies");
  revalidatePath(`/admin/companies/${id}`);
  return { ok: true, error: null };
}

export async function updateCompanyHero(
  prev: ActionState,
  fd: FormData
): Promise<ActionState> {
  const id = Number(fd.get("companyId"));
  if (!id) return { ok: false, error: "Missing company ID" };

  const heroImageUrlRaw = String(fd.get("heroImageUrl") || "").trim();
  const heroImageUrl = heroImageUrlRaw || null;
  const heroPublicIdRaw = String(fd.get("heroImagePublicId") || "").trim();
  const heroImagePublicId =
    heroPublicIdRaw ||
    (heroImageUrl ? extractPublicIdFromCloudinaryUrl(heroImageUrl) : null);

  const existingHeroPublicId =
    String(fd.get("existingHeroImagePublicId") || "").trim() || null;

  await prisma.company.update({
    where: { id },
    data: {
      heroImageUrl,
      heroImagePublicId,
    },
  });

  if (existingHeroPublicId && existingHeroPublicId !== heroImagePublicId) {
    await deleteImage(existingHeroPublicId);
  }

  revalidatePath("/admin/companies");
  revalidatePath(`/admin/companies/${id}`);
  return { ok: true, error: null };
}

function extractPublicIdFromCloudinaryUrl(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (!u.hostname.includes("res.cloudinary.com")) return null;
    // Cloudinary public_id is the path after `/upload/` without extension
    const match = u.pathname.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

function normalizeServicesOffered(fd: FormData, count: number): string[] {
  if (!count) return [];
  const items: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const value = String(fd.get(`servicesOffered_${i}`) || "").trim();
    if (!value) continue;
    items.push(value);
  }
  return items;
}

function normalizeGalleryImages(input: string): GalleryImage[] {
  if (!input) return [];
  try {
    const parsed = JSON.parse(input);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const record = item as { url?: unknown; publicId?: unknown };
        const url = typeof record.url === "string" ? record.url.trim() : "";
        const publicId =
          typeof record.publicId === "string" ? record.publicId.trim() : null;
        if (!url) return null;
        return {
          url,
          publicId: publicId || extractPublicIdFromCloudinaryUrl(url),
        };
      })
      .filter((item): item is GalleryImage => Boolean(item));
  } catch {
    return [];
  }
}

export async function deleteCompany(id: number): Promise<{ ok: boolean }> {
  await prisma.company.delete({ where: { id } });
  revalidatePath("/admin/companies");
  revalidatePath(`/admin/companies/${id}`);
  return { ok: true };
}
