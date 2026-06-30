import { useEffect, useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NAME = 'THEFIRSTISTARI';

function getCharHeight(el: HTMLElement) {
  const d = document.createElement('span');
  d.className = 'name-char';
  d.textContent = 'A';
  d.style.cssText = 'visibility:hidden;position:absolute';
  el.appendChild(d);
  const h = d.getBoundingClientRect().height;
  d.remove();
  return h;
}

function getCharWidth(ch: string, el: HTMLElement) {
  const d = document.createElement('span');
  d.className = 'name-char';
  d.textContent = ch;
  d.style.cssText = 'visibility:hidden;position:absolute';
  el.appendChild(d);
  const w = d.getBoundingClientRect().width;
  d.remove();
  return w;
}

function buildSlots(display: HTMLElement, name: string, animate: boolean) {
  const existing = display.querySelectorAll('.name-slot');
  const oldLen = existing.length;

  if (oldLen > name.length) {
    for (let i = name.length; i < oldLen; i++) {
      const s = existing[i] as HTMLElement;
      s.classList.add('exiting');
      setTimeout(() => s.remove(), 380);
    }
  }

  name.split('').forEach((targetChar, i) => {
    if (!animate) {
      let slot = existing[i] as HTMLElement;
      if (!slot) {
        slot = document.createElement('div');
        slot.className = 'name-slot';
        display.appendChild(slot);
      }
      const reel = document.createElement('div');
      reel.className = 'name-reel';
      reel.style.cssText = 'transform:translateY(0);transition:none';
      const ch = document.createElement('span');
      ch.className = 'name-char';
      ch.textContent = targetChar;
      reel.appendChild(ch);
      slot.innerHTML = '';
      slot.appendChild(reel);
      return;
    }

    const spinCount = 2 + Math.floor(Math.random() * 3);
    let slot = existing[i] as HTMLElement;
    if (!slot) {
      slot = document.createElement('div');
      slot.className = 'name-slot';
      slot.style.cssText = 'width:0;opacity:0';
      display.appendChild(slot);
      setTimeout(() => {
        slot.style.width = getCharWidth(targetChar, display) + 'px';
        slot.style.opacity = '1';
      }, i * 70 + Math.random() * 35);
    }

    const reel = document.createElement('div');
    reel.className = 'name-reel';
    reel.style.cssText = 'transform:translateY(0);transition:none';

    for (let s = 0; s < spinCount; s++) {
      const ch = document.createElement('span');
      ch.className = 'name-char';
      ch.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
      reel.appendChild(ch);
    }
    const finalCh = document.createElement('span');
    finalCh.className = 'name-char';
    finalCh.textContent = targetChar;
    reel.appendChild(finalCh);

    slot.innerHTML = '';
    slot.appendChild(reel);

    const dur = 380 + spinCount * 130;
    setTimeout(() => {
      const h = getCharHeight(display);
      const translateY = spinCount * h;
      reel.style.transition = `transform ${dur}ms cubic-bezier(0.25,0.46,0.45,0.94)`;
      reel.style.transform = `translateY(-${translateY}px)`;
      setTimeout(() => {
        reel.style.cssText = 'transform:translateY(0);transition:none';
        reel.innerHTML = '';
        const ch = document.createElement('span');
        ch.className = 'name-char';
        ch.textContent = targetChar;
        reel.appendChild(ch);
      }, dur + 15);
    }, i * 70 + Math.random() * 35);
  });
}

export default function Hero() {
  const displayRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!displayRef.current || initialized.current) return;
    initialized.current = true;
    const el = displayRef.current;
    // Delay to let fonts load
    const timer = setTimeout(() => {
      buildSlots(el, NAME, false);
      // Re-spin with animation on next tick
      setTimeout(() => {
        buildSlots(el, NAME, true);
      }, 1200);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero-section">
      <div className="name-display" ref={displayRef} />
      <p className="hero-subtitle">Systems Engineer</p>
    </section>
  );
}
