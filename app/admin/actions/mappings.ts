"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type MappingActionState = { ok: boolean; error: string | null };

// Service ↔ City
export async function mapServiceToCity(formData: FormData): Promise<void> {
  const serviceId = Number(formData.get("serviceId"));
  const cityId = Number(formData.get("cityId"));
  const contentHtmlRaw = String(formData.get("contentHtml") || "").trim();
  const contentHtml = contentHtmlRaw ? contentHtmlRaw : null;
  if (!serviceId || !cityId) return;

  const mapping = await prisma.serviceCity.upsert({
    where: { serviceId_cityId: { serviceId, cityId } },
    update: { contentHtml },
    create: { serviceId, cityId, contentHtml },
    select: { id: true },
  });
  revalidatePath("/admin/mappings");
  revalidatePath("/admin/serviceCityMappings");
  revalidatePath("/admin/companyServiceCityMappings");
  if (mapping?.id) {
    revalidatePath(`/admin/serviceCityMappings/${mapping.id}`);
  }
}

export async function unmapServiceFromCity(id: number): Promise<void> {
  await prisma.serviceCity.delete({ where: { id } });
  revalidatePath("/admin/mappings");
  revalidatePath("/admin/serviceCityMappings");
  revalidatePath("/admin/companyServiceCityMappings");
  revalidatePath(`/admin/serviceCityMappings/${id}`);
}

export async function updateServiceCityContent(
  prevState: MappingActionState,
  formData: FormData
): Promise<MappingActionState> {
  const serviceCityId = Number(formData.get("serviceCityId"));
  const contentHtmlRaw = String(formData.get("contentHtml") || "").trim();
  const contentHtml = contentHtmlRaw ? contentHtmlRaw : null;

  if (!serviceCityId) {
    return { ok: false, error: "Missing mapping id" };
  }

  await prisma.serviceCity.update({
    where: { id: serviceCityId },
    data: { contentHtml },
  });

  revalidatePath("/admin/mappings");
  revalidatePath("/admin/serviceCityMappings");
  revalidatePath(`/admin/serviceCityMappings/${serviceCityId}`);
  return { ok: true, error: null };
}

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
  revalidatePath("/admin/companyServiceCityMappings");
  revalidatePath(`/admin/companyServiceCityMappings/${serviceCityId}/${companyId}`);
}

export async function unmapCompanyFromServiceCity(
  companyId: number,
  serviceCityId: number
): Promise<void> {
  await prisma.companyServiceCity.delete({
    where: { companyId_serviceCityId: { companyId, serviceCityId } },
  });
  revalidatePath("/admin/mappings");
  revalidatePath("/admin/companyServiceCityMappings");
  revalidatePath(`/admin/companyServiceCityMappings/${serviceCityId}/${companyId}`);
}

export async function updateCompanyServiceCityFeatured(
  prev: MappingActionState,
  formData: FormData
): Promise<MappingActionState> {
  const companyId = Number(formData.get("companyId"));
  const serviceCityId = Number(formData.get("serviceCityId"));
  const isFeatured = String(formData.get("isFeatured") || "false") === "true";

  if (!companyId || !serviceCityId) {
    return { ok: false, error: "Missing fields" };
  }

  await prisma.companyServiceCity.update({
    where: { companyId_serviceCityId: { companyId, serviceCityId } },
    data: { isFeatured },
  });

  revalidatePath("/admin/companyServiceCityMappings");
  revalidatePath(`/admin/companyServiceCityMappings/${serviceCityId}/${companyId}`);

  return { ok: true, error: null };
}
