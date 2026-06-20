'use client';

import { useGSAP } from '@gsap/react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/common/Button';
import { Link } from '@/components/common/Link';
import { SplitText } from '@/components/SplitText';
import { animateSplitText } from '@/lib/animations';
import earthLottie from '@/data/earth.json';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export function Contact() {
  useGSAP(() => {
    animateSplitText(
      '#make-it-happen .letters',
      '#make-it-happen',
      1.5,
      0.01,
      0,
    );
  });

  return (
    <section
      id="contact-section"
      className="relative min-h-svh w-full overflow-y-clip p-[4vh] select-none"
    >
      <div className="flex-center relative h-[92vh] w-full flex-col rounded-lg bg-black uppercase">
        <video
          className="absolute bottom-0 left-0 size-full rounded-lg object-cover object-bottom brightness-50"
          src="/videos/contact.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="flex-center z-10 flex-col gap-y-10">
          <p className="heading-4 text-flax-smoke-300 max-w-[30ch] text-center font-mono">
            Your design is a masterpiece waiting to become alive.
          </p>
          <SplitText
            id="make-it-happen"
            text="Let's Make it happen"
            className="heading-1 text-flax-smoke-200 max-w-[10ch] text-center leading-none"
          />
          <div className="mt-[5%] flex scale-150 items-center lg:scale-[1.5] xl:scale-[3] 2xl:scale-[3.5]">
            <Button label="Get in touch" url="https://wa.me/01036566152" />
          </div>
        </div>
        <div className="absolute bottom-5 flex w-full items-center justify-center px-5 md:justify-between">
          <div className="hidden md:flex">
            <div className="border-flax-smoke-300 relative border">
              <Lottie
                animationData={earthLottie}
                loop
                autoplay
                className="lottie-animation-container"
              />
            </div>
            <div className="flex-center py border-flax-smoke-300 text-flax-smoke-300 w-fit flex-col border border-l-0 font-mono">
              <p className="border-flax-smoke-300 flex size-full items-center justify-start border-b pr-2 pl-1 font-bold">
                Working Globally
              </p>
              <p className="flex size-full items-center justify-start pr-2 pl-1">
                Available Sep &apos;24
              </p>
            </div>
          </div>

          <div className="heading-6 text-flax-smoke-500 w-fit">
            <p className="w-full font-bold uppercase">For further inquiries</p>
            <Link
              className="text-flax-smoke-300 h-6 text-right font-medium tracking-wider lowercase"
              label="rashadelrifai@gmail.com"
              icon
              url="mailto:rashadelrifai@gmail.com"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
