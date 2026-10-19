'use client';

import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import Lenis from 'lenis';
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
    const instance = new Lenis({
      duration: 0.8,
    });
    setLenis(instance);

    let rafId: number;
    const raf = (time: number) => {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    document.body.classList.add('stop-scrolling');

    const startTimeout = setTimeout(() => {
      rafId = requestAnimationFrame(raf);
    }, 2000);

    return () => {
      clearTimeout(startTimeout);
      cancelAnimationFrame(rafId);
      instance.destroy();
      clearLenis();
    };
  }, []);

  return <>{children}</>;
}
