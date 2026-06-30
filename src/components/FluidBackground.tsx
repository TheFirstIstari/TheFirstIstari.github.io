// ponytail: 3 blurred blobs with mix-blend-mode, no SVG filter.
// Gooey filter (feGaussianBlur + feColorMatrix) caused lag on every animation frame.
// CSS filter: blur() is GPU-composited and much cheaper.
export default function FluidBackground() {
  return (
    <div aria-hidden="true" style={{
      position: 'fixed', inset: 0, zIndex: 0,
      overflow: 'hidden', pointerEvents: 'none',
    }}>
      <div
        style={{
          position: 'absolute', inset: 0,
          filter: 'blur(60px)',
          transform: 'translateZ(0)',
        }}
      >
        <div className="blob-1" style={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          background: '#c8a078', opacity: 0.6,
          top: '10%', left: '20%',
          willChange: 'transform',
        }} />
        <div className="blob-2" style={{
          position: 'absolute', width: 350, height: 350, borderRadius: '50%',
          background: '#8a6040', opacity: 0.5,
          bottom: '15%', right: '15%',
          willChange: 'transform',
        }} />
        <div className="blob-3" style={{
          position: 'absolute', width: 250, height: 250, borderRadius: '50%',
          background: '#d4b896', opacity: 0.4,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
        }} />
      </div>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(26,22,20,0.9) 100%)',
      }} />
    </div>
  );
}
