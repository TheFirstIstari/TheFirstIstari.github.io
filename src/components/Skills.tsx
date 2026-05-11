import { motion } from 'framer-motion';

const skillGroups = [
  {
    label: 'Languages',
    skills: ['Rust', 'Python', 'C / C++', 'Java', 'TypeScript', 'C#'],
  },
  {
    label: 'AI / ML',
    skills: ['llama.cpp', 'CUDA', 'NumPy', 'Polars', 'Local LLM Inference'],
  },
  {
    label: 'Systems & Desktop',
    skills: ['Tauri', 'NeoForge', 'PySide6 / Qt', 'FFmpeg'],
  },
  {
    label: 'Web & Visualisation',
    skills: ['Astro', 'SvelteKit', 'Three.js / WebGL', 'React', 'Tailwind'],
  },
  {
    label: 'Data & Infra',
    skills: ['astropy', 'Blender Python API', 'GIS / GPX', 'Git', 'GitHub Actions'],
  },
  {
    label: 'Cryptography',
    skills: ['Zero-Knowledge Proofs', 'Threshold Cryptography', 'Transparency Logs'],
  },
];

export default function Skills() {
  return (
    <section className="py-20 px-4 max-w-6xl mx-auto" id="skills">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text)' }}>
          Skills
        </h2>
        <p className="max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          Languages, frameworks and tools I work with regularly.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillGroups.map((group, gi) => (
          <motion.div
            key={group.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: gi * 0.08 }}
            className="rounded-2xl p-6 transition-colors"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
          >
            <h3
              className="text-sm font-semibold uppercase tracking-widest mb-4"
              style={{ color: '#028090' }}
            >
              {group.label}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.skills.map(skill => (
                <span
                  key={skill}
                  className="px-3 py-1 text-xs rounded-full transition-colors"
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
