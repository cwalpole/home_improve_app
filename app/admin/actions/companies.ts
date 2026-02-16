"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { deleteImage } from "@/lib/cloudinary";

export type ActionState = { ok: boolean; error: string | null };

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
  if (!id || !name) return { ok: false, error: "Missing fields" };

  await prisma.company.update({ where: { id }, data: { name, url } });
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

export async function deleteCompany(id: number): Promise<{ ok: boolean }> {
  await prisma.company.delete({ where: { id } });
  revalidatePath("/admin/companies");
  revalidatePath(`/admin/companies/${id}`);
  return { ok: true };
}
