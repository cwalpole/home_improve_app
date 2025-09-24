"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type ActionState = { ok: boolean; error?: string };

const companySchema = z.object({
  id: z.string().optional(), // when present => update
  name: z.string().min(1, "Name is required"),
  tagline: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  logoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export async function upsertCompany(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const parsed = companySchema.parse({
      id: formData.get("id")?.toString(),
      name: formData.get("name")?.toString() ?? "",
      tagline: formData.get("tagline")?.toString() || undefined,
      phone: formData.get("phone")?.toString() || undefined,
      email: formData.get("email")?.toString() || undefined,
      address: formData.get("address")?.toString() || undefined,
      city: formData.get("city")?.toString() || undefined,
      region: formData.get("region")?.toString() || undefined,
      postalCode: formData.get("postalCode")?.toString() || undefined,
      country: formData.get("country")?.toString() || undefined,
      logoUrl: formData.get("logoUrl")?.toString() || undefined,
    });

    const data = {
      name: parsed.name,
      tagline: parsed.tagline,
      phone: parsed.phone,
      email: parsed.email || undefined,
      address: parsed.address,
      city: parsed.city,
      region: parsed.region,
      postalCode: parsed.postalCode,
      country: parsed.country,
      logoUrl: parsed.logoUrl || undefined,
    };

    if (parsed.id) {
      await prisma.company.update({
        where: { id: Number(parsed.id) },
        data,
      });
    } else {
      await prisma.company.create({ data });
    }

    // Revalidate admin list and any pages that read company info
    revalidatePath("/admin/companies");
    revalidatePath("/"); // if you surface company info on home, keep this
    return { ok: true };
  } catch (e: unknown) {
    const msg =
      e instanceof z.ZodError
        ? e.issues.map((i) => i.message).join(", ")
        : "Failed to save company";
    return { ok: false, error: msg };
  }
}

export async function deleteCompany(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const id = Number(formData.get("id"));
    if (!id) return { ok: false, error: "Missing id" };

    await prisma.company.delete({ where: { id } });
    revalidatePath("/admin/companies");
    revalidatePath("/");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to delete company" };
  }
}
