'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import Lenis from 'lenis';
import { clearLenis, setLenis } from '@/lib/lenis-store';

type LenisContextValue = {
  lenis: Lenis | null;
};

const LenisContext = createContext<LenisContextValue>({ lenis: null });

export function useLenis() {
  return useContext(LenisContext);
}

export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenisState] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({
      duration: 0.8,
    });
    setLenisState(instance);
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
      setLenisState(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={{ lenis }}>
      {children}
    </LenisContext.Provider>
  );
}
