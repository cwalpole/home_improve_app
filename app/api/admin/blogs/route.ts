import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const blogs = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(blogs);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const blog = await prisma.blogPost.create({
    data: {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt ?? null,
      contentHtml: data.contentHtml ?? "",
      coverImageUrl: data.coverImageUrl ?? null,
      category: data.category,
      status: data.status,
      isFeatured: !!data.isFeatured,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
    },
  });
  return NextResponse.json(blog, { status: 201 });
}
