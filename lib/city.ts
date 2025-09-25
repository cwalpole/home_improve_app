// lib/city.ts
import { headers, cookies } from "next/headers";
import prisma from "./prisma";

export async function findCityBySlug(slug: string) {
  return prisma.city.findUnique({ where: { slug } });
}

// Reads city from the x-city header (set in middleware), then cookie, then default
export async function getResolvedCity(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-city") ||
    (await cookies()).get("preferred-city")?.value ||
    "calgary"
  );
}
