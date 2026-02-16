import prisma from "@/lib/prisma";
import styles from "../admin.module.css";
import Link from "next/link";

async function getBlogs() {
  return prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <section className={styles.section}>
      <div className={styles.row} style={{ gridTemplateColumns: "1fr auto" }}>
        <h2 style={{ margin: 0 }}>Blogs</h2>
        <Link className={styles.btn} href="/admin/blogs/new">
          + New Blog
        </Link>
      </div>
      <div className={styles.table}>
        <div className={styles.tableHead}>
          <span>Title</span>
          <span>Category</span>
          <span>Status</span>
          <span>Updated</span>
          <span></span>
        </div>
        {blogs.length === 0 ? (
          <div className={styles.emptyState}>No blog posts yet.</div>
        ) : (
          blogs.map((blog) => (
            <div key={blog.id} className={styles.tableRow}>
              <span>{blog.title}</span>
              <span>{blog.category}</span>
              <span>{blog.status}</span>
              <span>{blog.updatedAt.toISOString().slice(0, 10)}</span>
              <span className={styles.rowActions}>
                <a href={`/admin/blogs/${blog.id}/edit`} className={styles.link}>
                  Edit
                </a>
                <form
                  action={`/admin/blogs/${blog.id}/delete`}
                  method="post"
                  style={{ display: "inline" }}
                >
                  <button type="submit" className={`${styles.link} ${styles.logoutButton}`}>
                    Delete
                  </button>
                </form>
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
