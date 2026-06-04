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
        className="overflow-hidden rounded-xl"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
        }}
      >
        {/* window bar */}
        <div
          className="flex items-center gap-2 px-4 py-2.5"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#e06b82' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#e3b341' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#2dd4bf' }} />
          <span className="ml-3 text-xs" style={{ color: 'var(--text-faint)' }}>
            ~/about
          </span>
        </div>

        <div className="p-5 md:p-7 text-sm md:text-[0.95rem] leading-7">
          <div className="mb-3">
            <span style={{ color: 'var(--accent-2)' }}>❯ </span>
            <span style={{ color: 'var(--text)' }}>cat about.txt</span>
          </div>
          {lines.map((line, i) => (
            <motion.p
              key={i}
              initial={reduced ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.04 * i, duration: 0.4 }}
              className="whitespace-pre-wrap break-words"
              style={{ color: line ? 'var(--text-muted)' : 'transparent', minHeight: '1.2em' }}
            >
              {line || '\u00a0'}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
