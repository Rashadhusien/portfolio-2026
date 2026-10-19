import type Lenis from 'lenis';

let lenisInstance: Lenis | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function setLenis(lenis: Lenis) {
  lenisInstance = lenis;
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
