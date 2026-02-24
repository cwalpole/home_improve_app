// lib/queries.ts
import prisma from "./prisma";

export type ServiceListing = {
  displayName: string | null;
  isFeatured: boolean;
  companyId: number;
  serviceCityId: number;
  company: {
    name: string;
    url: string | null;
    tagline: string | null;
    companySummary: string | null;
    logoUrl: string | null;
    logoPublicId: string | null;
    heroImageUrl: string | null;
    heroImagePublicId: string | null;
    galleryImages: unknown | null;
    galleryFeaturedIndex: number | null;
    servicesOffered: unknown | null;
  };
};

export type ServiceDetail = {
  name: string;
  slug: string;
  heroImage: string | null;
  contentHtml: string | null;
  listings: ServiceListing[];
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
          contentHtml: true,
          listings: {
            orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }],
            select: {
              displayName: true,
              isFeatured: true,
              companyId: true,
              serviceCityId: true,
              company: {
                select: {
                  name: true,
                  url: true,
                  tagline: true,
                  companySummary: true,
                  logoUrl: true,
                  logoPublicId: true,
                  heroImageUrl: true,
                  heroImagePublicId: true,
                  galleryImages: true,
                  galleryFeaturedIndex: true,
                  servicesOffered: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!service) return null;

  const serviceCity = service.serviceCities[0];
  const listings = serviceCity?.listings ?? [];
  const shaped: ServiceDetail = {
    name: service.name,
    slug: service.slug,
    heroImage: service.heroImage,
    contentHtml: serviceCity?.contentHtml ?? null,
    listings,
  };
  return shaped;
}
