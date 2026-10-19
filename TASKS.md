# TASKS.md: Phased checklist

Every task: branch from `dev` → PR into `dev` → `npm run lint && npx tsc --noEmit && npm run build` green →
checked at desktop + 375px (+ reduced motion when animated). Details and rationale are in PLAN.md.

Legend: `[ ]` todo · `[x]` done · **AC** = acceptance criteria.

---

## Phase 0: Git setup + project docs

- [x] **Create and push `dev` from `main`** (branch: `dev`)
  - AC: `origin/dev` exists and tracks `main`'s tip at b96ac22.
- [x] **Pre-push guard blocking `main`** (branch: `chore/project-docs-and-plan`)
  - AC: `.githooks/pre-push` exits 1 for `refs/heads/main`, 0 otherwise; installed in `.git/hooks`;
    `git config core.hooksPath .githooks` documented; owner override `ALLOW_MAIN_PUSH=1`.
- [x] **CLAUDE.md, PLAN.md, TASKS.md** (approved 2026-10-19) (branch: `chore/project-docs-and-plan`)
  - AC: files at repo root; PR into `dev` opened; owner approves the plan.
- [x] **Lint baseline** (branch: `chore/lint-baseline`)
  - AC: `npm run lint` → 0 errors (fix setState-in-effect in AppShell/LenisProvider/Hero, prefer-const) and unused
    imports removed; no behaviour change.
- [ ] **Tooling** (branch: `chore/tooling`)
  - AC: scripts `type-check` (`tsc --noEmit`) and `format` (`prettier --write .`); `prettier` +
    `prettier-plugin-tailwindcss` in devDeps; `tsconfig.tsbuildinfo` gitignored; `prepare` script sets
    `core.hooksPath`.
- [ ] **CI cleanup** (branch: `chore/ci-cleanup`)
  - AC: stale `vue.yml` removed; new workflow runs lint + type-check + build on PRs to `dev`.
- [ ] **Lighthouse baseline** (branch: none, notes added to PLAN.md via `chore/lighthouse-baseline`)
  - AC: mobile and desktop scores for the current production URL recorded (Perf/A11y/BP/SEO, LCP, CLS, TBT).

## Phase 1: Bug fixes

All Phase 1 branches are combined (conflict-free) in `chore/phase-1-integration`.

- [x] **1. Split-text spaces** (branch: `fix/split-text-spaces`)
  - AC: hero subtitle, testimonial quote and all headings show and copy with normal spaces; `textContent` of the
    quote contains "multiple projects has been a"; reveal animation unchanged; screen reader reads the sentence once.
- [x] **2. About `&Xopf;` → X link** (branch: `fix/about-x-link`)
  - AC: an X logo icon/link (with `aria-label`) renders inline; no literal entity anywhere; URL comes from `socialLinks`.
- [x] **3. "PLUMBING" typo** (branch: `fix/plumbing-typo`)
  - AC: the project title reads "Plumbing Services"; `grep -ri plumming src` returns nothing.
- [x] **4. Single availability config** (branch: `fix/availability-config`)
  - AC: `src/config/site.ts` holds availability + contact links; hero and contact show the same label; changing one
    value updates both; hero has no `useEffect` for the date.
- [x] **5. Project tags wrap** (branch: `fix/project-tags-wrap`)
  - AC: at 320 / 375 / 768 / 1280 / 1920px no tag overflows horizontally on "Event Management System" or
    "Full-Stack Content Platform"; `document.documentElement.scrollWidth === innerWidth`.
- [x] **6. Works index counter** (branch: `fix/works-index-counter`)
  - AC: the counter always shows 01–05 matching the card in view, including during fast scroll, scroll-up and
    Lenis `scrollTo` jumps; it never shows "0" alone; no React re-render per scroll frame.
- [x] **7. Marquee clipping** (branch: `fix/marquee-clipping`)
  - AC: descenders and the star are fully visible on both rows at all breakpoints; no vertical scrollbar/overflow added.
- [x] **8. Project media quality** (branch: `fix/project-media-quality`)
  - AC: each project has a unique ≥ 2400px mockup; `next/image` has `sizes` + `quality={90}`; AVIF served;
    videos use `poster`, `playsInline`, `preload="none"`, webm+mp4 sources; no blurred state stuck on mobile;
    no project media request > 5 MB on initial load.
- [x] **E5. Personal data cleanup** (branch: `fix/personal-data`)
  - AC: no "Ebraheem"/"hetari"/"Yemen"/`Asia/Aden`/`brhoom` left unless intentional (README attribution stays).
- [ ] **E10. A11y basics** (branch: `fix/a11y-basics`)
  - AC: no duplicate IDs (axe clean); interactive divs (scroll-to-top) are `<button>`s; images have correct alts.
- [ ] **Perf quick wins** (branches: `chore/perf-static-render`, `chore/perf-fonts`, `chore/perf-drop-moment`, `chore/prune-assets`)
  - AC: `/` is `○ (Static)` in build output; fonts via `next/font` with no Google CSS request; `moment-timezone`
    removed and clocks still correct; unused media removed after a grep confirms no references.

## Phase 2: Animation foundation

- [x] **GSAP core + Lenis sync** (branch: `feature/animation-foundation`)
  - AC: `gsap` ≥ 3.13; `src/lib/gsap.ts` is the only `registerPlugin` call; no `gsap/all` imports; Lenis runs on
    `gsap.ticker` with `ScrollTrigger.update` on scroll; no `setTimeout` start; `useMotionPrefs` hook exists;
    with reduced motion Lenis is off and all content is visible; scroll is smooth with no ScrollTrigger jitter.
