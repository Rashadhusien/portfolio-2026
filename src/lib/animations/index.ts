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

const animateLoadingPath = (
  path: SVGPathElement,
  targetPath: string,
  isSamsung: boolean,
) => {
  const tl = gsap.timeline({});
  tl.to('#loading-screen', {
    delay: 3,
    bottom: '100%',
    duration: 1,
    ease: 'power2.inOut',
    onStart: () => {
      setTimeout(() => {
        animateHeroNav();
        samsungErrorModal(isSamsung);
        // Samsung Internet stays locked until its notice is dismissed (displayNone).
        setScrollLocked(isSamsung);
        window.scrollTo(0, 0);
      }, 120);
    },
  });

  tl.to(
    path,
    {
      duration: 1,
      attr: { d: targetPath },
      ease: 'power2.inOut',
      onComplete: () => {
        gsap.set('#loading-screen', { display: 'none' });
      },
    },
    '<20%',
  );
};

const animateLoadingTextContainer = () => {
  gsap.fromTo(
    '#text',
    1,
    {
      yoyo: true,
      opacity: 0,
    },
    {
      opacity: 1,
      ease: 'circ.inOut',
    },
  );
};

const animateLoadingText = (id: string) => {
  gsap.to(id, {
    y: 0,
    duration: 1,
    ease: 'power2.inOut',
    delay: 0.5,
    stagger: 0.1,
    onComplete: () => {
      gsap.to(id, {
        delay: 1.2,
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.set(id, {
            y: '100%',
            opacity: 100,
          });
        },
      });
    },
  });
};

const animateHeroNav = () => {
  gsap.to('header', {
    y: 0,
    duration: 1.5,
    ease: 'power4.inOut',
  });

  gsap.to('#svg-my-en-name g path', {
    y: 0,
    delay: 0.2,
    duration: 1.5,
    ease: 'power4.inOut',
    stagger: 0.01,
  });

  gsap.to('#star', {
    x: 1,
    delay: 0.2,
    duration: 1.5,
    ease: 'power4.inOut',
  });

  gsap.to('.overlay', {
    y: '100%',
    delay: 0.2,
    duration: 1.5,
    ease: 'power4.inOut',
    onComplete: () => {
      gsap.set('.overlay', { display: 'none' });
    },
  });

  gsap.to('#profile-img', {
    scale: 1,
    delay: 0.4,
    duration: 1.5,
    ease: 'power4.inOut',
  });

  gsap.to(['#down-arrow', '#contact-btn', '#available-for-work'], {
    x: 0,
    y: 0,
    delay: 0.4,
    duration: 1.5,
    ease: 'power4.inOut',
  });

  animateSplitText('#whoAmI .letters', '#whoAmI .letters', 1.5, 0.005, 0.4);

  gsap.to('#hero', {
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      scrub: 1,
    },
    opacity: 0.5,
    scale: 0.9,
    translateZ: 0,
  });

  gsap.to('.hero-social-link', {
    opacity: 1,
    delay: 0.4,
    duration: 1.5,
    ease: 'power4.inOut',
  });
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
  animateLoadingPath,
  animateLoadingText,
  animateLoadingTextContainer,
  animateHeroNav,
  animateSplitText,
  animateAboutMeSectionLeave,
};
