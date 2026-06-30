export default function Hero() {
  return (
    <section className="relative z-10 min-h-[88vh] flex items-center justify-center px-6 pt-16 pb-12">
      <div className="text-center max-w-2xl">
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 'clamp(2.8rem, 8vw, 5rem)',
            letterSpacing: '0.02em',
            lineHeight: 1.05,
            color: 'var(--text)',
            marginBottom: '1rem',
          }}
        >
          TheFirstIstari
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1.1rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: '2rem',
          }}
        >
          Systems engineer. Rust, C/C++, GPU compute, distributed systems.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { label: 'GitHub', href: 'https://github.com/TheFirstIstari' },
            { label: 'Projects', href: '/projects/' },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="nav-link text-sm px-5 py-2.5 rounded-md transition-all"
              style={{
                border: '1px solid var(--border)',
                color: 'var(--accent)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.1em',
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