- [x] **Custom cursor + magnetic** (branch: `feature/cursor-magnetic`)
  - AC: `data-cursor="link|view|hidden"` states work site-wide; "VIEW" shows over projects; all Buttons, the burger
    and social links are magnetic; cursor + magnet disabled on touch and < 768px; no listeners leak after unmount.
- [x] **Preloader** (branch: `feature/preloader`)
  - AC: counter animates 000→100 tied to real readiness (fonts + hero image) with a ≥ 1.2s minimum; curtain reveal;
    hero name letters reveal after the curtain; scroll unlocked exactly when the reveal ends; repeat visit in the same
    session = curtain only (~0.8s); reduced motion = quick fade; LCP not worse than the Phase 0 baseline
    (LCP to be measured in the Lighthouse task).

## Phase 3: Upgrades to existing sections

- [ ] **About word-by-word reveal** (branch: `feature/about-text-reveal`)
  - AC: words go from ~15 % to 100 % opacity scrubbed with scroll; reversible; readable instantly under reduced motion.
- [ ] **Velocity marquee** (branch: `feature/marquee-velocity`)
  - AC: speed and skew react to Lenis velocity and settle back within ~0.5s; direction follows scroll direction;
    skew clamped to ±12°; paused off-screen; transform-only (no layout in the Performance panel).
- [ ] **Works: hover list + cursor preview** (branch: `feature/works-hover-preview`), *recommended option B*
  - AC: desktop shows a project list with a lagging, velocity-rotated preview following the cursor; media swaps with a
    clip-path transition; giant index shows the hovered 01–05; mobile keeps the stacked cards; keyboard focus also
    shows the preview; 60fps in the Performance panel.
- [ ] **Sticky footer reveal** (branch: `feature/footer-reveal`)
  - AC: the content lifts off to reveal the footer; correct on resize; no overlap with contact; works with Lenis and
    native scroll.

## Phase 4: New sections

- [ ] **Experience stacking cards** (branch: `feature/experience-timeline`), *content in PLAN.md §D; Ziken Labs details missing*
  - AC: 3 roles from `data/experience.ts`; cards stack with scale/dim on desktop; nav link added; mobile readable.
- [ ] **Tech stack** (branch: `feature/tech-stack`)
  - AC: dual-direction marquee of local SVG logos sharing the velocity engine; (optional sphere) desktop only, drag
    to rotate, < 2 ms/frame scripting.
- [ ] **Stats count-up** (branch: `feature/stats-countup`), *proposed numbers in PLAN.md §D; client count TBD*
  - AC: numbers count once on enter with `tabular-nums` (no width jump); final values present in SSR HTML for SEO.
- [ ] **Process pinned** (branch: `feature/process-pinned`)
  - AC: 4 steps advance with scroll inside a pin with a progress line; unpinned vertical list on mobile/reduced motion;
    no layout jump after the pin ends.
- [ ] *(optional)* **Content section** (branch: `feature/content-section`), *needs channel URLs*
  - AC: video cards use a facade (no iframe until click); links open the channel.

## Phase 5: WebGL + page transitions

- [ ] **Hero WebGL distortion** (branch: `feature/hero-webgl`)
  - AC: OGL loaded via `next/dynamic({ ssr:false })` only on desktop with no reduced motion; `<Image>` stays the LCP
    and fallback; mouse distortion + scroll wave; render loop pauses off-screen; DPR ≤ 1.5; initial JS unchanged
    (verified in build output).
- [ ] *(stretch)* **Hero 3D object** (branch: `feature/hero-3d-object`)
  - AC: three.js in its own dynamic chunk; reacts to scroll; skipped on mobile; Lighthouse Perf still ≥ 90.
- [ ] **Project pages** (branch: `feature/project-pages`)
  - AC: `/work/[slug]` statically generated from `data/projects.ts` with metadata + OG image; sitemap updated.
- [ ] **Page transitions** (branch: `feature/page-transitions`)
  - AC: stairs (or curve) overlay on home ↔ project navigation via `TransitionLink` + `app/template.tsx`; browser
    back/forward works; scroll position restored on home; reduced motion = fade.

## Phase 6: QA

- [ ] **Mobile pass** (branch: `fix/qa-mobile`, only if issues are found)
  - AC: iPhone Safari + Android Chrome (real devices or emulation at 360/390/430px): no horizontal scroll, no stuck
    hidden text, videos play inline, tap targets ≥ 44px.
- [ ] **Reduced motion pass** (branch: `fix/qa-reduced-motion`)
  - AC: with `prefers-reduced-motion: reduce` every section's content is visible, no pins/velocity/WebGL, the
    preloader is a fade.
- [ ] **Lighthouse** (branch: `chore/perf-budget`)
  - AC: production build, mobile: Perf ≥ 90, A11y ≥ 95, BP ≥ 95, SEO 100; LCP < 2.5s, CLS < 0.1; results recorded in PLAN.md.
- [ ] **Cross-browser** (branch: `fix/qa-cross-browser`)
  - AC: latest Chrome, Firefox, Safari, Edge and Samsung Internet: animations, cursor, WebGL fallback and
    transitions behave; no console errors.
- [ ] **Release** (owner only)
  - AC: owner merges `dev` → `main` manually; Vercel production deploy verified.
