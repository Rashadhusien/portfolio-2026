# PLAN.md: Portfolio upgrade roadmap

Goal: take the current portfolio to awwwards-level motion **without** losing its identity (off-white / `#0B0B0A`
panels, `flax-smoke` palette, bold grotesk type, grain overlay) and keep Lighthouse ≥ 90.

Rules for every item: branch from `dev`, PR into `dev`, Conventional Commits, `lint + tsc + build` green
(see CLAUDE.md). Complexity: **S** ≤ ½ day · **M** 1–2 days · **L** 3+ days.
Perf risk: **Low** / **Med** / **High** (High means it needs a mobile/reduced-motion fallback and a Lighthouse check).

---

## 0. Current state (exploration summary)

- **Stack:** Next.js 16.2 (App Router, Turbopack), React 19.2, TypeScript strict, Tailwind v4 (CSS-first `@theme`).
- **Animation:** already GSAP 3.12 + `@gsap/react` + ScrollTrigger + Lenis 1.2 + lottie-react. **No Framer Motion.**
  Shared helpers live in `src/lib/animations/index.ts`; most sections target global IDs (`#hero`, `#index`…).
- **Sections:** `Hero` (sticky, SVG name letters, split subtitle, availability) → dark panel with `Services`
  (sticky stacked cards), `Marquee` (two GSAP loops), `Works` (sticky giant index + 5 video cards) → `AboutMe` →
  `People` (testimonial slider with split quote) → `Contact` (video bg + Lottie) → `Footer` (links, clocks, magnetic
  scroll-to-top). `LoadingScreen` (name + curved curtain) and `Cursor` ("view" pill over works) already exist.
- **Data:** split between `src/lib/data.ts` (links, hero text, location, cal.com) and arrays inlined inside
  components (`Works.tsx` projects, `Slider.tsx` testimonials, `Services.tsx` cards).
- **Baseline health (2026-10-19, `dev`):** `tsc` ✅, `next build` ✅ (but `/` is dynamic because of
  `export const dynamic = 'force-dynamic'`), `npm run lint` ❌ **4 errors / 11 warnings** (setState-in-effect ×3,
  prefer-const ×1). Lighthouse not yet measured.

### Extra findings (not in the original bug list)

| # | Finding | Where | Proposed fix / branch |
|---|---|---|---|
| E1 | Lint fails on `dev`, so the "lint must pass" rule can't be met | AppShell, LenisProvider, Hero, lib/functions | `chore/lint-baseline` |
| E2 | Stale `.github/workflows/vue.yml` from the original Vue repo runs on **every push** (VuePagesAction, user "Hetari") | `.github/workflows` | delete it in `chore/ci-cleanup`, optionally add a lint/tsc/build workflow |
| E3 | `force-dynamic` turns a static page into per-request SSR (slower TTFB, no CDN cache) | `app/layout.tsx` | remove in `chore/perf-static-render` |
| E4 | Fonts loaded 3× (CSS `@import`, `<link rel=preload>`, `<link rel=stylesheet>`); `font-body` points at an undefined `'body'` family | `layout.tsx`, `globals.css` | `next/font` (local Cabinet Grotesk + Bricolage) in `chore/perf-fonts` |
| E5 | Leftovers from the original author: About alt "Headshot of **Ebraheem**", footer clock uses `Asia/Aden`, location "Yemen, Sanaa" + coords, metadata keywords `hetari`/`ebraheem alhetari`, cal.com link `brhoom/30min` | AboutMe, Footer, data.ts, layout.tsx | `fix/personal-data`. **Needs your real timezone, location and cal.com link.** |
| E6 | `moment-timezone` (large) only used for two clocks | Footer | replace with `Intl.DateTimeFormat` in `chore/perf-drop-moment` |
| E7 | ~62 MB of unused media is deployed (`project1-3.mp4`, `profile.png` 1.7 MB, `1.webp`, `*.jfif`, `esmail/mohammad.webp`) | `public/` | `chore/prune-assets` (verify with grep first) |
| E8 | GSAP plugins registered in 3 places; `Marquee` imports `gsap/all` (every plugin in the bundle) | AppShell, lib/animations, Marquee | `src/lib/gsap.ts` in the animation foundation |
| E9 | Lenis isn't synced to ScrollTrigger (own rAF loop, hardcoded 2s start delay); loader uses a fixed 3s delay | LenisProvider, lib/animations | animation foundation |
| E10 | Every `Button` renders `id="button"` (duplicate IDs) | common/Button | fold into `fix/a11y-basics` |
| E11 | `tsconfig.tsbuildinfo` isn't gitignored; no `type-check`/`format` scripts; Prettier plugin is configured but not installed | root | `chore/tooling` |
| E12 | Project 2 and 5 share `5.webp` as background | Works | resolved by the new mockups (B8) |
| E13 | WhatsApp/contact URLs hardcoded in Hero and Contact | Hero, Contact | `src/config/site.ts` (same as bug 4) |

