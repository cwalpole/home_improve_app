"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ActionState = { ok: boolean; error: string | null };

export async function createService(
  prev: ActionState,
  fd: FormData
): Promise<ActionState> {
  const name = String(fd.get("name") || "").trim();
  const slug = String(fd.get("slug") || "")
    .trim()
    .toLowerCase();
  if (!name || !slug) return { ok: false, error: "Name and slug are required" };

  await prisma.service.create({ data: { name, slug } });
  revalidatePath("/admin/services");
  return { ok: true, error: null };
}

export async function updateService(
  prev: ActionState,
  fd: FormData
): Promise<ActionState> {
  const id = Number(fd.get("id"));
  const name = String(fd.get("name") || "").trim();
  const slug = String(fd.get("slug") || "")
    .trim()
    .toLowerCase();
  if (!id || !name || !slug) return { ok: false, error: "Missing fields" };

  await prisma.service.update({ where: { id }, data: { name, slug } });
  revalidatePath("/admin/services");
  return { ok: true, error: null };
}

export async function deleteService(id: number): Promise<{ ok: boolean }> {
  await prisma.service.delete({ where: { id } });
  revalidatePath("/admin/services");
  return { ok: true };
}
