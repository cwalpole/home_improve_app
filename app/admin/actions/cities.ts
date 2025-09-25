"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ActionState = { ok: boolean; error: string | null };

function deriveRegionSlug(
  regionCode: string | null | undefined
): string | null {
  const v = (regionCode ?? "").trim();
  return v ? v.toLowerCase() : null;
}

export async function createCity(
  prev: ActionState,
  fd: FormData
): Promise<ActionState> {
  const name = String(fd.get("name") || "").trim();
  const slug = String(fd.get("slug") || "")
    .trim()
    .toLowerCase();
  const regionCode = (String(fd.get("regionCode") || "").trim() || null) as
    | string
    | null;
  const regionSlug = deriveRegionSlug(regionCode);

  if (!name || !slug) return { ok: false, error: "Name and slug are required" };

  await prisma.city.create({ data: { name, slug, regionCode, regionSlug } });
  revalidatePath("/admin/cities");
  return { ok: true, error: null };
}

export async function updateCity(
  prev: ActionState,
  fd: FormData
): Promise<ActionState> {
  const id = Number(fd.get("id"));
  const name = String(fd.get("name") || "").trim();
  const slug = String(fd.get("slug") || "")
    .trim()
    .toLowerCase();
  const regionCode = (String(fd.get("regionCode") || "").trim() || null) as
    | string
    | null;
  const regionSlug = deriveRegionSlug(regionCode);

  if (!id || !name || !slug) return { ok: false, error: "Missing fields" };

  await prisma.city.update({
    where: { id },
    data: { name, slug, regionCode, regionSlug },
  });
  revalidatePath("/admin/cities");
  return { ok: true, error: null };
}

export async function deleteCityById(id: number): Promise<{ ok: boolean }> {
  await prisma.city.delete({ where: { id } });
  revalidatePath("/admin/cities");
  return { ok: true };
}
