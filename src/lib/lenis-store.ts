import type Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export function setLenis(lenis: Lenis) {
  lenisInstance = lenis;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function clearLenis() {
  lenisInstance = null;
}
