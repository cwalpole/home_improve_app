"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Service ↔ City
export async function mapServiceToCity(formData: FormData): Promise<void> {
  const serviceId = Number(formData.get("serviceId"));
  const cityId = Number(formData.get("cityId"));
  if (!serviceId || !cityId) return;

  await prisma.serviceCity.upsert({
    where: { serviceId_cityId: { serviceId, cityId } },
    update: {},
    create: { serviceId, cityId },
  });
  revalidatePath("/admin/mappings");
}

export async function unmapServiceFromCity(id: number): Promise<void> {
  await prisma.serviceCity.delete({ where: { id } });
  revalidatePath("/admin/mappings");
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
