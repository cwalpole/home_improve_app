"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ServiceInput = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  heroImage: z.string().url().optional(),
  order: z.number().int().nonnegative().optional(),
});

export async function createOrUpdateService(
  prevState: any,
  formData: FormData
) {
  const parsed = ServiceInput.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    excerpt: formData.get("excerpt") || undefined,
    content: formData.get("content") || undefined,
    heroImage: formData.get("heroImage") || undefined,
    order: Number(formData.get("order") || 0),
  });
  if (!parsed.success) {
    return { ok: false, error: "Invalid input" };
  }
  const data = parsed.data;
  await prisma.service.upsert({
    where: { slug: data.slug },
    update: { ...data },
    create: { ...data },
  });

  // Revalidate listings and the detail page
  revalidatePath("/services");
  revalidatePath(`/services/${data.slug}`);
  revalidatePath("/"); // if home lists services
  return { ok: true };
}
