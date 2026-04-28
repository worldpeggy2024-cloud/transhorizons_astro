/**
 * smoothScroll — custom eased scroll utility
 * Uses a cubic ease-in-out curve for a fluid, controlled glide.
 * Accounts for the fixed navbar height so sections land correctly.
 */

const NAVBAR_HEIGHT = 90; // px — matches the fixed header height
const DURATION = 800;     // ms — total scroll duration

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function smoothScrollTo(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;

  const targetY = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
  const startY = window.scrollY;
  const distance = targetY - startY;
  let startTime: number | null = null;

  function step(timestamp: number) {
    if (startTime === null) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / DURATION, 1);
    const eased = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * eased);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}
