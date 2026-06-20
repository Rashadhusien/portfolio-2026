'use client';

import { Footer } from '@/components/design/Footer';
import { Marquee } from '@/components/design/Marquee';
import { AboutMe } from '@/components/sections/AboutMe';
import { Contact } from '@/components/sections/Contact';
import { Hero } from '@/components/sections/Hero';
import { People } from '@/components/sections/People';
import { Services } from '@/components/sections/Services';
import { Works } from '@/components/sections/Works';

export default function Home() {
  return (
    <div id="app" className="relative min-h-full">
      <main className="relative min-h-full">
        <Hero />
        <div className="text-flax-smoke-200 relative rounded-t-3xl bg-[#0B0B0A] py-[5%]!">
          <Services />
          <Marquee />
          <Works />
        </div>
        <AboutMe />
        <People />
        <Contact />

      </main>
      <Footer />
    </div>
  );
}
