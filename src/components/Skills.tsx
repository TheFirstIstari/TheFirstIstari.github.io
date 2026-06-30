import { motion } from 'framer-motion';

const skillGroups = [
  { label: 'Languages', skills: ['Rust', 'C / C++', 'Java', 'Python', 'TypeScript', 'C#'] },
  { label: 'Performance & GPU', skills: ['CUDA', 'Metal', 'SIMD', 'Multithreading', 'Profiling', 'Benchmarking'] },
  { label: 'ML & Inference', skills: ['llama.cpp', 'Local LLM Inference', 'NumPy', 'Polars'] },
  { label: 'Security & Crypto', skills: ['Zero-Knowledge Proofs', 'Threshold Cryptography', 'Transparency Logs', 'Local-First / Privacy'] },
  { label: 'Systems & Desktop', skills: ['Tauri', 'NeoForge', 'PySide6 / Qt', 'FFmpeg', 'Distributed Systems'] },
  { label: 'Web & Visualisation', skills: ['Astro', 'Next.js', 'SvelteKit', 'Three.js / WebGL', 'React', 'Tailwind'] },
  { label: 'Data & Infra', skills: ['SpacetimeDB', 'SQLite', 'astropy', 'Blender Python API', 'GIS / GPX', 'GitHub Actions'] },
];

export default function Skills() {
  return (
    <section className="relative z-10 py-20 px-6 max-w-6xl mx-auto" id="skills">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <h2 className="section-title">Skills</h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {skillGroups.map((group, gi) => (
          <motion.div
            key={group.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: gi * 0.06 }}
            whileHover={{ y: -4 }}
            className="project-card"
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
                  className="project-tag"
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