---

## A) Known bugs (each a `fix/*` branch, done first)

| # | Bug | Root cause (from code) | Fix | Files | Libs | Cx | Perf risk | Branch |
|---|---|---|---|---|---|---|---|---|
| 1 | Spaces vanish in split text ("multipleprojectshasbeena…") | `SplitText`/`QuoteSplitText` render each word as an `inline-block` span with **no space text node** between them. The quote calls `getWordWrapperClassName(false)` without `isSpace`, so there is no margin either. The hero has a margin, but copied or read text still has no spaces. | Emit a real `' '` between word spans (keep `overflow-clip` on the word only), `aria-label` the full sentence on the `<p>`, `aria-hidden` the letters, drop the `mr-[0.25em]` hack. One shared component, used by the quote too. | `components/SplitText.tsx`, `lib/functions/index.ts`, `design/Slider.tsx`, `sections/Hero.tsx` | none | S | Low | `fix/split-text-spaces` |
| 2 | `&Xopf;` shows literally in About | Used inside `<i>` as an HTML entity; JSX doesn't decode named entities like `&Xopf;` | Replace with an inline X logo SVG wrapped in an `<a>` to your X profile (add `x` to `socialLinks`), `aria-label="X (Twitter)"` | `sections/AboutMe.tsx`, `lib/data.ts` | none | S | Low | `fix/about-x-link` |
| 3 | "PLUMMING" typo | `name: 'Plumming Services'` | → `'Plumbing Services'` (done while moving projects to `src/data/projects.ts`) | `sections/Works.tsx` → `data/projects.ts` | none | S | Low | `fix/plumbing-typo` |
| 4 | Availability dates disagree (hero "OCT '26" = *current month*, contact hardcoded "SEP '24") | `getAvailableForWorkDate()` returns `new Date()`'s month; Contact has a literal string | `src/config/site.ts` → `availability: { label: "NOV '26", isAvailable: true }` plus `contact.whatsapp`, `email`, `timezone`. Hero and Contact both read it, so the hero no longer needs a `useEffect`/`setState` (also fixes a lint error). | new `config/site.ts`, `Hero.tsx`, `Contact.tsx`, `lib/functions` | none | S | Low | `fix/availability-config` |
| 5 | Tech tags overflow off-screen on long titles | Tag row is `flex gap-1.5` with no wrap, sitting next to a `heading-3` title in `sm:flex justify-between` | Title row → `flex flex-col gap-3 lg:flex-row lg:items-end`, tags → `flex flex-wrap gap-1.5 lg:justify-end`, title `text-balance min-w-0` | `sections/Works.tsx` | none | S | Low | `fix/project-tags-wrap` |
| 6 | Project counter shows just "0" between projects | The `#index` span is pushed out of its `overflow-hidden` box by overlapping `gsap.to/set` chains fired from a scrubbed tween's `onComplete`/`onLeaveBack`. There's no `overwrite`, and `setIndex` runs inside a tween callback, so fast scrolling leaves it at `yPercent: ±100` and only the static "0" shows. | One ScrollTrigger per card with `onToggle` → active index; render a **digit reel** (01…05 stacked) and tween the reel's `yPercent` to `-i*100` with `overwrite: 'auto'`; zero-pad with `padStart(2,'0')`. No React state during scroll. | `sections/Works.tsx` | none | M | Low | `fix/works-index-counter` |
| 7 | Marquee text clipped at the bottom | Section is `overflow-clip` + `leading-none`; grotesk descenders and the 2nd row (`absolute bottom-0 translate-y-full`) get cut | `leading-[1.1]` + `py-[0.1em]` on the row, clip only on the X axis (`overflow-x-clip`), size the 2nd row in flow instead of absolute | `design/Marquee.tsx` | none | S | Low | `fix/marquee-clipping` |
| 8 | Project images low-res/blurry | (a) videos keep the `blur` class until **75 %** visible, which tall mobile cards may never reach; (b) `next/image` has `width=800` and **no `sizes`**, so retina gets an upscaled 800w; (c) `4.webp` is 1280×625 forced into a square, `5.webp` 720×1080 reused twice; (d) default quality 75, WebP only; (e) recordings shown at 80 % `object-contain` | **Assets:** new mockups per project at 2400×2400 (or 2400×1800 4:3), shown in a device frame on a `flax-smoke` background (Figma / shots.so), exported as high-quality WebP/AVIF; re-encode videos to 1440p (WebM VP9 + MP4 H.264, CRF ~28) plus a poster frame. **Code:** `images: { formats: ['image/avif','image/webp'], qualities: [75, 90] }`, `sizes="(min-width:768px) 58vw, 100vw"`, `quality={90}`, `placeholder="blur"` via static imports; videos `preload="none" playsInline loop poster` with `<source>` webm+mp4; replace the blur gate with a 300 ms opacity fade at 25 % visibility. | `next.config.ts`, `sections/Works.tsx`, `public/images/work/*`, `public/videos/*` | none | M (+ asset time) | Low (better LCP) | `fix/project-media-quality` |

