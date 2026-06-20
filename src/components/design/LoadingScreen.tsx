'use client';

import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import {
  animateLoadingPath,
  animateLoadingText,
  animateLoadingTextContainer,
} from '@/lib/animations';
import { useWindowSize } from '@/hooks/useWindowSize';

export function LoadingScreen() {
  const pathRef = useRef<SVGPathElement>(null);
  const animatedRef = useRef(false);
  const { width, height } = useWindowSize();

  const getCurveHeight = () => {
    let multiplier = 0.3;
    if (width < 600) multiplier = 0.15;
    else if (width < 900) multiplier = 0.2;
    return height + height * multiplier;
  };

  const initialPath =
    width > 0 && height > 0
      ? `M0 0 L${width} 0 L${width} ${height} Q${width / 2} ${getCurveHeight()} 0 ${height}  L0 0`
      : '';
  const targetPath =
    width > 0 && height > 0
      ? `M0 0 L${width} 0 L${width} ${height} Q${width / 2} ${height} 0 ${height}  L0 0`
      : '';

  useGSAP(() => {
    if (!pathRef.current || width === 0 || height === 0 || animatedRef.current) return;
    animatedRef.current = true;

    const isSamsungBrowser = /samsung/i.test(navigator.userAgent);
    animateLoadingTextContainer();
    animateLoadingText('span.loading-text');
    animateLoadingPath(pathRef.current, targetPath, isSamsungBrowser);
  }, [width, height, targetPath]);

  if (width === 0 || height === 0) return null;

  return (
    <div
      id="loading-screen"
      className="flex-center fixed bottom-0 z-99999 size-full cursor-wait"
    >
      <div className="size-full flex-col">
        <svg
          width={width}
          height={height * 2}
          className="fill-flax-smoke-800 absolute top-0 z-0 h-[calc(100%_+_300px)] brightness-50"
        >
          <path ref={pathRef} className="w-full" d={initialPath} />
        </svg>
        <div
          id="text"
          style={{ transform: 'translateZ(0px)' }}
          className="text-flax-smoke-50/75 z-1 flex size-full flex-col items-center justify-center text-center text-4xl font-bold opacity-0 md:text-6xl"
        >
          <h3 className="overflow-clip">
            <span className="loading-text inline-block translate-y-full will-change-auto">
              Rashad
            </span>
          </h3>
          <p className="overflow-clip">
            <span className="loading-text inline-block translate-y-full opacity-70 will-change-auto">
              &copy; Portfolio {new Date().getFullYear()}
            </span>
          </p>
          <p className="heading-6 overflow-clip font-normal">
            <span className="loading-text absolute bottom-10 left-5 inline-block font-mono sm:left-14">
              Version 1.0v
            </span>
            <span className="loading-text absolute right-5 bottom-10 inline-block animate-pulse font-mono sm:right-14">
              Loading...
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
