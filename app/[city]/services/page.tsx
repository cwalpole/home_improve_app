import CityBadge from "@/components/CityBadge";
import { findCityBySlug } from "@/lib/city";
import { getServicesForCityId } from "@/lib/queries";
import type { Metadata } from "next";
import Link from "next/link";

type Props = { params: { city: string } };

export async function generateMetadata(props: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: cityParam } = await props.params;
  const city = await findCityBySlug(cityParam);
  const cityName = city?.name ?? cityParam;

  return {
    title: `Home Services in ${cityName}`,
    alternates: { canonical: `/${cityParam}/services` },
    robots: { index: true, follow: true },
  };
}

export default async function CityServicesPage(props: {
  params: Promise<{ city: string }>;
}) {
  const { city: cityParam } = await props.params;
  const city = await findCityBySlug(cityParam);
  if (!city) return <div>City not found</div>;

  const services = await getServicesForCityId(city.id);

  return (
    <main>
      <CityBadge />
      <h1>Home Services in {city.name}</h1>
      <ul>
        {services.map((s) => (
          <li key={s.slug}>
            <Link href={`/${cityParam}/services/${s.slug}`}>{s.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
