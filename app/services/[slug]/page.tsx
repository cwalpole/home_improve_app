// app/services/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

// ---- generateMetadata (optional) ----
export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const service = await prisma.service.findFirst({
    where: { slug },
    select: { name: true },
  });
  const title = service ? `${service.name} — Home Services` : "Service";
  return {
    title,
    alternates: { canonical: `/services/${slug}` },
    robots: { index: true, follow: true },
  };
}

// ---- Page component ----
export default async function ServicePage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const service = await prisma.service.findFirst({
    where: { slug },
    select: {
      name: true,
      slug: true,
      serviceCities: {
        select: { city: { select: { slug: true, name: true } } },
        orderBy: { cityId: "asc" },
      },
    },
  });

  if (!service) {
    return (
      <main>
        <h1>Service not found</h1>
      </main>
    );
  }

  const cities = service.serviceCities.map((sc) => sc.city);

  return (
    <main>
      <h1>{service.name}</h1>
      <p>Select a city to see top companies:</p>

      {cities.length === 0 ? (
        <p>No cities available yet.</p>
      ) : (
        <ul>
          {cities.map((c) => (
            <li key={c.slug}>
              <Link href={`/${c.slug}/services/${service.slug}`}>{c.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
