"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Buffer } from "node:buffer";

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
  const file = fd.get("logo") as File | null;

  if (!id || !file) {
    return { ok: false, error: "Logo file is required" };
  }

  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "File must be an image" };
  }

  if (file.size > 2 * 1024 * 1024) {
    return { ok: false, error: "Image must be under 2MB" };
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const dataUrl = `data:${file.type};base64,${base64}`;

  await prisma.company.update({
    where: { id },
    data: { logoUrl: dataUrl },
  });

  revalidatePath("/admin/companies");
  revalidatePath(`/admin/companies/${id}`);
  return { ok: true, error: null };
}

export async function deleteCompany(id: number): Promise<{ ok: boolean }> {
  await prisma.company.delete({ where: { id } });
  revalidatePath("/admin/companies");
  revalidatePath(`/admin/companies/${id}`);
  return { ok: true };
}
