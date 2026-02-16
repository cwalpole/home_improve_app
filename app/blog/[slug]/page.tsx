import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: {
      title: true,
      contentHtml: true,
      excerpt: true,
      publishedAt: true,
      category: true,
      coverImageUrl: true,
    },
  });

  if (!post) return notFound();

  const html =
    post.contentHtml
      ?.replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&") || "";

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
      <p style={{ margin: 0, color: "#475569", textTransform: "capitalize" }}>
        {post.category.replace("_", " ").toLowerCase()}
      </p>
      <h1 style={{ margin: "6px 0 12px" }}>{post.title}</h1>
      {post.publishedAt && (
        <p style={{ margin: "0 0 24px", color: "#64748b" }}>
          {new Date(post.publishedAt).toLocaleDateString()}
        </p>
      )}
      {post.coverImageUrl && (
        <div
          style={{
            width: "100%",
            marginBottom: 20,
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid #e2e8f0",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImageUrl}
            alt=""
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      )}
      <article
        className="blogContent"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}
