import { motion } from 'framer-motion';
import { useState } from 'react';

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

const linkStyle: React.CSSProperties = {
  fontFamily: 'var(--font-ui)',
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
  cursor: 'pointer',
};

export default function ProjectCard({ title, description, tags, github, demo, site, status, index }: ProjectCardProps) {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

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
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...linkStyle,
                color: hoveredLink === 'github' ? 'var(--accent)' : 'var(--fg-dim)',
              }}
              onMouseEnter={() => setHoveredLink('github')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              GitHub
            </a>
          )}
          {demo && (
            <a
              href={demo}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...linkStyle,
                color: hoveredLink === 'demo' ? 'var(--accent)' : 'var(--fg-dim)',
              }}
              onMouseEnter={() => setHoveredLink('demo')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Demo
            </a>
          )}
          {site && (
            <a
              href={site}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...linkStyle,
                color: hoveredLink === 'site' ? 'var(--accent)' : 'var(--fg-dim)',
              }}
              onMouseEnter={() => setHoveredLink('site')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Live
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
