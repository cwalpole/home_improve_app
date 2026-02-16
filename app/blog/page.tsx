import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  let posts:
    | {
        id: number;
        slug: string;
        title: string;
        excerpt: string | null;
        publishedAt: Date | null;
        coverImageUrl: string | null;
      }[]
    | null = null;
  let loadError: string | null = null;

  try {
    posts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        publishedAt: true,
        coverImageUrl: true,
      },
    });
  } catch (err) {
    loadError = "Unable to load posts right now.";
    console.error("Error loading blog posts", err);
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
      <h1 style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
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

      <div style={{ display: "grid", gap: 16 }}>
        {posts?.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            style={{
              display: "grid",
              gridTemplateColumns: post.coverImageUrl ? "140px 1fr" : "1fr",
              gap: 14,
              padding: 16,
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              textDecoration: "none",
              color: "#0f172a",
              background: "#fff",
              boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
              alignItems: "center",
            }}
          >
            {post.coverImageUrl && (
              <div
                style={{
                  width: "100%",
                  aspectRatio: "4 / 3",
                  overflow: "hidden",
                  borderRadius: 10,
                  background: "#e2e8f0",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.coverImageUrl}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            )}
            <div>
              <h2 style={{ margin: "0 0 8px" }}>{post.title}</h2>
              {post.excerpt && (
                <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
                  {post.excerpt}
                </p>
              )}
            </div>
          </Link>
        ))}
        {posts && posts.length === 0 && (
          <p style={{ color: "#475569" }}>No published posts yet.</p>
        )}
        {loadError && <p style={{ color: "#b91c1c" }}>{loadError}</p>}
      </div>
    </main>
  );
}
