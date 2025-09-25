import { getResolvedCity } from "@/lib/city";
import prisma from "@/lib/prisma";
import CitySwitcher from "./CitySwitcher";

export default async function CityBadge() {
  const citySlug = getResolvedCity();
  const cities = await prisma.city.findMany({
    select: { slug: true, name: true },
    orderBy: { name: "asc" },
  });
  const city = cities.find(async (c) => c.slug === (await citySlug));

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <span>Viewing:</span>
      <strong>{city?.name ?? citySlug}</strong>
      <CitySwitcher cities={cities} />
    </div>
  );
}
