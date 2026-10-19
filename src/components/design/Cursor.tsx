'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useMotionPrefs } from '@/hooks/useMotionPrefs';

type CursorState = 'default' | 'link' | 'view' | 'hidden';

/** Reads the state from the hovered element: `data-cursor="view|link|hidden"`, links/buttons → link. */
function getCursorState(target: EventTarget | null): CursorState {
  if (!(target instanceof Element)) return 'default';
  const explicit = target.closest<HTMLElement>('[data-cursor]')?.dataset.cursor;
  if (explicit === 'view' || explicit === 'link' || explicit === 'hidden') return explicit;
  if (target.closest('a, button, [role="button"], label, select')) return 'link';
  return 'default';
}

/**
 * Site-wide custom cursor (desktop with a fine pointer only): a dot that grows over
 * links and turns into a "VIEW" pill over projects. The native cursor is hidden via
 * `html.has-custom-cursor` only while this is mounted and the pointer is inside the page.
 */
export function Cursor() {
  const { isFinePointerDesktop, reduced } = useMotionPrefs();
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!isFinePointerDesktop) return;
      const root = rootRef.current!;
      const dot = dotRef.current!;
      const pill = pillRef.current!;
      const html = document.documentElement;

      const follow = reduced ? 0.05 : 0.45;
      const xTo = gsap.quickTo(root, 'x', { duration: follow, ease: 'power3' });
      const yTo = gsap.quickTo(root, 'y', { duration: follow, ease: 'power3' });

      let state: CursorState | null = null;
      let visible = false;

      const setState = (next: CursorState) => {
        if (next === state) return;
        state = next;
        const d = { duration: 0.35, ease: 'expo', overwrite: 'auto' as const };
        gsap.to(dot, { ...d, scale: next === 'link' ? 3.2 : next === 'default' ? 1 : 0 });
        gsap.to(pill, {
          ...d,
          scale: next === 'view' ? 1 : 0.4,
          autoAlpha: next === 'view' ? 1 : 0,
        });
      };

      const show = (show: boolean) => {
        if (show === visible) return;
        visible = show;
        html.classList.toggle('has-custom-cursor', show);
        gsap.to(root, { autoAlpha: show ? 1 : 0, duration: 0.2, overwrite: 'auto' });
      };

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        if (!visible) gsap.set(root, { x: e.clientX, y: e.clientY });
        show(true);
        xTo(e.clientX);
        yTo(e.clientY);
      };
      const onOver = (e: PointerEvent) => setState(getCursorState(e.target));
      const onLeave = () => show(false);
      const onDown = () => gsap.to(dot, { scale: '*=0.7', duration: 0.15, yoyo: true, repeat: 1 });

      setState('default');
      gsap.set(root, { autoAlpha: 0 });
      window.addEventListener('pointermove', onMove);
      document.addEventListener('pointerover', onOver);
      document.documentElement.addEventListener('pointerleave', onLeave);
      window.addEventListener('pointerdown', onDown);

      return () => {
        window.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerover', onOver);
        document.documentElement.removeEventListener('pointerleave', onLeave);
        window.removeEventListener('pointerdown', onDown);
        html.classList.remove('has-custom-cursor');
      };
    },
    { dependencies: [isFinePointerDesktop, reduced], revertOnUpdate: true },
  );

  if (!isFinePointerDesktop) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[99998] invisible"
    >
      <div
        ref={dotRef}
        className="bg-flax-smoke-50 absolute -top-1.5 -left-1.5 size-3 rounded-full mix-blend-difference"
      />
      <div
        ref={pillRef}
        className="bg-flax-smoke-500 text-flax-smoke-50 absolute top-3 left-3 flex origin-top-left items-center gap-2 rounded-md py-1 pr-4 pl-1 invisible"
      >
        <span className="flex-center bg-flax-smoke-200 text-flax-smoke-900 size-7 rounded-xs">⮡</span>
        <span className="text-sm font-semibold tracking-wider uppercase">View</span>
      </div>
    </div>
  );
}
