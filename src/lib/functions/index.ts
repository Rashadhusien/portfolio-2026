import { scrollToTarget } from '@/lib/lenis-store';

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

export function getWordWrapperClassName(isNewLine: boolean): string {
  let result = 'overflow-clip ';

  if (isNewLine) {
    result += 'leading-base! block ';
  } else {
    result += 'inline-block ';
  }

  return result;
}
const gotoSection = (url: string) => {
  scrollToTarget(url === '#testimonials-section' ? '#slider' : url);
};

export { gotoSection };