---

## B) Animation upgrades

Shared foundation first (`feature/animation-foundation`, Phase 2):

- **Upgrade `gsap` to ≥ 3.13.** All former Club plugins (SplitText, ScrambleText, CustomEase, Flip, Inertia) are
  free since then. GSAP's `SplitText` (with `aria: 'auto'` and `mask`) can replace the hand-rolled splitter later.
- `src/lib/gsap.ts`: registers ScrollTrigger, SplitText, CustomEase once; defines the house eases
  (`CustomEase.create('expo', '0.16,1,0.3,1')`, matching `.ease-expo`).
- `LenisProvider`: Lenis driven by `gsap.ticker`, `lenis.on('scroll', ScrollTrigger.update)`, `lagSmoothing(0)`,
  started by the preloader timeline instead of `setTimeout(2000)`. It exposes `velocity` for the marquee and is off
  under reduced motion.
- `src/hooks/useMotionPrefs.ts`: `{ reduced, isTouch, isDesktop }` via `matchMedia`, used to gate effects.

| Item | What / how | Libraries | Affected files | Cx | Perf risk | Branch |
|---|---|---|---|---|---|---|
| **Preloader** | Replace `LoadingScreen`: big counter **000 → 100** (progress = fonts ready + hero image decoded + min 1.2s, eased), then a **curtain reveal** (keep the existing curved SVG path morph, or a 5-column stair wipe), then the hero name revealed letter by letter (the `MyEnName` SVG paths already stagger; tighten with `expo` + `yPercent` from 110). Session-once: shorter on repeat visits (`sessionStorage`). Reduced motion: fade only. | gsap (+CustomEase) | `design/LoadingScreen.tsx`, `lib/animations/index.ts`, `AppShell.tsx`, `providers/LenisProvider.tsx` | M | Med (it blocks LCP: keep the hero image `priority` and render the hero under the curtain) | `feature/preloader` |
| **Custom cursor + magnetic** | One global cursor (dot + ring) with `quickTo`. States come from `data-cursor` attributes: `default`, `link` (ring grows), `view` (pill with "VIEW" over projects), `drag`, `hidden` (over text inputs/video controls). Generalise `MagneticEffect` into a ref-based `<Magnetic strength>` and apply it to all `Button`s, the burger, social links and scroll-to-top. Off on touch / `< md`. | gsap | `design/Cursor.tsx`, `MagneticEffect.tsx` → `common/Magnetic.tsx`, `common/Button.tsx`, `common/Nav.tsx`, `sections/Works.tsx` | M | Low | `feature/cursor-magnetic` |
| **Hero WebGL** | Profile photo rendered in an **OGL** plane with a fragment shader: mouse-driven RGB-shift/ripple distortion, scroll-driven wave on exit, grain kept consistent. Lazy: `next/dynamic(..., { ssr:false })` mounted after the preloader, `<Image>` stays as the LCP + fallback (mobile, reduced motion, no WebGL2). **Optional** subtle 3D object (low-poly torus-knot/blob in `flax-smoke` matcap) reacting to scroll velocity, as a separate stretch branch since it needs three.js. | `ogl` (~25 KB gz). Stretch: `three` + `@react-three/fiber` (dynamic only) | `sections/Hero.tsx`, new `components/webgl/HeroImage.tsx`, `components/webgl/shaders/*` | L | **High** (desktop-only, IntersectionObserver pause, DPR cap 1.5) | `feature/hero-webgl`, stretch `feature/hero-3d-object` |
| **Projects** | See comparison below. **Recommended: Option B (hover list with a cursor-following preview)** on desktop, with the existing stacked video cards kept on mobile. | gsap | `sections/Works.tsx` → `sections/works/*`, `data/projects.ts`, `design/Cursor.tsx` | L | Med | `feature/works-hover-preview` |
| **About text reveal** | The main About paragraph splits into words; each word's opacity scrubs 0.15 → 1 (optionally a `background-clip:text` gradient sweep) as it crosses the viewport. ScrollTrigger `scrub: true`, `start: 'top 80%'`, `end: 'bottom 50%'`. Reduced motion: full opacity. | gsap (SplitText) | `sections/AboutMe.tsx`, `SplitText.tsx` (word mode) | S | Low | `feature/about-text-reveal` |
| **Velocity marquee** | Rebuild on the existing `lib/horizontal-loop.js` (`horizontalLoop`). Lenis `velocity` → `quickTo(loop.timeScale)` (direction follows scroll direction) and `quickTo(skewX)` clamped to ±12°, both decaying back to base. Pause when off-screen. | gsap, lenis | `design/Marquee.tsx`, `lib/horizontal-loop.js` → `.ts` | M | Low (transform only) | `feature/marquee-velocity` |
| **Page transitions** | Needs project pages first (`app/work/[slug]/page.tsx`, static via `generateStaticParams`). A `TransitionLink` plays an overlay (**stairs**: 5 columns `scaleY` 0→1, staggered) then `router.push`; `app/template.tsx` plays the out-animation on mount. The curve variant reuses the loader's SVG path. No extra library. Reduced motion: 200 ms fade. | gsap | new `app/work/[slug]/*`, `app/template.tsx`, `components/transition/*`, `data/projects.ts` | L | Med | `feature/project-pages` → `feature/page-transitions` |
| **Sticky footer reveal** | Wrapper `relative h-[var(--footer-h)]` with `clip-path: polygon(0 0,100% 0,100% 100%,0 100%)`, inner footer `fixed bottom-0 h-[var(--footer-h)]`, so the page lifts off to reveal it. Pure CSS plus one `ResizeObserver` for the height. Contact's bottom gets a rounded edge to match About. | none | `design/Footer.tsx`, `app/page.tsx` | S | Low | `feature/footer-reveal` |

