import { motion } from 'framer-motion';

export default function About() {
  return (
    <section className="py-20 px-4 max-w-4xl mx-auto" id="about">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative rounded-3xl p-8 md:p-12 backdrop-blur-sm"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          boxShadow: '0 4px 40px rgba(0,0,0,0.2)',
        }}
      >
        {/* Accent gradient */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#028090]/5 via-transparent to-[#b6465f]/5 pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-[#fbfbff] to-[#028090] bg-clip-text text-transparent">
            About me
          </h2>
          <div className="space-y-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            <p>
              I'm a developer and engineer interested in the intersection of systems programming, AI, and data visualisation.
              I build tools that prioritise local-first design, performance, and real-world utility — from forensic analysis
              platforms to astronomical visualisers.
            </p>
            <p>
              My work spans low-level systems (Rust, C, Java), AI/ML pipelines (local LLM inference, GPU compute),
              and interactive front-ends (SvelteKit, Three.js, Astro). I enjoy taking on projects that require
              deep technical breadth — whether that's zero-knowledge cryptography, Minecraft mod architecture, or
              mapping 40 million galaxies in 3D.
            </p>
            <p>
              When I'm not coding I'm usually on my bike, in the mountains, or deep in a rabbit hole about something
              obscure and fascinating.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
