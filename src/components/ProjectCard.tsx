import { motion, useReducedMotion } from 'framer-motion';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  site?: string;
  more?: string;
  status?: string;
  index: number;
  id?: string;
  detail?: string;
}

function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const base = 'absolute w-3 h-3 transition-all duration-300 opacity-0 group-hover:opacity-100';
  const map = {
    tl: 'top-2 left-2 border-l border-t',
    tr: 'top-2 right-2 border-r border-t',
    bl: 'bottom-2 left-2 border-l border-b',
    br: 'bottom-2 right-2 border-r border-b',
  } as const;
  return <span className={`${base} ${map[pos]}`} style={{ borderColor: 'var(--accent)' }} aria-hidden="true" />;
}

export default function ProjectCard({ title, description, tags, github, demo, site, more, status, index, id, detail }: ProjectCardProps) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.article
      id={id}
      data-tags={tags.join(',')}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={reduced ? undefined : { y: -6 }}
      className="group relative rounded-xl p-6 transition-colors duration-300"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
      }}
    >
      <Corner pos="tl" />
      <Corner pos="tr" />
      <Corner pos="bl" />
      <Corner pos="br" />

      <div className="relative z-10">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold transition-colors" style={{ color: 'var(--accent)' }}>
            <span style={{ color: 'var(--text-faint)' }}>▸ </span>
            {title}
          </h3>
          {status && (
            <span
              className="shrink-0 rounded px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-widest"
              style={{ background: 'var(--status-bg)', color: 'var(--status-text)', border: '1px solid var(--status-border)' }}
            >
              {status}
            </span>
          )}
        </div>

        <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span key={tag} className="text-xs" style={{ color: 'var(--tag-text)' }}>
              #{tag.replace(/\s+/g, '')}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-2">
          {github && (
            <motion.a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
              style={{ border: '1px solid var(--tag-border)', color: 'var(--accent)' }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              git
            </motion.a>
          )}
          {demo && (
            <motion.a
              href={demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors"
              style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              demo
            </motion.a>
          )}
          {site && (
            <motion.a
              href={site}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors"
              style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              live ↗
            </motion.a>
          )}
          {more && (
            <motion.a
              href={more}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors"
              style={{ border: '1px solid var(--border)', color: 'var(--text-faint)' }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              more →
            </motion.a>
          )}
        </div>

        {detail && (
          <p
            className="mt-4 pt-4 text-xs leading-relaxed"
            style={{ borderTop: '1px solid var(--detail-border)', color: 'var(--text-detail)' }}
          >
            {detail}
          </p>
        )}
      </div>
    </motion.article>
  );
}
