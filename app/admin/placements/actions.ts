"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const Schema = z.object({
  regionSlug: z.string().min(1),
  citySlug: z.string().min(1),
  serviceSlug: z.string().min(1),
  companyId: z.coerce.number().int().positive(),
  isFeatured: z.coerce.boolean().optional().default(false),
  displayName: z
    .string()
    .optional()
    .transform((v) => (v && v.trim().length ? v : null)),
});

export async function createPlacement(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const data = Schema.parse(raw);

  const city = await prisma.city.findFirstOrThrow({
    where: { slug: data.citySlug, regionSlug: data.regionSlug },
    select: { id: true },
  });
  const service = await prisma.service.findUniqueOrThrow({
    where: { slug: data.serviceSlug },
    select: { id: true },
  });

  // ensure ServiceCity slot exists
  const sc = await prisma.serviceCity.upsert({
    where: { serviceId_cityId: { serviceId: service.id, cityId: city.id } },
    update: {},
    create: { serviceId: service.id, cityId: city.id },
    select: { id: true },
  });

  // create or update listing
  await prisma.companyServiceCity.upsert({
    where: {
      companyId_serviceCityId: {
        companyId: data.companyId,
        serviceCityId: sc.id,
      },
    },
    update: {
      isFeatured: data.isFeatured,
      displayName: data.displayName ?? undefined,
    },
    create: {
      companyId: data.companyId,
      serviceCityId: sc.id,
      isFeatured: data.isFeatured,
      displayName: data.displayName,
    },
  });

  revalidatePath("/admin/placements");
}
