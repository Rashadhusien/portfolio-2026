'use client';

import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { SplitText } from '@/components/SplitText';
import { animateSplitText } from '@/lib/animations';
import { useWindowSize } from '@/hooks/useWindowSize';

const selectedWorksProps = [
  {
    name: 'Event Management System',
    category: 'Frontend & Backend',
    tags: ['Next.js', 'PostgreSQL', 'shadcn/ui', 'tedx'],
    mockup: '/images/work/event-management-system.webp',
    poster: '/images/work/event-management-system-screen.webp',
    videos: ['/videos/work4.webm', '/videos/work4.mp4'],
    url: 'https://www.tedxnewcairostemyouth.org/',
    year: '2026',
  },
  {
    name: 'Plumbing Services',
    category: 'Frontend',
    tags: ['wordpress', 'woocommerce', 'elementor'],
    mockup: '/images/work/plumbing-services.webp',
    poster: '/images/work/plumbing-services-screen.webp',
    videos: ['/videos/work1.webm', '/videos/work1.mp4'],
    url: 'https://linkdesign.site/',
    year: '2025',
  },
  {
    name: 'Cody',
    category: 'Full Stack & Animation & LMS',
    tags: ['Next.js', 'Animation', 'SQL', 'shadcn/ui'],
    mockup: '/images/work/cody.webp',
    poster: '/images/work/cody-screen.webp',
    videos: ['/videos/work2.webm', '/videos/work2.mp4'],
    url: 'https://cody-nine-iota.vercel.app/',
    year: '2024',
  },
  {
    name: 'Storeit',
    category: 'Full Stack & Documentation & Storage',
    tags: ['Next.js', 'Tailwind', 'AI'],
    mockup: '/images/work/storeit.webp',
    poster: '/images/work/storeit-screen.webp',
    videos: ['/videos/work3.webm', '/videos/work3.mp4'],
    url: 'https://storage-managment-indol.vercel.app/',
    year: '2024',
  },
  {
    name: 'Full-Stack Content Platform',
    category: 'Full Stack & Content Management',
    tags: ['Next.js', 'PostgreSQL', 'shadcn/ui', 'gsap'],
    mockup: '/images/work/content-platform.webp',
    poster: '/images/work/content-platform-screen.webp',
    videos: ['/videos/work5.mp4'],
    url: 'https://portfolio-arwa.vercel.app/',
    year: '2025',
  },
];

export function Works() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const indexReelRef = useRef<HTMLSpanElement>(null);
  const { width } = useWindowSize();
  const isSmallScreen = width < 768;

  // Slides the 01…0N reel to the project in view. overwrite keeps fast scrolling
  // from stacking tweens (which used to leave the number pushed out of view).
  const showIndex = (i: number) => {
    gsap.to(indexReelRef.current, {
      yPercent: (-100 * i) / selectedWorksProps.length,
      duration: 0.5,
      ease: 'power4.out',
      overwrite: 'auto',
    });
  };


  useGSAP(() => {
    animateSplitText(
      '#selectedWorks .letters',
      '#selected-works-text',
      0.7,
      0.01,
      0,
    );

    if (!isSmallScreen) {
      gsap.utils.toArray<Element>('.work-card').forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => {
            if (self.isActive) showIndex(i);
          },
        });
      });
    }
  }, [isSmallScreen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.25 },
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="works" className="common-padding! mb-20">
      <div className="flex flex-col">
        <SplitText
          id="selectedWorks"
          text="Selected Works / "
          isFancyFont
          className="heading-1 text-start leading-none font-bold uppercase"
        />
        <p className="heading-1 text-flax-smoke-400 text-opacity-50 hidden w-4/5 text-end font-extrabold sm:block">
          ( {selectedWorksProps.length} )
        </p>

        <div
          id="selected-works-text"
          className="md:column-gap! text-flax-smoke-300 mt-[5%] grid grid-cols-12 justify-end opacity-0 lg:grid"
        >
          <p className="heading-6 text-flax-smoke-300/85 col-span-4 text-center text-nowrap lg:col-start-2">
            (
            <span className="inline sm:hidden">{selectedWorksProps.length} </span>
            PROJECTS )
          </p>
          <p className="heading-4 font-fancy! col-span-8 w-full text-balance sm:font-semibold lg:col-span-7">
            Featured client projects that have been meticulously crafted with
            passion and purpose over the years.
          </p>
        </div>
      </div>

      <div className="sm:column-gap! relative mt-12 grid size-full grid-cols-12 lg:mt-[10%]">
        <div className="text-flax-smoke-100 sticky top-12 col-span-5 hidden h-fit w-full overflow-hidden text-[22vw] leading-[0.8] font-semibold md:flex">
          <span className="relative block h-[0.8em] overflow-hidden">
            <span ref={indexReelRef} className="flex flex-col will-change-transform">
              {selectedWorksProps.map((work, i) => (
                <span key={work.name} className="font-title! block h-[0.8em] -tracking-wider">
                  {String(i + 1).padStart(2, '0')}.
                </span>
              ))}
            </span>
          </span>
        </div>
        <aside
          className="relative col-span-full flex flex-col space-y-10 md:col-span-7"
        >
          {selectedWorksProps.map((work, i) => (
            <div key={work.name} className="work-card @container">
              <a className="group" data-cursor="view" target="_blank" rel="noopener noreferrer" href={work.url}>
                <div className="bg-flax-smoke-950 relative aspect-square overflow-clip rounded-lg">
                  <Image
                    alt={`${work.name} website mockup`}
                    src={work.mockup}
                    fill
                    sizes="(min-width: 768px) 58vw, 100vw"
                    quality={90}
                    className="object-cover select-none"
                  />
                  {/* Sits exactly over the mockup's browser screen (see the mockup generator). */}
                  <video
                    ref={(el) => {
                      videoRefs.current[i] = el;
                    }}
                    poster={work.poster}
                    muted
                    loop
                    playsInline
                    preload="none"
                    aria-hidden="true"
                    className="absolute top-[30.5%] left-[7%] h-[41.958%] w-[86%] object-cover object-top"
                  >
                    {work.videos.map((src) => (
                      <source
                        key={src}
                        src={src}
                        type={src.endsWith('.webm') ? 'video/webm' : 'video/mp4'}
                      />
                    ))}
                  </video>
                </div>
                <div>
                  <p className="heading-6 font-title! mt-[2%] mb-[1%] leading-none">
                    {work.category}
                  </p>
                  <div className="flex flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:justify-between">
                    <h3 className="heading-3 font-title! min-w-0 font-bold text-balance uppercase">{work.name}</h3>
                    <div className="flex shrink-0 flex-wrap gap-1.5 select-none 2xl:max-w-[50%] 2xl:justify-end">
                      {work.tags.map((tag) => (
                        <p
                          key={tag}
                          className="border-flax-smoke-300 hover:bg-flax-smoke-300 hover:text-flax-smoke-900 rounded-full border px-4 py-2 whitespace-nowrap transition-[background-color,color] duration-500 ease-in-out"
                        >
                          <span>{tag}</span>
                        </p>
                      ))}
                      <p className="border-flax-smoke-300 bg-flax-smoke-300 text-flax-smoke-900 hover:text-flax-smoke-300 rounded-full border px-4 py-2 whitespace-nowrap transition-[background-color,color] duration-500 ease-in-out hover:bg-transparent">
                        <span>{work.year}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}