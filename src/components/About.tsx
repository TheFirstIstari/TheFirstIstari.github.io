import { motion, useReducedMotion } from 'framer-motion';

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
  const reduced = useReducedMotion() ?? false;
  return (
    <section className="relative z-10 py-20 px-4 max-w-3xl mx-auto" id="about">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="rounded-xl p-6 md:p-8"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
        }}
      >
        {lines.map((line, i) => (
          line ? (
            <p
              key={i}
              className="whitespace-pre-wrap break-words"
              style={{
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.95rem',
                lineHeight: 1.8,
              }}
            >
              {line}
            </p>
          ) : (
            <div key={i} style={{ height: '0.8rem' }} />
          )
        ))}
      </motion.div>
    </section>
  );
}
