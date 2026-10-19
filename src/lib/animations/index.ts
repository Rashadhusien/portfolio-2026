import { gsap } from '@/lib/gsap';
import { setScrollLocked } from '@/lib/lenis-store';

const displayNone = (id: string) => {
  gsap.set(id, { display: 'none' });
  setScrollLocked(false);
};
const samsungErrorModal = (show: boolean = false) => {
  if (show) {
    gsap.to('#samsung-error-modal', {
      opacity: 1,
      delay: 1.5,
      duration: 1,
      ease: 'power4.inOut',
      onComplete: () => {
        gsap.to('#samsung-error-modal', {
          opacity: 0,
          delay: 12,
          duration: 1,
          ease: 'power4.inOut',
          onComplete: () => {
            displayNone('#samsung-error-modal');
          },
        });
      },
    });
  }
};

const animateSplitText = (
  id: string | string[],
  textId: string,
  duration: number = 0.8,
  stagger: number = 0.005,
  delay: number = 0,
  onStartFn: () => void = () => {},
) => {
  gsap.to(id, {
    onStart: () => {
      fadeIn(textId, 100, 2);
      onStartFn();
    },

    scrollTrigger: {
      trigger: id,
      toggleActions: 'play none none reverse',
      start: 'top bottom',
    },
    delay: delay,
    duration: duration,
    y: 0,
    autoAlpha: 1,
    stagger: stagger,
    ease: 'power4.inOut',
  });
};
const navbarScale = (selector: string, trigger: string) => {
  gsap.to(selector, {
    scrollTrigger: {
      trigger: trigger,
      start: 'bottom center',
      toggleActions: 'play none none reverse',
    },
    duration: 0.6,
    scale: 1,
    ease: 'power1',
  });
};

const yToZero = (id: string) => {
  gsap.to(id, {
    y: 0,
    duration: 0.4,
    ease: 'power1.inOut',
    stagger: 0.1,
  });
};

const xToZero = (id: string) => {
  gsap.to(id, {
    x: 0,
    duration: 0.4,
    ease: 'power1.inOut',
    stagger: 0.1,
    scrollTrigger: {
      trigger: id,
      toggleActions: 'play none none reverse',
    },
  });
};

const yReset = (id: string) => {
  gsap.set(id, {
    y: '100%',
  });
};

const fadeIn = (id: string, opacity: number = 1, duration: number = 0.5) => {
  gsap.to(id, {
    opacity: opacity,
    duration: duration,
    ease: 'power4.inOut',
    scrollTrigger: {
      trigger: id,
      toggleActions: 'play none none reverse',
    },
    stagger: 0.1,
  });
};

const resetOpacity = (id: string, opacity: number = 0) => {
  gsap.set(id, {
    opacity: opacity,
  });
};

const navbarEnter = (id: string) => {
  gsap.to(id, {
    x: '0%',
    opacity: 1,
    duration: 0.7,
  });
};

const navbarLeave = (id: string) => {
  const x = '100%';
  gsap.to(id, {
    opacity: 0,
    onComplete: () => {
      gsap.set(id, {
        x: x,
      });
    },
  });
};

const animateNavbarEnter = (
  navbarSelector: string,
  navbarLinksSelector: string,
  contactSelector: string,
) => {
  navbarEnter(navbarSelector);
  yToZero(navbarLinksSelector);
  fadeIn(contactSelector);
};

const animateNavbarLeave = (
  navbarSelector: string,
  navbarLinksSelector: string,
  contactSelector: string,
) => {
  navbarLeave(navbarSelector);
  yReset(navbarLinksSelector);
  resetOpacity(contactSelector);
};

/**
 * Hero entrance, played as the preloader curtain lifts: header slides in, the name
 * rises letter by letter, then portrait, subtitle and CTA. `instant` (reduced motion)
 * jumps to the end state and skips the scroll-linked hero fade.
 */
const animateHeroIntro = (instant = false) => {
  // Near-zero rather than 0: zero-duration tweens of the CSS variable below don't apply.
  const d = instant ? 0.001 : 1;
  const tl = gsap.timeline({ defaults: { ease: 'expo', duration: 1.4 * d } });

  // Name letters are hidden by Tailwind's `translate-y-full` (CSS `translate`). GSAP's
  // SVG transform handling mis-reads that, so tween Tailwind's variable directly.
  tl.to('header', { y: 0 }, 0)
    .to('#svg-my-en-name g path', { '--tw-translate-y': '0%', stagger: 0.07 * d, duration: 1.3 * d }, 0.1 * d)
    .to('#star', { x: 1 }, 0.35 * d)
    .to('.overlay', { yPercent: 100, onComplete: () => gsap.set('.overlay', { display: 'none' }) }, 0.3 * d)
    .to('#profile-img', { scale: 1 }, 0.4 * d)
    .to(['#down-arrow', '#contact-btn', '#available-for-work'], { x: 0, y: 0, stagger: 0.08 * d }, 0.5 * d);

  animateSplitText('#whoAmI .letters', '#whoAmI .letters', 1.5 * d, 0.005 * d, 0.5 * d);

  if (!instant) {
    gsap.to('#hero', {
      scrollTrigger: { trigger: '#hero', start: 'top top', scrub: 1 },
      opacity: 0.5,
      scale: 0.9,
      translateZ: 0,
    });
  }

  return tl;
};

const animateAboutMeSectionLeave = (id: string) => {
  gsap.to(id, {
    yPercent: -10,
    scale: 0.95,
    ease: 'power1',
    scrollTrigger: {
      trigger: id,
      start: '75% bottom',
      scrub: 1,
    },
  });
};

export {
  displayNone,
  xToZero,
  navbarScale,
  animateNavbarEnter,
  animateNavbarLeave,
  animateHeroIntro,
  samsungErrorModal,
  animateSplitText,
  animateAboutMeSectionLeave,
};
