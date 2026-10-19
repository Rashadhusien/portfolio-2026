'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useMotionPrefs } from '@/hooks/useMotionPrefs';

type MagneticProps = {
  children: ReactNode;
  /** How far the element follows the pointer, as a fraction of the pointer's offset from its centre. */
  strength?: number;
  /** Extra pull for a child marked `data-magnetic-inner` (icon/label), for a parallax feel. */
  innerStrength?: number;
  className?: string;
};

/**
 * Pulls its content toward the pointer and springs back on leave.
 * Desktop/fine pointer only and off under reduced motion; transform-only.
 */
export function Magnetic({
  children,
  strength = 0.35,
  innerStrength = 0.2,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const { isFinePointerDesktop, reduced } = useMotionPrefs();

  useGSAP(
    () => {
      if (!isFinePointerDesktop || reduced) return;
      const el = ref.current!;
      const inner = el.querySelector<HTMLElement>('[data-magnetic-inner]');

      const spring = { duration: 1, ease: 'elastic.out(1, 0.3)' };
      const xTo = gsap.quickTo(el, 'x', spring);
      const yTo = gsap.quickTo(el, 'y', spring);
      const innerXTo = inner ? gsap.quickTo(inner, 'x', spring) : null;
      const innerYTo = inner ? gsap.quickTo(inner, 'y', spring) : null;

      const onMove = (e: PointerEvent) => {
        const { left, top, width, height } = el.getBoundingClientRect();
        const dx = e.clientX - (left + width / 2);
        const dy = e.clientY - (top + height / 2);
        xTo(dx * strength);
        yTo(dy * strength);
        innerXTo?.(dx * innerStrength);
        innerYTo?.(dy * innerStrength);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
        innerXTo?.(0);
        innerYTo?.(0);
      };

      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
      return () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
      };
    },
    { scope: ref, dependencies: [isFinePointerDesktop, reduced, strength, innerStrength], revertOnUpdate: true },
  );

  return (
    <span ref={ref} className={`inline-block will-change-transform ${className ?? ''}`}>
      {children}
    </span>
  );
}
