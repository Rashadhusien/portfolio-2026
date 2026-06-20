'use client';

import { gotoSection } from '@/lib/functions';

type ButtonProps = {
  label: string;
  url?: string;
  onClick?: () => void;
  className?: string;
};

export function Button({ label, url, onClick, className }: ButtonProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    if (url?.startsWith('#')) {
      gotoSection(url);
    }
  };

  const sharedClass =
    'leading-base group pointer-events-auto relative h-full max-w-full transform-none overflow-clip rounded-full bg-flax-smoke-950 px-5 py-2 text-[1rem] font-semibold uppercase tracking-normal text-flax-smoke-100 sm:text-sm ease-expo';

  if (url && !url.startsWith('#')) {
    return (
      <a
        id="button"
        href={url}
        className={`${sharedClass} ${className ?? ''}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="ease-expo flex-center absolute bottom-0 left-0 z-10 my-auto size-full w-full will-change-auto translate-y-full text-nowrap rounded-t-[15rem] bg-flax-smoke-500 font-fancy! transition-all duration-700 group-hover:translate-y-0 group-hover:rounded-none">
          {label}
        </span>
        <span className="after:ease-expo flex-center relative z-20 overflow-hidden transition-all after:absolute after:left-0 after:inline-block after:will-change-auto after:translate-y-0 after:text-flax-smoke-200 after:transition-all after:duration-700 after:content-[attr(after)] group-hover:after:-translate-y-[100%]">
          <span className="ease-expo text-nowrap font-fancy! transition-all duration-700 group-hover:-translate-y-full">
            {label}
          </span>
        </span>
      </a>
    );
  }

  return (
    <button
      id="button"
      type="button"
      onClick={handleClick}
      className={`${sharedClass} ${className ?? ''}`}
    >
      <span className="ease-expo flex-center absolute bottom-0 left-0 z-10 my-auto size-full w-full will-change-auto translate-y-full text-nowrap rounded-t-[15rem] bg-flax-smoke-500 font-fancy! transition-all duration-700 group-hover:translate-y-0 group-hover:rounded-none">
        {label}
      </span>
      <span className="after:ease-expo flex-center relative z-20 overflow-hidden transition-all after:absolute after:left-0 after:inline-block after:will-change-auto after:translate-y-0 after:text-flax-smoke-200 after:transition-all after:duration-700 after:content-[attr(after)] group-hover:after:-translate-y-[100%]">
        <span className="ease-expo text-nowrap font-fancy! transition-all duration-700 group-hover:-translate-y-full">
          {label}
        </span>
      </span>
    </button>
  );
}
