'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { MyName, Star } from '@/components/design';
import { Button } from '@/components/common/Button';
import { SplitText } from '@/components/SplitText';
import { getAvailableForWorkDate } from '@/lib/functions';

export function Hero() {
  const [availableDate, setAvailableDate] = useState('');

  useEffect(() => {
    setAvailableDate(getAvailableForWorkDate());
  }, []);

  return (
    <section className="padding-x! mb-[-100svh] py-0 ">
      <div
        id="hero"
        className="sticky top-0 flex min-h-svh w-full items-end pb-[clamp(2.25rem,2.1786rem_+_0.3571vi,2.5rem)]"
      >
        <div className="relative flex w-full flex-col items-center">
          <div className="w-full items-end overflow-clip">
            <div className="flex w-full items-start gap-14">
              <MyName />
              <Star id="star" className="hide-on-mobile! translate-x-full" />
            </div>
          </div>

          <div className="lg:column-gap! spacing-t! grid w-full grid-cols-12">
            <div className="col-span-full flex flex-col items-start gap-14 sm:col-span-4">
              <div className="overflow-hidden">
                <svg
                  id="down-arrow"
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="1.25"
                  viewBox="6 6 12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="hide-on-mobile! m-0 size-4 -translate-x-full p-0 md:size-6"
                  color="#8C8C73"
                  style={{ color: '#8c8c73' }}
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="7" y1="7" x2="17" y2="17" />
                  <polyline points="17 7 17 17 7 17" />
                </svg>
              </div>

              <p className="sr-only ">
                A freelance full-stack developer, cutting-edge technologies to
                deliver comprehensive solutions for your business.
              </p>
              <SplitText
                id="whoAmI"
                text="A freelance full-stack developer, cutting-edge technologies to deliver comprehensive solutions for your business."
                className="who-am-i heading-5 w-full tracking-wide  max-w-[30ch] overflow-clip leading-snug! font-medium text-balance sm:max-w-[37ch] lg:text-start"
              />

              <div className="relative origin-left overflow-hidden sm:scale-150">
                <div id="contact-btn" className="flex -translate-y-full">
                  <Button label="Get in touch" url="https://wa.me/+201036566152" />
                </div>
              </div>
            </div>

            <div
              id="profile-container"
              className="relative col-span-4 mt-10 h-[20vh] max-w-lg flex-col rounded-lg select-none sm:mt-0 sm:h-full md:flex md:h-[50vh]"
            >
              <div className="overlay bg-flax-smoke-50 absolute inset-0 z-2" />
              <Image
                id="profile-img"
                src="/images/profile.png"
                alt="Rashad Hussein profile"
                width={800}
                height={1000}
                className="size-full scale-90 rounded-lg object-cover object-top brightness-110 grayscale"
                priority
              />
            </div>

            <div className="relative col-span-8 size-full overflow-clip text-end sm:col-span-4">
              <div
                id="available-for-work"
                className="absolute right-0 bottom-0 flex translate-y-full flex-col items-end"
              >
                <p className="3xl:text-base block leading-snug font-medium -tracking-tight uppercase">
                  Available for freelance work
                </p>
                <h3 className="3xl:heading-1 heading-1-alt font-fancy! block leading-none font-bold -tracking-tight">
                  {availableDate}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-svh" />
    </section>
  );
}
