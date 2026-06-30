import { useState, useEffect } from 'react';

const links = [
  { label: 'Projects', href: '/projects/' },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'nav-blur' : ''}`}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <a
          href="/"
          className="nav-link"
          style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}
        >
          TheFirstIstari
        </a>
        <div className="flex items-center gap-6">
          {links.map(link => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
