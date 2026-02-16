import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { deleteImage } from "@/lib/cloudinary";

export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  const existing = await prisma.blogPost.findUnique({
    where: { id },
    select: { coverImagePublicId: true },
  });

  await prisma.blogPostCity.deleteMany({ where: { blogPostId: id } });
  await prisma.blogPost.delete({ where: { id } });

  if (existing?.coverImagePublicId) {
    await deleteImage(existing.coverImagePublicId);
  }

  redirect("/admin/blogs");
}