### Projects: option comparison

| | **A. Pinned horizontal scroll + inner-image parallax** | **B. Project list + cursor-following preview** ✅ |
|---|---|---|
| Feel | Cinematic, very "awwwards" | Editorial, typographic, fits the grotesk identity |
| How | Pin `#works`, translate a track by `-(scrollWidth - innerWidth)`, `containerAnimation` for inner `xPercent` parallax | Big rows (index, name, category, year). One floating preview (`quickTo` x/y with lag + rotation from velocity) swaps media via clip-path; `data-cursor="view"` |
| Mobile | Must fall back to vertical anyway | Falls back to the current stacked cards (already built) |
| Perf | 5 videos live inside a pinned track: heavy decoding and long pin spacer | One preview element, media loaded on hover intent |
| Content fit (5 projects, mixed video/image) | Needs equal-ratio high-res media for every slide | Works with what exists; videos play only in the preview |
| Risk | Pin interacts with sticky hero/services and Lenis; harder QA | Low; reuses the cursor system from Phase 2 |
| Bug 6 counter | Replaced by a progress bar | Keeps the giant index, now showing the **hovered** project number (01–05) |

**Recommendation: B.** It matches the brand better, costs less on performance, and degrades cleanly. It also gives
a natural entry point into the project pages and page transitions. A light version of A's parallax can still live
on the project detail page hero.

