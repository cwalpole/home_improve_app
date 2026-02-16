import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getPost(citySlug: string, slug: string) {
  const city = await prisma.city.findUnique({
    where: { slug: citySlug },
    select: { id: true, name: true, slug: true },
  });
  if (!city) return null;

  const post = await prisma.blogPost.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      OR: [
        { cities: { some: { city: { slug: citySlug } } } },
        { cities: { none: {} } },
      ],
    },
    select: {
      title: true,
      contentHtml: true,
      excerpt: true,
      publishedAt: true,
      category: true,
      coverImageUrl: true,
    },
  });

  if (!post) return null;
  return { city, post };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ city: string; slug: string }>;
}) {
  const { city, slug } = await params;
  const data = await getPost(city, slug);
  if (!data) return notFound();
  const { post } = data;

  const html =
    post.contentHtml
      ?.replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&") || "";

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "32px 20px",
        background: "#F4F6F3",
      }}
    >
      <p style={{ margin: 0, color: "#475569", textTransform: "capitalize" }}>
        {post.category.replace("_", " ").toLowerCase()}
      </p>
      <h1 style={{ margin: "6px 0 12px" }}>{post.title}</h1>
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
      <article className="blogContent" dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
