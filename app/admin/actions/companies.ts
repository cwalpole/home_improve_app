"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
  return { ok: true, error: null };
}

export async function deleteCompany(id: number): Promise<{ ok: boolean }> {
  await prisma.company.delete({ where: { id } });
  revalidatePath("/admin/companies");
  return { ok: true };
}
