// app/[city]/services/[slug]/page.tsx
import { findCityBySlug } from "@/lib/city";
import { getServiceDetailForCityId } from "@/lib/queries";
import type { Metadata } from "next";

export async function generateMetadata(props: {
  params: Promise<{ city: string; slug: string }>;
}): Promise<Metadata> {
  const { city: cityParam, slug } = await props.params;
  const city = await findCityBySlug(cityParam);
  const serviceName = slug.replace(/-/g, " ");
  const cityName = city?.name ?? cityParam;

  return {
    title: `${serviceName} in ${cityName}`,
    alternates: { canonical: `/${cityParam}/services/${slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function CityServiceDetailPage(props: {
  params: Promise<{ city: string; slug: string }>;
}) {
  const { city: cityParam, slug } = await props.params;
  const city = await findCityBySlug(cityParam);
  if (!city) return <div>City not found</div>;

  const data = await getServiceDetailForCityId(slug, city.id);
  if (!data) return <div>Service not found</div>;

  // (optional) JSON-LD — remove if you don't want it
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: data.name,
    areaServed: city.name,
    provider: data.listings.map((l) => ({
      "@type": "Organization",
      name: l.displayName ?? l.company.name,
      url: l.company.url || undefined,
      logo: l.company.logoUrl || undefined,
    })),
  };

  return (
    <main>
      <h1>
        {data.name} in {city.name}
      </h1>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2>Featured companies</h2>
      <ul>
        {data.listings.map((csc, i) => (
          <li key={i}>{csc.displayName ?? csc.company.name}</li>
        ))}
      </ul>
    </main>
  );
}
