"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Service ↔ City
export async function mapServiceToCity(formData: FormData): Promise<void> {
  const serviceId = Number(formData.get("serviceId"));
  const cityId = Number(formData.get("cityId"));
  const contentHtmlRaw = String(formData.get("contentHtml") || "").trim();
  const contentHtml = contentHtmlRaw ? contentHtmlRaw : null;
  if (!serviceId || !cityId) return;

  await prisma.serviceCity.upsert({
    where: { serviceId_cityId: { serviceId, cityId } },
    update: { contentHtml },
    create: { serviceId, cityId, contentHtml },
  });
  revalidatePath("/admin/mappings");
}

export async function unmapServiceFromCity(id: number): Promise<void> {
  await prisma.serviceCity.delete({ where: { id } });
  revalidatePath("/admin/mappings");
}

export async function updateServiceCityContent(
  formData: FormData
): Promise<void> {
  const serviceCityId = Number(formData.get("serviceCityId"));
  const contentHtmlRaw = String(formData.get("contentHtml") || "").trim();
  const contentHtml = contentHtmlRaw ? contentHtmlRaw : null;

  if (!serviceCityId) return;

  await prisma.serviceCity.update({
    where: { id: serviceCityId },
    data: { contentHtml },
  });

  revalidatePath("/admin/mappings");
}

// Company ↔ ServiceCity
// Company ↔ ServiceCity
export async function mapCompanyToServiceCity(
  formData: FormData
): Promise<void> {
  const companyId = Number(formData.get("companyId"));
  const serviceCityId = Number(formData.get("serviceCityId"));
  const displayName = (String(formData.get("displayName") || "").trim() ||
    null) as string | null;
  const isFeatured = String(formData.get("isFeatured") || "false") === "true";

  if (!companyId || !serviceCityId) return;

  // Guard: if this Service•City is already assigned to a (different) company, block it.
  const existingForPair = await prisma.companyServiceCity.findFirst({
    where: { serviceCityId },
    select: { companyId: true },
  });

  if (existingForPair && existingForPair.companyId !== companyId) {
    // If you prefer to fail silently, replace with `return;`
    throw new Error(
      "That Service • City is already assigned to a company. Unmap it first."
    );
  }

  // Proceed (creates if new, updates if mapping the same company to the same pair)
  await prisma.companyServiceCity.upsert({
    where: { companyId_serviceCityId: { companyId, serviceCityId } },
    update: { displayName, isFeatured },
    create: { companyId, serviceCityId, displayName, isFeatured },
  });

  revalidatePath("/admin/mappings");
}

export async function unmapCompanyFromServiceCity(
  companyId: number,
  serviceCityId: number
): Promise<void> {
  await prisma.companyServiceCity.delete({
    where: { companyId_serviceCityId: { companyId, serviceCityId } },
  });
  revalidatePath("/admin/mappings");
}
