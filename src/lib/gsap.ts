import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// The only place GSAP plugins are registered. Import gsap/ScrollTrigger from here.
gsap.registerPlugin(ScrollTrigger, CustomEase, useGSAP);

// House ease, same curve as the `.ease-expo` CSS utility.
CustomEase.create('expo', '0.16, 1, 0.3, 1');

export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
// Desktop with a precise pointer: the only place heavy pointer/scroll effects run.
export const FINE_POINTER_DESKTOP = '(min-width: 768px) and (hover: hover) and (pointer: fine)';

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION).matches;
}

export { gsap, ScrollTrigger, CustomEase, useGSAP };
