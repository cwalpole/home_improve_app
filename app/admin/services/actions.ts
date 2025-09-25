"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// Matches your Prisma model
const ServiceSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    slug: z
      .string()
      .min(1, "Slug is required")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Use lowercase letters, numbers, and hyphens"
      ),
    heroImage: z
      .union([z.string().url("Must be a valid URL"), z.literal(""), z.null()])
      .optional()
      .transform((v) => (!v || v === "" ? null : v)),
    order: z.coerce.number().int().nonnegative().default(0),
  })
  .transform((v) => ({ ...v, slug: v.slug.toLowerCase() }));

function toObj(fd: FormData) {
  return {
    name: fd.get("name"),
    slug: fd.get("slug"),
    heroImage: fd.get("heroImage"),
    order: fd.get("order"),
  };
}

export async function createServiceAction(formData: FormData) {
  const parsed = ServiceSchema.safeParse(toObj(formData));
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join(", ");
    throw new Error(msg);
  }

  const svc = await prisma.service.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      heroImage: parsed.data.heroImage, // string | null
      order: parsed.data.order,
    },
  });

  revalidatePath("/admin/services");
  redirect(`/admin/services/${svc.id}/edit`);
}

export async function updateServiceAction(id: number, formData: FormData) {
  const parsed = ServiceSchema.safeParse(toObj(formData));
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join(", ");
    throw new Error(msg);
  }

  await prisma.service.update({
    where: { id },
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      heroImage: parsed.data.heroImage,
      order: parsed.data.order,
    },
  });

  revalidatePath("/admin/services");
  redirect(`/admin/services/${id}/edit`);
}

export async function deleteServiceAction(id: number) {
  await prisma.service.delete({ where: { id } });
  revalidatePath("/admin/services");
  redirect("/admin/services");
}
