import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const links = [
  { label: 'skills', href: '/#skills' },
  { label: 'projects', href: '/projects' },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      style={{
        background: scrolled ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <a
          href="/"
          className="font-semibold text-sm transition-colors"
          style={{ color: 'var(--text)' }}
        >
          <span style={{ color: 'var(--accent)' }}>~</span>
          <span style={{ color: 'var(--text-faint)' }}>/</span>tweak.wiki
        </a>
        <div className="flex items-center gap-1">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="group px-3 py-1.5 text-sm rounded-md transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <span style={{ color: 'var(--accent)' }} className="opacity-0 group-hover:opacity-100 transition-opacity">cd </span>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
