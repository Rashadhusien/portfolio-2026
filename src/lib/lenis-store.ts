import type Lenis from 'lenis';

let lenisInstance: Lenis | null = null;
// The page starts locked (preloader); see body.stop-scrolling in layout.tsx.
let scrollLocked = true;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function setLenis(lenis: Lenis) {
  lenisInstance = lenis;
  if (scrollLocked) lenis.stop();
  emit();
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function clearLenis() {
  lenisInstance = null;
  emit();
}

export function subscribeLenis(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Locks/unlocks page scroll for both Lenis and native scrolling (reduced motion). */
export function setScrollLocked(locked: boolean) {
  scrollLocked = locked;
  document.body.classList.toggle('stop-scrolling', locked);
  if (locked) lenisInstance?.stop();
  else lenisInstance?.start();
}

/** Smooth-scrolls with Lenis when it runs, otherwise falls back to native scrolling. */
export function scrollToTarget(target: string | HTMLElement | number, duration = 3) {
  if (lenisInstance) {
    lenisInstance.start();
    lenisInstance.scrollTo(target, { duration });
    return;
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  el?.scrollIntoView();
}
