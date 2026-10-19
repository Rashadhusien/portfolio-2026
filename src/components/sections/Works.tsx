'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from '@/components/SplitText';
import { animateSplitText } from '@/lib/animations';
import { useWindowSize } from '@/hooks/useWindowSize';

const selectedWorksProps = [
  {
    name: 'Event Management System',
    category: 'Frontend & Backend',
    tags: ['Next.js', 'PostgreSQL', 'shadcn/ui', 'tedx'],
    videoSrc: '/videos/work4.webm',
    imageBg: '/images/4.webp',
    url: 'https://www.tedxnewcairostemyouth.org/',
    year: '2026',
  },
  {
    name: 'Plumbing Services',
    category: 'Frontend',
    tags: ['wordpress', 'woocommerce', 'elementor'],
    videoSrc: '/videos/work1.mp4',
    imageBg: '/images/5.webp',
    url: 'https://linkdesign.site/',
    year: '2025',
  },
  {
    name: 'Cody',
    category: 'Full Stack & Animation & LMS',
    tags: ['Next.js', 'Animation', 'SQL', 'shadcn/ui'],
    videoSrc: '/videos/work2.mp4',
    imageBg: '/images/2.webp',
    url: 'https://cody-nine-iota.vercel.app/',
    year: '2024',
  },
  {
    name: 'Storeit',
    category: 'Full Stack & Documentation & Storage',
    tags: ['Next.js', 'Tailwind', 'AI'],
    videoSrc: '/videos/work3.mp4',
    imageBg: '/images/3.webp',
    url: 'https://storage-managment-indol.vercel.app/',
    year: '2024',
  },
  {
    name: 'Full-Stack Content Platform',
    category: 'Full Stack & Content Management',
    tags: ['Next.js', 'PostgreSQL', 'shadcn/ui', 'gsap'],
    videoSrc: '/videos/work5.mp4',
    imageBg: '/images/5.webp',
    url: 'https://portfolio-arwa.vercel.app/',
    year: '2025',
  },
];

export function Works() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const indexReelRef = useRef<HTMLSpanElement>(null);
  const { width } = useWindowSize();
  const isSmallScreen = width < 768;

  const cursorTl = useRef<gsap.core.Timeline | null>(null);

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
    const cursor = document.getElementById('cursor');
    const inner = document.getElementById('inner');
    if (!cursor || !inner) return;

    cursorTl.current = gsap
      .timeline({ defaults: { duration: 0.25 } })
      .to(['#cursor', '#inner'], { scale: 1, opacity: 1 })
      .paused(true);
  }, []);

  const showCursor = () => cursorTl.current?.play();
  const hideCursor = () => cursorTl.current?.reverse();

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
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) {
          video.play();
          video.classList.remove('blur');
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.75,
    });

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
          onMouseEnter={showCursor}
          onMouseLeave={hideCursor}
          className="relative col-span-full flex flex-col space-y-10 md:col-span-7"
        >
          {selectedWorksProps.map((work, i) => (
            <div key={work.name} className="work-card @container">
              <a className="group" target="_blank" rel="noopener noreferrer" href={work.url}>
                <div className="flex-center relative aspect-square overflow-clip rounded-lg">
                  <Image
                    alt="work-background"
                    src={work.imageBg}
                    width={800}
                    height={800}
                    className="absolute size-full object-cover select-none"
                  />
                  <div className="flex-center z-10 aspect-4/3 size-full overflow-clip rounded-lg object-cover">
                    <video
                      ref={(el) => { videoRefs.current[i] = el; }}
                      src={work.videoSrc}
                      muted
                      className="size-[80%] rounded-md object-contain blur transition-all duration-500 ease-in-out"
                    />
                  </div>
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