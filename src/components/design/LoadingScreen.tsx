'use client';

import { useRef } from 'react';
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { animateHeroIntro, samsungErrorModal } from '@/lib/animations';
import { setScrollLocked } from '@/lib/lenis-store';

const SEEN_KEY = 'rh-preloader-seen';
// Curtain path in a 0–100 viewBox stretched to the screen: the bottom edge bulges
// down while the curtain lifts, then flattens (same shape as the original loader).
const CURVED = 'M0 0 H100 V100 Q50 125 0 100 Z';
const FLAT = 'M0 0 H100 V100 Q50 100 0 100 Z';

function readSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    // storage unavailable (private mode): the full intro just plays again
  }
}

/** Resolves when web fonts and the hero portrait are ready, or after a safety timeout. */
function whenPageReady(timeoutMs = 4000) {
  const hero = document.querySelector<HTMLImageElement>('#profile-img');
  const heroReady = hero
    ? hero.decode().catch(() => undefined)
    : Promise.resolve();
  const timeout = new Promise((resolve) => setTimeout(resolve, timeoutMs));
  return Promise.race([Promise.all([document.fonts.ready, heroReady]), timeout]);
}

/**
 * Preloader: a 000 → 100 counter tied to real readiness (fonts + hero image, with a
 * minimum duration), then the curved curtain lifts and the hero name rises letter
 * by letter. Shorter on repeat visits in the same session; a quick fade under
 * reduced motion. Rendered on the server so nothing flashes before it.
 */
export function LoadingScreen() {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current!;
      const reduced = prefersReducedMotion();
      const repeat = readSeen();
      const isSamsung = /samsung/i.test(navigator.userAgent);
      let killed = false;

      // Scroll unlocks once the curtain is gone (Samsung stays locked until its notice is closed).
      const finish = () => {
        gsap.set(root, { display: 'none' });
        setScrollLocked(isSamsung);
        markSeen();
        ScrollTrigger.refresh();
      };

      const reveal = () => {
        window.scrollTo(0, 0);
        samsungErrorModal(isSamsung);
        animateHeroIntro(reduced);
      };

      if (reduced) {
        whenPageReady(1500).then(() => {
          if (killed) return;
          gsap.to(root, {
            autoAlpha: 0,
            duration: 0.3,
            onStart: reveal,
            onComplete: finish,
          });
        });
        return () => {
          killed = true;
        };
      }

      const progress = { value: 0 };
      const render = () => {
        counterRef.current!.textContent = String(Math.round(progress.value)).padStart(3, '0');
        gsap.set(barRef.current, { scaleX: progress.value / 100 });
      };

      const curtain = (tl: gsap.core.Timeline, duration: number, position: gsap.Position) =>
        tl
          .to(root, { yPercent: -100, duration, ease: 'power3.inOut', onStart: () => { setTimeout(reveal, 150); } }, position)
          .to(pathRef.current, { attr: { d: FLAT }, duration, ease: 'power3.inOut' }, '<0.15');

      // Same session: skip the count, just lift the curtain.
      if (repeat) {
        progress.value = 100;
        render();
        gsap.set('.loading-counter, .loading-text, .loading-bar', { autoAlpha: 0 });
        whenPageReady(1500).then(() => {
          if (!killed) curtain(gsap.timeline({ onComplete: finish }), 0.8, 0);
        });
        return () => {
          killed = true;
        };
      }

      const intro = gsap.timeline();
      intro
        .to('.loading-text', { y: 0, duration: 1, ease: 'expo', stagger: 0.08 }, 0)
        .to(progress, { value: 90, duration: 1.8, ease: 'power2.out', onUpdate: render }, 0);

      const exit = () => {
        const tl = gsap
          .timeline({ onComplete: finish })
          .to(progress, { value: 100, duration: 0.35, ease: 'power1.out', onUpdate: render })
          .to('.loading-text, .loading-counter', { yPercent: -110, duration: 0.5, ease: 'expo.in', stagger: 0.04 }, '-=0.15')
          .to('.loading-bar', { autoAlpha: 0, duration: 0.3 }, '<');
        curtain(tl, 1.1, '-=0.25');
      };

      Promise.all([whenPageReady(), intro.then()]).then(() => {
        if (!killed) exit();
      });

      return () => {
        killed = true;
      };
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      id="loading-screen"
      aria-hidden="true"
      className="text-flax-smoke-50/80 fixed inset-0 z-[99999] cursor-wait select-none"
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="fill-flax-smoke-800 absolute inset-0 size-full overflow-visible brightness-50"
      >
        <path ref={pathRef} d={CURVED} />
      </svg>

      <div className="relative flex size-full flex-col justify-between p-5 sm:p-14">
        <div className="flex items-start justify-between font-bold">
          <p className="overflow-clip text-4xl md:text-6xl">
            <span className="loading-text inline-block translate-y-full">Rashad</span>
          </p>
          <p className="overflow-clip font-mono text-sm opacity-70 md:text-base">
            <span className="loading-text inline-block translate-y-full">
              &copy; Portfolio {new Date().getFullYear()}
            </span>
          </p>
        </div>

        <div className="flex items-end justify-between gap-6">
          <p className="overflow-clip font-mono text-sm">
            <span className="loading-text inline-block translate-y-full animate-pulse">Loading…</span>
          </p>
          <p className="overflow-clip leading-[0.8]">
            <span
              ref={counterRef}
              className="loading-counter font-title! heading-display inline-block font-bold tabular-nums -tracking-wider"
            >
              000
            </span>
          </p>
        </div>

        <div className="loading-bar bg-flax-smoke-50/10 absolute right-0 bottom-0 left-0 h-px">
          <div ref={barRef} className="bg-flax-smoke-50/60 h-full origin-left scale-x-0" />
        </div>
      </div>
    </div>
  );
}
