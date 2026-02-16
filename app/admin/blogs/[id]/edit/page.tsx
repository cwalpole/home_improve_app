import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { deleteImage } from "@/lib/cloudinary";
import styles from "../../../admin.module.css";
import { City, BlogCategory, BlogStatus } from "@prisma/client";
import CoverField from "../../components/CoverField";
import HtmlEditor from "../../../components/HtmlEditor";
import Link from "next/link";

async function update(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  const cityIds = formData
    .getAll("cityIds")
    .map((v) => Number(v))
    .filter(Boolean);
  const existing = await prisma.blogPost.findUnique({
    where: { id },
    select: { coverImagePublicId: true },
  });
  const newPublicId = String(formData.get("coverImagePublicId") || "") || null;
  await prisma.blogPost.update({
    where: { id },
    data: {
      slug: String(formData.get("slug") || "").trim(),
      title: String(formData.get("title") || "").trim(),
      excerpt: String(formData.get("excerpt") || ""),
      contentHtml: String(formData.get("contentHtml") || ""),
      coverImageUrl: String(formData.get("coverImageUrl") || "") || null,
      coverImagePublicId: newPublicId,
      category: formData.get("category") as BlogCategory,
      status: formData.get("status") as BlogStatus,
      isFeatured: formData.get("isFeatured") === "on",
      publishedAt: formData.get("publishedAt")
        ? new Date(String(formData.get("publishedAt")))
        : null,
    },
  });
  // reset mappings
  await prisma.blogPostCity.deleteMany({ where: { blogPostId: id } });
  if (cityIds.length) {
    await prisma.blogPostCity.createMany({
      data: cityIds.map((cityId) => ({ blogPostId: id, cityId })),
      skipDuplicates: true,
    });
  }
  if (existing?.coverImagePublicId && existing.coverImagePublicId !== newPublicId) {
    await deleteImage(existing.coverImagePublicId);
  }
  redirect("/admin/blogs");
}

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blog = await prisma.blogPost.findUnique({
    where: { id: Number(id) },
    include: { cities: true },
  });
  if (!blog) return notFound();

  const cities: City[] = await prisma.city.findMany({
    orderBy: [{ country: "asc" }, { name: "asc" }],
  });
  const selectedIds = new Set(blog.cities.map((c) => c.cityId));

  const formatDateTimeLocal = (d: Date | null) =>
    d ? new Date(d).toISOString().slice(0, 16) : "";

  return (
    <section className={styles.section}>
      <h2 style={{ marginTop: 0 }}>Edit Blog Post</h2>
      <form action={update} className={styles.formStack}>
        <input type="hidden" name="id" value={blog.id} />
        <div className={styles.field}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            className={styles.input}
            defaultValue={blog.title}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="slug">URL</label>
          <input
            id="slug"
            name="slug"
            className={styles.input}
            defaultValue={blog.slug}
            placeholder="Example format: new-blog-post-title"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="excerpt">Summary</label>
          <textarea
            id="excerpt"
            name="excerpt"
            className={styles.input}
            rows={2}
            defaultValue={blog.excerpt ?? ""}
          />
        </div>

        <div className={styles.field}>
          <HtmlEditor
            name="contentHtml"
            label="Content (HTML)"
            defaultValue={blog.contentHtml ?? ""}
            placeholder="Type or paste the blog content…"
          />
        </div>

        <CoverField defaultValue={blog.coverImageUrl ?? ""} defaultPublicId={blog.coverImagePublicId ?? ""} />

        <div className={styles.field}>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            className={styles.select}
            defaultValue={blog.category}
          >
            <option value="PLANNING_GUIDE">Planning Guide</option>
            <option value="HOMEOWNER_TIPS">Homeowner Tips</option>
            <option value="EXPERT_SPOTLIGHT">Expert Spotlight</option>
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            className={styles.select}
            defaultValue={blog.status}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="publishedAt">Published At</label>
          <input
            id="publishedAt"
            name="publishedAt"
            type="datetime-local"
            className={styles.input}
            defaultValue={formatDateTimeLocal(blog.publishedAt)}
          />
        </div>

        <div className={styles.field}>
          <label>Visible In (Leave blank for global)</label>
          <div className={styles.outlineSection}>
            <p className={styles.helperText}>
              Check one or more cities; leave all unchecked to show everywhere.
            </p>
            <div className={`${styles.checkboxList} ${styles.checkboxListPadded}`}>
              {cities.map((city) => (
                <label key={city.id} className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    name="cityIds"
                    value={city.id}
                    defaultChecked={selectedIds.has(city.id)}
                  />
                  {city.name}, {city.regionCode ?? ""} {city.country}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.actionsRow}>
          <Link className={`${styles.link}`} href="/admin/blogs">
            Cancel
          </Link>
          <button type="submit" className={styles.btn}>
            Save
          </button>
        </div>
      </form>
    </section>
  );
}
