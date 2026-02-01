import { prisma } from "@/lib/prisma";
import CityGate from "@/components/CityGate";

export const revalidate = 60;
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cities = await prisma.city.findMany({
    select: { name: true, slug: true },
    orderBy: { name: "asc" },
  });

  return <CityGate cities={cities} />;
}
