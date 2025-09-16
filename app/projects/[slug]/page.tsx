import { notFound } from 'next/navigation'
import Image from 'next/image'
import styles from './ProjectPage.module.css'
import { projects } from '@/lib/mockData'
import JsonLd from '@/components/JsonLd'
import type { Metadata } from 'next'

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return projects.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = projects.find(x => x.slug === params.slug)
  if (!p) return {}
  const base = 'https://www.example.com'
  const url = `${base}/projects/${p.slug}`
  return {
    title: p.title,
    description: p.excerpt,
    alternates: { canonical: url },
    openGraph: { url, title: p.title, description: p.excerpt, images: p.cover ? [{ url: p.cover }] : undefined },
  }
}

export const revalidate = 60

export default function ProjectPage({ params }: Props) {
  const p = projects.find(x => x.slug === params.slug)
  if (!p) notFound()

  const breadcrumbs = {
    "@context":"https://schema.org",
    "@type":"BreadcrumbList",
    "itemListElement":[
      { "@type":"ListItem","position":1,"name":"Home","item":"https://www.example.com" },
      { "@type":"ListItem","position":2,"name":"Projects","item":"https://www.example.com/projects" },
      { "@type":"ListItem","position":3,"name": p.title, "item": `https://www.example.com/projects/${p.slug}` }
    ]
  }

  const projectLd = {
    "@context":"https://schema.org",
    "@type":"CreativeWork",
    "name": p.title,
    "description": p.excerpt,
    "locationCreated": p.location,
    "image": p.cover
  }

  return (
    <main>
      <div className={styles.hero}>
        <div className={styles.inner}>
          <div className={styles.breadcrumbs}><a href="/">Home</a> / <a href="/projects">Projects</a> / {p.title}</div>
          <h1 className={styles.title}>{p.title}</h1>
          {p.excerpt ? <p className={styles.excerpt}>{p.excerpt}</p> : null}
        </div>
      </div>

      <section className={styles.wrap}>
        <div className={styles.gallery}>
          {p.cover ? <Image src={p.cover} alt={p.title} width={800} height={600} /> : null}
        </div>
        <article className={styles.content}>
          {p.content ? <div dangerouslySetInnerHTML={{ __html: p.content }} /> : null}
          {p.location ? <div className={styles.meta}>Location: {p.location}</div> : null}
        </article>
      </section>

      <JsonLd data={breadcrumbs} />
      <JsonLd data={projectLd} />
    </main>
  )
}
