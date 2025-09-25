import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import JsonLd from "@/components/JsonLd";
import styles from "./ServicePage.module.css";

type RouteParams = { slug: string };

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const rows = await prisma.service.findMany({ select: { slug: true } });
    return rows.map((r) => ({ slug: r.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = await prisma.service.findUnique({ where: { slug } });
  if (!s) return {};

  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.gothome.ca";
  const url = `${base}/services/${s.slug}`;

  return {
    title: s.name,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: s.name,
      images: s.heroImage ? [{ url: s.heroImage }] : undefined,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const s = await prisma.service.findUnique({ where: { slug } });
  if (!s) notFound();

  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.example.com";

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: base },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: `${base}/services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: s.name,
        item: `${base}/services/${s.slug}`,
      },
    ],
  };

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    provider: { "@type": "LocalBusiness", name: "Acme Builders" },
  };

  return (
    <main>
      <div className={styles.hero}>
        <div className={styles.inner}>
          <div className={styles.breadcrumbs}>
            <Link href="/">Home</Link> / <Link href="/services">Services</Link>{" "}
            / {s.name}
          </div>
          <h1 className={styles.title}>{s.name}</h1>
        </div>
      </div>

      <section className={styles.wrap}>
        <div className={styles.media}>
          {s.heroImage ? (
            <Image src={s.heroImage} alt={s.name} width={1200} height={700} />
          ) : null}
        </div>
        <article className={styles.content}>
          {/* optional content blocks later */}
        </article>
      </section>

      <JsonLd data={breadcrumbs} />
      <JsonLd data={serviceLd} />
    </main>
  );
}
