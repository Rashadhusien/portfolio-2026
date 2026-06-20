import { getLenis } from '@/lib/lenis-store';

export function splitTextIntoChars(
  text: string,
  isFancyFont = false,
  isNewLine = false,
): string[][] {
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

export function getWordWrapperClassName(isNewLine: boolean): string {
  let result = 'text-nowrap! overflow-clip ';
  if (isNewLine) {
    result += ' leading-base! block ';
  } else {
    result += ' inline-block ';
  }
  return result;
}

const getAvailableForWorkDate = () => {
  const date = new Date();

  const year = date.getFullYear().toString().slice(-2);
  const monthNames = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];
  let index = date.getMonth();

  const month = monthNames[index];

  return `${month} '${year}`;
};

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

export { getAvailableForWorkDate, gotoSection };