---

## C) New sections

All content goes in `src/data/*.ts` and is typed. Each section: SSR-renderable markup, motion added on top.

| # | Section | Design / motion | Libraries | Affected files | Cx | Perf risk | Branch |
|---|---|---|---|---|---|---|---|
| 1 | **Experience timeline** (3D Diagnostix: Frontend Intern · Ziken Labs · TEDxNewCairoSTEMYouth: Volunteer Developer) | Sticky **stacking cards** (same language as Services: `( 01 )` index, role, company, dates, 2–3 bullets, stack chips). Each card scales to 0.92 and dims as the next one covers it (`scrub`). Dark panel. Placed after About. Mobile: same stack, no scaling. | gsap | new `sections/Experience.tsx`, `data/experience.ts`, `app/page.tsx`, `lib/data.ts` (nav link) | M | Low | `feature/experience-timeline` |
| 2 | **Tech stack** | **Recommended: dual-direction infinite marquee** of logo + name chips (row 1 left, row 2 right) sharing the velocity engine. **Optional:** a CSS-3D rotating logo sphere (Fibonacci-sphere points with `transform: translate3d`, no WebGL, ~0 KB), desktop only, drag to rotate. | gsap; icons as local SVGs (no icon font) | new `sections/TechStack.tsx`, `data/stack.ts`, `public/logos/*` | M (sphere +M) | Low (sphere: Med) | `feature/tech-stack` |
| 3 | **Stats count-up** (projects · clients · years) | Three huge `heading-display` numbers with labels, counted from 0 by tweening a proxy object, `snap: 1`, `tabular-nums` so the width doesn't jump. Triggers once. Lives inside About or between Works and About. | gsap | new `sections/Stats.tsx`, `data/stats.ts` | S | Low | `feature/stats-countup` |
| 4 | **Process** (Discover → Design → Build → Launch) | Pinned section (`pin: true`, `end: '+=300%'`). A large step number and title swap with a mask reveal, a progress line fills, and a short description plus deliverables per step. Mobile/reduced: plain vertical list, no pin. | gsap | new `sections/Process.tsx`, `data/process.ts` | M | Med (pin) | `feature/process-pinned` |
| 5 | *Optional:* **Content** (programming channel) | 3–4 latest videos as cards using a **lite YouTube facade** (thumbnail + play; iframe only on click), hover tilt, link to the channel / TikTok / Instagram. Static data first, YouTube Data API later. | none (`lite-youtube-embed` optional) | new `sections/Content.tsx`, `data/content.ts` | S–M | Low (with facade) | `feature/content-section` |

**Proposed page order:** Hero → Services → Marquee → Works → About (+ Stats) → Experience → Tech stack → Process →
Testimonials → (Content) → Contact → Footer (reveal).

---

