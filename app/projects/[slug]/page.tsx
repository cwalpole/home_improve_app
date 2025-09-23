import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import styles from "./ProjectPage.module.css";
import type { Metadata } from "next";

type RouteParams = { slug: string };

export async function generateStaticParams() {
  const rows = await prisma.project.findMany({
    select: { slug: true },
    where: { published: true },
  });
  return rows.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await prisma.project.findUnique({ where: { slug } });
  if (!p) return {};

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.example.com";
  const url = `${base}/projects/${p.slug}`;

  return {
    title: p.title,
    description: p.excerpt ?? undefined,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: p.title,
      description: p.excerpt ?? undefined,
      images: p.coverImage ? [{ url: p.coverImage }] : undefined,
    },
  };
}

export const revalidate = 60;

export default async function ProjectPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;

  const p = await prisma.project.findUnique({
    where: { slug },
    include: { service: { select: { title: true, slug: true } } },
  });
  if (!p) notFound();

  return (
    <main>
      <div className={styles.hero}>
        <div className={styles.inner}>
          <div className={styles.breadcrumbs}>
            <Link href="/">Home</Link> / <Link href="/projects">Projects</Link>{" "}
            / {p.title}
          </div>
          <h1 className={styles.title}>{p.title}</h1>
          {p.excerpt ? <p className={styles.excerpt}>{p.excerpt}</p> : null}
        </div>
      </div>

      <section className={styles.wrap}>
        <div className={styles.media}>
          {p.coverImage ? (
            <Image src={p.coverImage} alt={p.title} width={1200} height={700} />
          ) : null}
        </div>
        <article className={styles.content}>
          {p.content ? (
            <div dangerouslySetInnerHTML={{ __html: p.content }} />
          ) : null}
          {p.service ? (
            <p className={styles.meta}>
              Service:{" "}
              <Link href={`/services/${p.service.slug}`}>
                {p.service.title}
              </Link>
            </p>
          ) : null}
        </article>
      </section>
    </main>
  );
}
