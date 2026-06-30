export default function Preloader() {
  return (
    <div id="preloader" className="preloader" aria-hidden="true" role="presentation">
      <div className="tv-outer">
        <div className="tv-screen">
          <div className="tv-inner" id="tvInner">
            <div className="tv-bars" aria-hidden="true">
              <div className="tv-bar tv-bar--w" />
              <div className="tv-bar tv-bar--y" />
              <div className="tv-bar tv-bar--c" />
              <div className="tv-bar tv-bar--g" />
              <div className="tv-bar tv-bar--m" />
              <div className="tv-bar tv-bar--r" />
              <div className="tv-bar tv-bar--b" />
            </div>
            <div className="tv-bars-bottom" aria-hidden="true">
              <div className="tv-bar-b tv-bar-b--1" />
              <div className="tv-bar-b tv-bar-b--2" />
              <div className="tv-bar-b tv-bar-b--3" />
              <div className="tv-bar-b tv-bar-b--4" />
              <div className="tv-bar-b tv-bar-b--5" />
              <div className="tv-bar-b tv-bar-b--6" />
              <div className="tv-bar-b tv-bar-b--7" />
            </div>
            <div className="tv-barcode tv-barcode--left" aria-hidden="true" />
            <div className="tv-barcode tv-barcode--right" aria-hidden="true" />
            <div className="tv-chaos" aria-hidden="true">
              {Array.from({ length: 30 }, (_, i) => (
                <div key={i} className={`tv-cb tv-cb-${i + 1}`} />
              ))}
              <div className="tv-cross tv-cross-1" />
              <div className="tv-cross tv-cross-2" />
              <div className="tv-cross tv-cross-3" />
            </div>
            <div className="tv-center">
              <div className="tv-panel">
                <div className="tv-msg">STREAM<br />STARTING<br />SOON</div>
                <div className="tv-panel-bar">
                  <div className="tv-progress">
                    <div className="tv-progress-fill" id="tvProgressFill" />
                  </div>
                  <span className="tv-pct" id="tvPct">0%</span>
                </div>
                <div className="tv-skip-hint" id="tvSkipHint" aria-hidden="true">
                  <span className="tv-skip-desktop">PRESS SPACE OR ESC TO SKIP</span>
                  <span className="tv-skip-mobile">TAP TO SKIP</span>
                </div>
              </div>
            </div>
          </div>
          <canvas className="tv-grain-canvas" id="tvGrainCanvas" aria-hidden="true" />
          <canvas className="tv-glitch-canvas" id="tvGlitchCanvas" aria-hidden="true" />
        </div>
      </div>
      <div className="tv-bios" id="tvBios" aria-hidden="true" />
    </div>
  );
}