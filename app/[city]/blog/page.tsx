import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import styles from "./blog.module.css";

export const dynamic = "force-dynamic";

async function getCityAndPosts(citySlug: string) {
  const city = await prisma.city.findUnique({
    where: { slug: citySlug },
    select: { id: true, name: true, slug: true },
  });
  if (!city) return null;

  const posts = await prisma.blogPost.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { cities: { some: { city: { slug: citySlug } } } },
        { cities: { none: {} } }, // global posts
      ],
    },
    orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      publishedAt: true,
      createdAt: true,
      coverImageUrl: true,
      isFeatured: true,
      category: true,
    },
  });

  return { city, posts };
}

type Search = { category?: string; sort?: string };

export default async function CityBlogIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ city: string }>;
  searchParams: Promise<Search>;
}) {
  const { city: citySlug } = await params;
  const sp = await searchParams;
  const data = await getCityAndPosts(citySlug);
  if (!data) return notFound();
  const { city, posts } = data;

  const categoryFilter = (sp.category || "ALL").toUpperCase();
  const filtered = posts.filter((p) =>
    categoryFilter === "ALL" ? true : p.category === categoryFilter
  );

  const categoryLabel = (cat: string) =>
    cat
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const chips = [
    { value: "ALL", label: "All" },
    { value: "PLANNING_GUIDE", label: "Planning Guide" },
    { value: "HOMEOWNER_TIPS", label: "Homeowner Tips" },
    { value: "EXPERT_SPOTLIGHT", label: "Expert Spotlight" },
  ];

  const buildHref = (value: string) =>
    value === "ALL"
      ? `/${city.slug}/blog`
      : `/${city.slug}/blog?category=${value.toLowerCase()}`;

  const fmtDate = (d?: Date | null) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";

  return (
    <main className={styles.main}>
      <h1
        style={{
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 28,
            height: 32,
            mask: "url('/logo-design-single.svg') center / contain no-repeat",
            WebkitMask: "url('/logo-design-single.svg') center / contain no-repeat",
            background: "#0d606c",
          }}
        />
        Blog
      </h1>
      <p style={{ marginTop: 0, marginBottom: 28, color: "#475569" }}>
        Practical guides, tips, and spotlights from our team and partners.
      </p>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        {chips.map((chip) => {
          const active = chip.value === categoryFilter;
          return (
            <Link
              key={chip.value}
              href={buildHref(chip.value)}
              scroll={false}
              className="chip"
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                border: active ? "1px solid #0d606c" : "1px solid #1f2937",
                background: active ? "#0d606c" : "#0b0c10",
                color: active ? "#f8fafc" : "#e2e8f0",
                textDecoration: "none",
                fontSize: 13,
                letterSpacing: 0.2,
                fontWeight: active ? 700 : 500,
              }}
            >
              {chip.label}
            </Link>
          );
        })}
      </div>

      <div className={styles.grid}>
        {filtered.map((post) => {
          const date = fmtDate(post.publishedAt ?? post.createdAt);
          const words = (post.excerpt || "").split(/\s+/).filter(Boolean).length;
          const reading = Math.max(2, Math.round(words / 200 + 1));
          return (
            <Link key={post.id} href={`/${city.slug}/blog/${post.slug}`} className={styles.card}>
              {post.coverImageUrl && (
                <div className={styles.thumbWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.coverImageUrl} alt="" className={styles.thumb} />
                </div>
              )}
              <div className={styles.meta}>
                <span className={styles.metaChip}>{categoryLabel(post.category)}</span>
                <span aria-hidden="true">•</span>
                <span>{reading} min read</span>
                {date && (
                  <>
                    <span aria-hidden="true">•</span>
                    <span>{date}</span>
                  </>
                )}
              </div>

              <h2 className={styles.title}>{post.title}</h2>
              {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
              <span className={styles.cta}>Read article →</span>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <p style={{ color: "#475569" }}>No published posts yet for {city.name}.</p>
        )}
      </div>
    </main>
  );
}
