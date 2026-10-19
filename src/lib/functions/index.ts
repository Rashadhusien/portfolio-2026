import { getLenis } from '@/lib/lenis-store';

export function splitTextIntoChars(text: string): string[][] {
  return text.split(' ').map((word) => word.split(''));
}

export function getCharClassName(isFancyFont: boolean): string {
  let classes =
    'letters translate-y-[120%] inline-block will-change-auto will-change-transform ';
  if (isFancyFont) {
    classes += ' font-fancy! ';
  }
  return classes;
}

export function getWordWrapperClassName(isNewLine: boolean , isSpace?:boolean): string {
  let result = 'overflow-clip ';

  if (isSpace) {
    result += 'mr-[0.25em] '
  }

  if (isNewLine) {
    result += 'leading-base! block ';
  } else {
    result += 'inline-block ';
  }

  return result;
}
const gotoSection = (url: string) => {
  const lenis = getLenis();
  if (!lenis) return;
  lenis.start();
  if (url === '#testimonials-section') {
    lenis.scrollTo('#slider', { duration: 3 });
    return;
  }
  lenis.scrollTo(url, { duration: 3 });
};

export { gotoSection };
