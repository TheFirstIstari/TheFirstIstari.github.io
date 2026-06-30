import { motion } from 'framer-motion';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  site?: string;
  status?: string;
  index: number;
  id?: string;
  detail?: string;
}

export default function ProjectCard({ title, description, tags, github, demo, site, status, index }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className="project-card"
      data-tags={tags.join(',')}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3>{title}</h3>
          {status && (
            <span
              className="shrink-0 project-tag"
              style={{ background: 'var(--accent-dim)' }}
            >
              {status}
            </span>
          )}
        </div>

        <p>{description}</p>

        <div className="project-tags">
          {tags.map((tag) => (
            <span key={tag} className="project-tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {github && (
            <a href={github} target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.6rem',
                fontWeight: 800,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--fg-dim)',
                textDecoration: 'none',
                transition: 'color 0.2s',
                padding: '4px 10px',
                border: '1px solid var(--border)',
                borderRadius: 4,
              }}
              onmouseover="this.style.color='var(--accent)'"
              onmouseout="this.style.color=''"
            >
              GitHub
            </a>
          )}
          {demo && (
            <a href={demo} target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.6rem',
                fontWeight: 800,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--fg-dim)',
                textDecoration: 'none',
                transition: 'color 0.2s',
                padding: '4px 10px',
                border: '1px solid var(--border)',
                borderRadius: 4,
              }}
              onmouseover="this.style.color='var(--accent)'"
              onmouseout="this.style.color=''"
            >
              Demo
            </a>
          )}
          {site && (
            <a href={site} target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.6rem',
                fontWeight: 800,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--fg-dim)',
                textDecoration: 'none',
                transition: 'color 0.2s',
                padding: '4px 10px',
                border: '1px solid var(--border)',
                borderRadius: 4,
              }}
              onmouseover="this.style.color='var(--accent)'"
              onmouseout="this.style.color=''"
            >
              Live
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
