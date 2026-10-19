'use client';

import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap, prefersReducedMotion, ScrollTrigger } from '@/lib/gsap';
import {
  clearLenis,
  getLenis,
  setLenis,
  subscribeLenis,
} from '@/lib/lenis-store';

export function useLenis() {
  const lenis = useSyncExternalStore(subscribeLenis, getLenis, () => null);
  return { lenis };
}

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Reduced motion: keep native scrolling; ScrollTrigger works with it as-is.
    if (prefersReducedMotion()) return;

    const instance = new Lenis({ duration: 0.8, autoRaf: false });
    // One clock for smooth scroll and ScrollTrigger, so pinned/scrubbed effects don't jitter.
    instance.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      clearLenis();
    };
  }, []);

  return <>{children}</>;
}
