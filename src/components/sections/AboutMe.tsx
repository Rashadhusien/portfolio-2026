'use client';

import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import { SplitText } from '@/components/SplitText';
import {
  animateAboutMeSectionLeave,
  animateSplitText,
  xToZero,
} from '@/lib/animations';

export function AboutMe() {
  useGSAP(() => {
    animateSplitText(
      '#little-bit-about-me .letters',
      '#little-bit-about-me',
      1,
      0.01,
      0,
      () => {
        xToZero('#down-arrow-2');
      },
    );
    animateAboutMeSectionLeave('#about-me-section');
  });

  return (
    <section
      id="about-me-section"
      className="common-padding! text-flax-smoke-200 relative z-10 overflow-y-clip rounded-b-3xl bg-[#0B0B0A] shadow-2xl will-change-auto sm:mt-0"
    >
      <div className="md:column-gap! grid grid-cols-12">
        <div className="hide-on-mobile! overflow-hidden md:col-span-4">
          <svg
            id="down-arrow-2"
            stroke="currentColor"
            fill="none"
            strokeWidth="1.25"
            viewBox="6 6 12 12"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="hide-on-mobile! m-0 size-20 -translate-x-full p-0"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="7" y1="7" x2="17" y2="17" />
            <polyline points="17 7 17 17 7 17" />
          </svg>
        </div>

        <SplitText
          id="little-bit-about-me"
          text="Programmer, Developer, Web-animator/"
          isFancyFont
          isNewLine
          className="heading-1-alt lg:heading-1 section-heading col-span-full leading-none font-extrabold uppercase md:col-span-8 md:col-start-6"
        />
      </div>

      <div className="padding-y! md:column-gap! mt-6 grid grid-cols-12">
        <div className="pointer-events-none col-span-full content-end rounded-lg select-none md:col-span-4">
          <Image
            src="/images/profile2.jpg"
            alt="Headshot of Ebraheem facing a camera"
            width={600}
            height={900}
            className="aspect-[1/1.5] rounded-lg object-cover object-top mix-blend-screen brightness-90 grayscale"
          />
        </div>
        <div className="col-span-11 mt-10 md:col-span-8 md:col-start-6">
          <p className="heading-4 relative w-full max-w-[40ch] leading-snug font-medium text-balance">
            With a passion for design and development, I take projects from
            ideation to launch, ensuring a seamless journey that leaves a lasting
            positive impact on the digital landscape and your business.
          </p>

          <div className="text-flax-smoke-300 mt-[5%] flex justify-start gap-10 sm:gap-20">
            <p className="heading-6 text-flax-smoke-300/85 text-center text-nowrap">
              ( ABOUT ME )
            </p>
            <p className="heading-6 font-fancy! w-full text-balance sm:max-w-[40ch]">
              Creating great web experiences is my primary focus. I ensure each
              project leaves users with a feel-good sensation through meticulous
              attention to detail and user-centric design principles. <br /><br />
              When I&apos;m not immersed in web development and design, you can find me
              sharing insights about my freelance journey on <i>&Xopf;</i>,
              loudly, playing music (Funk), or just relaxing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