## D) Content (gathered 2026-10-19 from LinkedIn and the owner)

Source: owner's LinkedIn profile (read with permission). This feeds `src/data/experience.ts` and `src/data/stats.ts`
in Phase 4. Nothing here is in code yet.

**Headline:** Front-End Developer · Cairo, Egypt · top skills: Next.js, Front-End Development, Tailwind CSS,
JavaScript, Git.

### Experience (newest first)

| # | Role | Company | Dates | Mode | Highlights |
|---|---|---|---|---|---|
| 01 | Frontend Developer (Internship) | 3D\|Diagnostix | Jul 2026 – Present | Remote | Front-end coding and web application development |
| 02 | Information Technology Lead | TEDx New Cairo STEM Youth | Jan 2026 – Jul 2026 | Remote | Led the technical team and website work. Built the full-stack event platform (Next.js 15, React 19, TypeScript, PostgreSQL/Neon, Drizzle, Auth.js v5, Kashier payments, role-based access, admin dashboard, speaker/sponsor management, promo codes, Resend emails, Cloudinary). Honoured at the event. |
| 03 | Frontend Developer (Internship) | Huma-volve | Nov 2025 – Jan 2026 | Remote | Agile cross-functional team; responsive React UI components; turned UI/UX designs into interfaces; followed the design system; code reviews and stand-ups |
| (opt) | Space Environment & Space Weather Trainee | Egyptian Space Academy | Jan – Feb 2026 | On-site, Cairo | Applied Python and data analysis (GNSS/satellite impact) |
| (opt) | AI Tools for Workplace Productivity | Ta'heal (with IOM / Ministry of Youth & Sports) | Sep 2025 | On-site, Cairo | Generative AI tools for automation and content |
| (opt) | CIB Summer Internship 2026, Gen AI track | CIB | Summer 2026 | n/a | Mentioned in a LinkedIn post, not in the experience list |

Notes:
- The original brief listed **Ziken Labs**, but it is **not on LinkedIn**. Role, dates and highlights are still needed.
- The brief called TEDx "volunteer developer", but LinkedIn says **IT Lead**. The timeline uses IT Lead.

### Stats (proposed, owner to confirm)

| Stat | Value | Basis |
|---|---|---|
| Projects shipped | **5+** | five featured projects in Works |
| Years building | **2+** (since 2024) | earliest dated project (Cody/Storeit, 2024) |
| Internships / roles | **3** | 3D Diagnostix, TEDx, Huma-volve |
| Community | **1.2K** | LinkedIn followers (1,299) |
| Clients | **TBD** | not stated anywhere: owner to provide, or drop this stat |

### Settled
- Availability label: `NOV '26` in `src/config/site.ts` (`fix/availability-config`).
- Timezone/location: `Africa/Cairo`, Cairo, Egypt (`fix/personal-data`).
- Project media: captured from the live sites with permission (`fix/project-media-quality`).

### Still open
1. Ziken Labs details (role, dates, 2–3 highlights).
2. Client count, or confirm dropping it.
3. X profile URL (`xProfileUrl` in `src/lib/data.ts`; the icon renders without a link until it is set).
4. Your cal.com link, if you want booking.
5. Channel URL(s) for the optional Content section.
6. A cleaner Plumbing recording: `work1` has a "dideo.com" watermark baked in.

## E) Risks & guardrails

- **Sticky/pin interplay:** the hero (`mb-[-100svh]` sticky), Services' sticky cards, a pinned Process and the footer
  reveal all depend on layout height. Call `ScrollTrigger.refresh()` after fonts/images load, and avoid nested pins.
- **Lenis + pins:** use one Lenis on the window; no `ScrollTrigger.scrollerProxy` needed.
- **Bundle:** watch `next build` output. OGL and the optional three.js only load through dynamic imports.
- **Accessibility:** split text keeps an `aria-label`; the cursor is decorative; all motion respects `prefers-reduced-motion`.
- **Samsung Internet** already has a special modal: include it in cross-browser QA.
