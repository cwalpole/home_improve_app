import Link from "next/link";
import styles from "./blog.module.css";

export const metadata = {
  title: "Blog | Give It Charm",
  description:
    "Ideas, checklists, and renovation stories to help you get more from your home.",
};

const posts = [
  {
    title: "The Essential Checklist Before You Start Any Renovation",
    slug: "renovation-checklist",
    summary:
      "From budgeting to vetting pros, here’s a field-tested list that keeps projects on time and stress free.",
    date: "May 12, 2024",
    readTime: "6 min read",
    tags: ["Planning", "Project prep"],
  },
  {
    title: "Small Upgrades That Deliver Big Curb-Appeal Wins",
    slug: "curb-appeal-upgrades",
    summary:
      "Paint pairings, lighting swaps, and weekend landscaping fixes that instantly elevate your entryway.",
    date: "Apr 28, 2024",
    readTime: "4 min read",
    tags: ["Exterior", "Design"],
  },
  {
    title: "How to Keep Contractors Accountable Without Micromanaging",
    slug: "contractor-accountability",
    summary:
      "Use milestone check-ins, simple scopes, and communication rituals to stay informed and keep momentum.",
    date: "Apr 10, 2024",
    readTime: "5 min read",
    tags: ["Hiring pros", "Management"],
  },
];

export default function BlogPage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Give It Charm Blog</p>
        <h1 className={styles.title}>
          Field notes for confident home improvement
        </h1>
        <p className={styles.lead}>
          Practical guidance, inspiration, and checklists from crews who build
          in real homes every day.
        </p>
      </section>

      <section className={styles.grid}>
        {posts.map((post) => (
          <article key={post.slug} className={styles.card}>
            <div className={styles.cardMeta}>
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
            <h2 className={styles.cardTitle}>{post.title}</h2>
            <p className={styles.cardSummary}>{post.summary}</p>
            <div className={styles.tagList}>
              {post.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
            <Link href={`/blog/${post.slug}`} className={styles.cardLink}>
              Keep reading
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
