import { motion, useReducedMotion } from 'framer-motion';

const skillGroups = [
  {
    label: 'Languages',
    skills: ['Rust', 'C / C++', 'Java', 'Python', 'TypeScript', 'C#'],
  },
  {
    label: 'Performance & GPU',
    skills: ['CUDA', 'Metal', 'SIMD', 'Multithreading', 'Profiling', 'Benchmarking'],
  },
  {
    label: 'ML & Inference',
    skills: ['llama.cpp', 'Local LLM Inference', 'NumPy', 'Polars'],
  },
  {
    label: 'Security & Crypto',
    skills: ['Zero-Knowledge Proofs', 'Threshold Cryptography', 'Transparency Logs', 'Local-First / Privacy'],
  },
  {
    label: 'Systems & Desktop',
    skills: ['Tauri', 'NeoForge', 'PySide6 / Qt', 'FFmpeg', 'Distributed Systems'],
  },
  {
    label: 'Web & Visualisation',
    skills: ['Astro', 'Next.js', 'SvelteKit', 'Three.js / WebGL', 'React', 'Tailwind'],
  },
  {
    label: 'Data & Infra',
    skills: ['SpacetimeDB', 'SQLite', 'astropy', 'Blender Python API', 'GIS / GPX', 'GitHub Actions'],
  },
];

export default function Skills() {
  const reduced = useReducedMotion() ?? false;
  return (
    <section className="relative z-10 py-20 px-4 max-w-6xl mx-auto" id="skills">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '2rem', letterSpacing: '0.04em', color: 'var(--text)', marginBottom: '0.5rem' }}>
          Skills
        </h2>
        <p className="max-w-2xl" style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          languages, frameworks and tools I reach for
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {skillGroups.map((group, gi) => (
          <motion.div
            key={group.label}
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: gi * 0.06 }}
            whileHover={{ y: -4 }}
            className="rounded-xl p-5 transition-colors"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
          >
            <h3
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--accent)' }}
            >
              {group.label}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.skills.map(skill => (
                <span
                  key={skill}
                  className="px-2.5 py-1 text-xs rounded-md transition-colors"
                  style={{
                    background: 'var(--tag-bg)',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--tag-border)',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
