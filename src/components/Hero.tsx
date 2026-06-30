import { useEffect } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NAME = 'THEFIRSTISTARI';

function buildSlots(displayId: string, name: string, animate: boolean) {
  const display = document.getElementById(displayId);
  if (!display) return;

  // Clear existing
  display.innerHTML = '';

  name.split('').forEach((targetChar, i) => {
    const slot = document.createElement('div');
    slot.className = 'name-slot';

    if (!animate) {
      slot.style.opacity = '1';
      const ch = document.createElement('span');
      ch.className = 'name-char';
      ch.textContent = targetChar;
      slot.appendChild(ch);
      display.appendChild(slot);
      return;
    }

    // Animate: spin then land
    const spinCount = 2 + Math.floor(Math.random() * 3);
    const reel = document.createElement('div');
    reel.className = 'name-reel';

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

    slot.appendChild(reel);
    display.appendChild(slot);

    // Animate after a staggered delay
    const startDelay = i * 70 + Math.random() * 35;
    const dur = 380 + spinCount * 130;
    // Get char height
    const temp = document.createElement('span');
    temp.className = 'name-char';
    temp.textContent = 'A';
    temp.style.cssText = 'visibility:hidden;position:absolute;';
    display.appendChild(temp);
    const chHeight = temp.getBoundingClientRect().height;
    temp.remove();

    const translateY = spinCount * chHeight;

    setTimeout(() => {
      reel.style.transition = `transform ${dur}ms cubic-bezier(0.25,0.46,0.45,0.94)`;
      reel.style.transform = `translateY(-${translateY}px)`;
      setTimeout(() => {
        reel.style.transition = 'none';
        reel.style.transform = 'translateY(0)';
        reel.innerHTML = '';
        const ch = document.createElement('span');
        ch.className = 'name-char';
        ch.textContent = targetChar;
        reel.appendChild(ch);
      }, dur + 15);
    }, startDelay);
  });
}

export default function Hero() {
  useEffect(() => {
    // Short delay to let fonts load
    const t1 = setTimeout(() => {
      buildSlots('nameDisplay', NAME, false);
      const t2 = setTimeout(() => {
        buildSlots('nameDisplay', NAME, true);
      }, 1200);
      return () => clearTimeout(t2);
    }, 300);
    return () => clearTimeout(t1);
  }, []);

  // This component just runs the animation — the markup is in index.astro
  return null;
}