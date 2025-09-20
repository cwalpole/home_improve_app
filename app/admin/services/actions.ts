"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ServiceActionState = { ok: boolean; error?: string };

export async function createOrUpdateService(
  _prev: ServiceActionState,
  formData: FormData
): Promise<ServiceActionState> {
  const data = {
    slug: String(formData.get("slug") || ""),
    title: String(formData.get("title") || ""),
    heroImage: formData.get("heroImage")
      ? String(formData.get("heroImage"))
      : undefined,
    order: Number(formData.get("order") || 0),
    excerpt: formData.get("excerpt")
      ? String(formData.get("excerpt"))
      : undefined,
    content: formData.get("content")
      ? String(formData.get("content"))
      : undefined,
  };

  if (!data.slug || !data.title)
    return { ok: false, error: "slug and title required" };

  await prisma.service.upsert({
    where: { slug: data.slug },
    update: { ...data },
    create: { ...data },
  });

  revalidatePath("/services");
  revalidatePath(`/services/${data.slug}`);
  revalidatePath("/");
  return { ok: true };
}
