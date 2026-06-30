import { motion } from 'framer-motion';

const lines = [
  "I'm a systems engineer who gravitates toward the hard parts of software:",
  "tight performance budgets, security and integrity guarantees, and",
  "architectures with a lot of moving pieces.",
  "",
  "My work runs close to the metal — Rust, C/C++ and Java — across GPU",
  "compute, distributed systems, real-time sync and low-level tooling. I care",
  "about local-first design, doing things correctly under constraint, and",
  "shipping software that holds up when it actually matters.",
  "",
  "Off the keyboard: bikes, mountains, and rabbit holes about obscure things.",
];

export default function About() {
  return (
    <section className="relative z-10 py-20 px-6 max-w-3xl mx-auto" id="about">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">About</h2>
        <div style={{ marginTop: '1.5rem' }}>
          {lines.map((line, i) => (
            line ? (
              <p
                key={i}
                style={{
                  color: 'var(--fg-dim)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.95rem',
                  lineHeight: 1.8,
                  marginBottom: 0,
                }}
              >
                {line}
              </p>
            ) : (
              <div key={i} style={{ height: '0.6rem' }} />
            )
          ))}
        </div>
      </motion.div>
    </section>
  );
}
