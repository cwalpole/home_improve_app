import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  const data = await req.json();
  const blog = await prisma.blogPost.update({
    where: { id },
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
  return NextResponse.json(blog);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  await prisma.blogPostCity.deleteMany({ where: { blogPostId: id } });
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
