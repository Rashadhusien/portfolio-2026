'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Cursor } from '@/components/design/Cursor';
import { LoadingScreen } from '@/components/design/LoadingScreen';
import { SamsungError } from '@/components/design/SamsungError';
import { Nav } from '@/components/common/Nav';
import { useLenis } from '@/components/providers/LenisProvider';
import { useWindowSize } from '@/hooks/useWindowSize';

gsap.registerPlugin(useGSAP);

export function AppShell({ children }: { children: React.ReactNode }) {
  const { lenis } = useLenis();
  const { width, height } = useWindowSize();
  const noiseRef = useRef<SVGRectElement>(null);
  const [isSamsungBrowser, setIsSamsungBrowser] = useState(false);

  useEffect(() => {
    setIsSamsungBrowser(/samsung/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    if (noiseRef.current && width && height) {
      noiseRef.current.style.height = `${height * 2}px`;
      noiseRef.current.style.width = `${width}px`;
    }
  }, [width, height]);

  const handleScrollLock = (isLocked: boolean) => {
    if (!lenis) return;
    if (isLocked) lenis.stop();
    else lenis.start();
  };

  return (
    <>
      <LoadingScreen />
      {isSamsungBrowser && <SamsungError />}

      <div className="pointer-events-none fixed inset-0 z-50">
        <svg
          className="h-[150vh] w-full object-cover object-center"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="1" stitchTiles="stitch" />
            <feBlend mode="screen" />
          </filter>
          <rect ref={noiseRef} className="size-full" filter="url(#noise)" opacity="0.15" />
        </svg>
      </div>

      <Cursor />
      <Nav onScrollLock={handleScrollLock} />
      {children}
    </>
  );
}
