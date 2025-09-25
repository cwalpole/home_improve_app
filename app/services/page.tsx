import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-static"; // global can be cached

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
    select: { name: true, slug: true },
  });

  return (
    <main>
      <h1>Home Services</h1>
      <ul>
        {services.map((s) => (
          <li key={s.slug}>
            <Link href={`/services/${s.slug}`}>{s.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
