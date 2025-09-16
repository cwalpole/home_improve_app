import Link from 'next/link'
import { projects } from '@/lib/mockData'

export const metadata = {
  title: 'Projects',
  description: 'Selected construction projects and renovations.',
}

export default function ProjectsIndex() {
  return (
    <main style={{ maxWidth: 'var(--maxw)', margin: '24px auto', padding: '0 16px' }}>
      <h1>Projects</h1>
      <ul>
        {projects.map(p => (
          <li key={p.slug}>
            <Link href={`/projects/${p.slug}`}>{p.title}</Link> — {p.excerpt}
          </li>
        ))}
      </ul>
    </main>
  )
}
