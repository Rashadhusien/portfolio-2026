import { Fragment } from 'react';
import {
  getCharClassName,
  getWordWrapperClassName,
  splitTextIntoChars,
} from '@/lib/functions';

type SplitTextProps = {
  text: string;
  isFancyFont?: boolean;
  isNewLine?: boolean;
  className?: string;
  id?: string;
};

/**
 * Renders text as word > letter spans for reveal animations (`.letters`).
 * A real space is kept between words so copy/paste and layout behave like normal
 * text; screen readers get the sentence once from the visually hidden copy.
 */
export function SplitText({
  text,
  isFancyFont = false,
  isNewLine = false,
  className,
  id,
}: SplitTextProps) {
  const words = splitTextIntoChars(text);
  const charClass = getCharClassName(isFancyFont);
  const wordClass = getWordWrapperClassName(isNewLine);

  return (
    <p id={id} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wordIndex) => (
          <Fragment key={wordIndex}>
            {wordIndex > 0 && ' '}
            <span className={wordClass}>
              {word.map((char, charIndex) => (
                <span key={charIndex} className={charClass}>
                  {char}
                </span>
              ))}
            </span>
          </Fragment>
        ))}
      </span>
    </p>
  );
}
