import { motion } from 'framer-motion';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  site?: string;
  more?: string;
  index: number;
  id?: string;
  detail?: string;
}

export default function ProjectCard({ title, description, tags, github, demo, site, more, index, id, detail }: ProjectCardProps) {
  return (
    <motion.article
      id={id}
      data-tags={tags.join(',')}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      className="group relative rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
      }}
      whileHover={{
        borderColor: 'var(--border-hover)',
      }}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#028090]/10 to-[#b6465f]/10 rounded-2xl" />
      </div>

      <div className="relative z-10">
        <h3
          className="text-xl font-semibold mb-2 group-hover:text-[#b6465f] transition-colors"
          style={{ color: '#028090' }}
        >
          {title}
        </h3>
        
        <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs rounded-full"
              style={{
                background: 'var(--tag-bg)',
                color: 'var(--tag-text)',
                border: '1px solid var(--tag-border)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-3">
          {github && (
            <motion.a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ background: '#028090', color: '#020202' }}
              whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </motion.a>
          )}
          {demo && (
            <motion.a
              href={demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors hover:text-[#b6465f] hover:border-[#b6465f]"
              style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
              Demo
            </motion.a>
          )}
          {site && (
            <motion.a
              href={site}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors hover:text-[#b6465f] hover:border-[#b6465f]"
              style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Live
            </motion.a>
          )}
          {more && (
            <motion.a
              href={more}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors hover:text-[#028090] hover:border-[#028090]"
              style={{ border: '1px solid var(--border)', color: 'var(--text-faint)' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              More
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.a>
          )}
        </div>

        {detail && (
          <p
            className="mt-4 pt-4 text-xs leading-relaxed"
            style={{
              borderTop: '1px solid var(--detail-border)',
              color: 'var(--text-detail)',
            }}
          >
            {detail}
          </p>
        )}
      </div>
    </motion.article>
  );
}
