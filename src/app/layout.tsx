import type { Metadata } from 'next';
import { LenisProvider } from '@/components/providers/LenisProvider';
import { AppShell } from '@/components/AppShell';
import './globals.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL('https://hetari.github.io/portfolio'),
  title: 'Rashad Hussein - Full-Stack Developer',
  description:
    'Rashad Hussein - A freelance who is experienced in full-Stack Developer helping startups all around the world gain their unfair advantage',
  keywords: [
    'full-stack developer',
    'frontend developer',
    'backend developer',
    'freelance creative developer',
    'freelance',
    'web developer',
    'portfolio',
    'ebraheem alhetari',
    'رشاد حسين',
    'software engineer',
    'hetari',
  ],
  authors: [{ name: 'Rashad Hussein' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Rashad Hussein - Full-Stack Developer',
    description:
      'Rashad Hussein - A freelance who is experienced in full-Stack Developer helping startups all around the world gain their unfair advantage',
    url: 'https://hetari.github.io/portfolio/',
    siteName: 'Rashad Hussein — Freelance Web Developer',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og-pic.webp', width: 1100, height: 1000 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rashad Hussein - Full-Stack Developer',
    description:
      'Rashad Hussein - A freelance who is experienced in full-Stack Developer helping startups all around the world gain their unfair advantage',
    images: ['/og-pic.webp'],
  },
  alternates: {
    canonical: 'https://hetari.github.io/portfolio/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap"
          as="style"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap"
        />
        <meta name="color-scheme" content="light" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body>
        <LenisProvider>
          <AppShell>{children}</AppShell>
        </LenisProvider>
      </body>
    </html>
  );
}
