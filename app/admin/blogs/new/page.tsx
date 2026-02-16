import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import styles from "../../admin.module.css";
import CoverField from "../components/CoverField";
import { City, BlogCategory, BlogStatus } from "@prisma/client";
import HtmlEditor from "../../components/HtmlEditor";
import Link from "next/link";

async function create(formData: FormData) {
  "use server";
  const cityIds = formData.getAll("cityIds").map((v) => Number(v)).filter(Boolean);

  const blog = await prisma.blogPost.create({
    data: {
      slug: String(formData.get("slug") || "").trim(),
      title: String(formData.get("title") || "").trim(),
      excerpt: String(formData.get("excerpt") || ""),
      contentHtml: String(formData.get("contentHtml") || ""),
      coverImageUrl: String(formData.get("coverImageUrl") || "") || null,
      coverImagePublicId: String(formData.get("coverImagePublicId") || "") || null,
      category: formData.get("category") as BlogCategory,
      status: formData.get("status") as BlogStatus,
      isFeatured: formData.get("isFeatured") === "on",
      publishedAt: formData.get("publishedAt")
        ? new Date(String(formData.get("publishedAt")))
        : null,
    },
  });
  if (cityIds.length) {
    await prisma.blogPostCity.createMany({
      data: cityIds.map((cityId) => ({ blogPostId: blog.id, cityId })),
      skipDuplicates: true,
    });
  }
  redirect("/admin/blogs");
}

export default async function NewBlogPage() {
  const cities: City[] = await prisma.city.findMany({
    orderBy: [{ country: "asc" }, { name: "asc" }],
  });

  return (
    <section className={styles.section}>
      <h2 style={{ marginTop: 0 }}>New Blog Post</h2>
      <form action={create} className={styles.formStack}>
        <div className={styles.field}>
          <label htmlFor="title">Title</label>
          <input id="title" name="title" className={styles.input} required />
        </div>
        <div className={styles.field}>
          <label htmlFor="slug">URL</label>
          <input
            id="slug"
            name="slug"
            className={styles.input}
            placeholder="Example format: new-blog-post-title"
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="excerpt">Summary</label>
          <textarea id="excerpt" name="excerpt" className={styles.input} rows={2} />
        </div>
        <div className={styles.field}>
          <HtmlEditor
            name="contentHtml"
            label="Content (HTML)"
            placeholder="Type or paste the blog content…"
          />
        </div>
        <CoverField />
        <div className={`${styles.field} ${styles.halfWidth}`}>
          <label htmlFor="category">Category</label>
          <select id="category" name="category" className={styles.select} defaultValue="PLANNING_GUIDE">
            <option value="PLANNING_GUIDE">Planning Guide</option>
            <option value="HOMEOWNER_TIPS">Homeowner Tips</option>
            <option value="EXPERT_SPOTLIGHT">Expert Spotlight</option>
          </select>
        </div>
        <div className={`${styles.field} ${styles.halfWidth}`}>
          <label htmlFor="status">Status</label>
          <select id="status" name="status" className={styles.select} defaultValue="DRAFT">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
        <div className={`${styles.field} ${styles.halfWidth}`}>
          <label htmlFor="publishedAt">Published At</label>
          <input id="publishedAt" name="publishedAt" type="datetime-local" className={styles.input} />
        </div>
        <div className={styles.field}>
          <label>Visible In</label>
          <div className={styles.outlineSection}>
            <p className={styles.helperText}>Check one or more cities; leave all unchecked to show everywhere.</p>
            <div className={`${styles.checkboxList} ${styles.checkboxListPadded}`}>
              {cities.map((city) => (
                <label key={city.id} className={styles.checkboxRow}>
                  <input type="checkbox" name="cityIds" value={city.id} />
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
            Create
          </button>
        </div>
      </form>
    </section>
  );
}
