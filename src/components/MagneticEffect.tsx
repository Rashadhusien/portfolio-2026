'use client';

import { useEffect, type ReactNode } from 'react';
import { activateMagneto, resetMagneto } from '@/lib/animations';
import { useWindowSize } from '@/hooks/useWindowSize';

type MagneticEffectProps = {
  divId: string;
  textId: string;
  magnetoStrengthVal?: number;
  magnetoTextStrengthVal?: number;
  children: ReactNode;
};

export function MagneticEffect({
  divId,
  textId,
  magnetoStrengthVal = 70,
  magnetoTextStrengthVal = 50,
  children,
}: MagneticEffectProps) {
  const { width } = useWindowSize();

  useEffect(() => {
    if (width <= 700) return;

    const magneto = document.getElementById(divId) as HTMLElement | null;
    const magnetoText = document.getElementById(textId) as HTMLElement | null;
    if (!magneto || !magnetoText) return;

    const handleMouseMove = (e: MouseEvent) => {
      activateMagneto(
        e,
        magneto,
        magnetoText,
        magnetoStrengthVal,
        magnetoTextStrengthVal,
      );
    };

    const handleMouseLeave = () => {
      resetMagneto(magneto, magnetoText);
    };

    magneto.addEventListener('mousemove', handleMouseMove);
    magneto.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      magneto.removeEventListener('mousemove', handleMouseMove);
      magneto.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [divId, textId, magnetoStrengthVal, magnetoTextStrengthVal, width]);

  return <>{children}</>;
}
