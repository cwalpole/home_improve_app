// lib/queries.ts
import prisma from "./prisma";

export type ServiceDetail = {
  name: string;
  slug: string;
  heroImage: string | null;
  listings: {
    displayName: string | null;
    isFeatured: boolean;
    company: { name: string; url: string | null; logoUrl: string | null };
  }[];
};

export type CityServiceItem = {
  name: string;
  slug: string;
  heroImage: string | null;
};

export async function getServicesForCityId(
  cityId: number
): Promise<CityServiceItem[]> {
  // Ensure the city exists (optional but nice for safety)
  const city = await prisma.city.findUnique({
    where: { id: cityId },
    select: { id: true },
  });
  if (!city) return [];

  return prisma.service.findMany({
    where: { serviceCities: { some: { cityId: city.id } } },
    orderBy: { order: "asc" },
    select: { name: true, slug: true, heroImage: true },
  });
}

/**
 * Returns { name, slug, heroImage, listings[] } for a given (serviceSlug, cityId).
 * listings are ordered: featured first, then oldest first.
 */
export async function getServiceDetailForCityId(
  serviceSlug: string,
  cityId: number
): Promise<ServiceDetail | null> {
  const service = await prisma.service.findFirst({
    where: {
      slug: serviceSlug,
      serviceCities: { some: { cityId } }, // ensure this service exists in the city
    },
    select: {
      name: true,
      slug: true,
      heroImage: true,
      serviceCities: {
        where: { cityId },
        select: {
          listings: {
            orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }],
            select: {
              displayName: true,
              isFeatured: true,
              company: { select: { name: true, url: true, logoUrl: true } },
            },
          },
        },
      },
    },
  });

  if (!service) return null;

  const listings = service.serviceCities[0]?.listings ?? [];
  const shaped: ServiceDetail = {
    name: service.name,
    slug: service.slug,
    heroImage: service.heroImage,
    listings,
  };
  return shaped;
}
