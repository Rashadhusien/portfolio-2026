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
  isSpace?: boolean;
  id?: string;
};

export function SplitText({
  text,
  isFancyFont = false,
  isNewLine = false,
  className,
  isSpace = false,
  id,
}: SplitTextProps) {
  const words = splitTextIntoChars(text, isFancyFont, isNewLine);
  const charClass = getCharClassName(isFancyFont);
  const wordClass = getWordWrapperClassName(isNewLine , isSpace);

  return (
    <p id={id} className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className={wordClass }>
          {word.map((char, charIndex) => (
            <span key={charIndex} className={charClass}>{char}</span>
          ))}
        </span>
      ))}
      {' '}
    </p>
  );
}
