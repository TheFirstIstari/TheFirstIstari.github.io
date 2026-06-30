// ponytail: SVG gooey filter + 6 animated circles.
// Pure CSS animations, no JS interval/RAF needed.
// The gooey filter creates the fluid organic blob effect.
// Upgrade path: mouse-follow with JS RAF if CSS-only isn't organic enough.
export default function FluidBackground() {
  return (
    <div aria-hidden="true" style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
    }}>
      {/* Scanline overlay */}
      <div className="scanline" />

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: '100%', height: '100%', opacity: 0.15 }}
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="40" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -12"
              result="goo"
            />
          </filter>
        </defs>
        <g filter="url(#goo)">
          <circle className="blob-1" cx="400" cy="300" r="160" fill="#c8a078" />
          <circle className="blob-2" cx="650" cy="500" r="140" fill="#8a6040" />
          <circle className="blob-3" cx="900" cy="200" r="120" fill="#d4b896" />
          <circle className="blob-4" cx="300" cy="600" r="100" fill="#a07858" />
          <circle className="blob-5" cx="1100" cy="600" r="90" fill="#c8a078" />
          <circle className="blob-6" cx="500" cy="400" r="70" fill="#d4b896" />
        </g>
      </svg>

      {/* Vignette overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(26,22,20,0.7) 100%)',
      }} />
    </div>
  );
}
