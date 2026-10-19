'use client';

import { useSyncExternalStore } from 'react';
import { FINE_POINTER_DESKTOP, REDUCED_MOTION } from '@/lib/gsap';

function useMediaQuery(query: string, serverValue: boolean) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** Live motion/device preferences used to gate effects. SSR assumes desktop, full motion. */
export function useMotionPrefs() {
  const reduced = useMediaQuery(REDUCED_MOTION, false);
  const isFinePointerDesktop = useMediaQuery(FINE_POINTER_DESKTOP, true);
  return { reduced, isFinePointerDesktop };
}
