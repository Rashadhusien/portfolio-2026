'use client';

import { gotoSection } from '@/lib/functions';

type LinkProps = {
  tag?: 'div' | 'li';
  label: string;
  url: string;
  icon?: boolean;
  className?: string;
};

export function Link({ tag = 'div', label, url, icon = false, className }: LinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (url.startsWith('#')) {
      e.preventDefault();
      gotoSection(url);
    }
  };

  const lineClass = (hover: boolean) =>
    `font-fancy! block transition-all duration-300 ease-in-out will-change-auto ${hover ? 'group-hover:translate-y-[-100%]' : '-translate-y-0'} ${icon ? 'flex' : ''}`;

  const content = (
    <a onClick={handleClick} href={url} className="group">
      <span className={lineClass(false)}>
        {icon && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            role="img"
            className="-scale-x-75 scale-y-75 fill-current"
          >
            <path d="M7.82834 17.2929L10.1213 19.586L8.70709 21.0001L4 16.2929L8.7071 11.5858L10.1213 13L7.82844 15.2929L18 15.2928L17.9999 3H19.9999L20 16.2928C20 16.8451 19.5523 17.2928 19 17.2928L7.82834 17.2929Z" />
          </svg>
        )}
        {label}
      </span>
      <span className={lineClass(true)}>
        {icon && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            role="img"
            className="-scale-x-75 scale-y-75 fill-current"
          >
            <path d="M7.82834 17.2929L10.1213 19.586L8.70709 21.0001L4 16.2929L8.7071 11.5858L10.1213 13L7.82844 15.2929L18 15.2928L17.9999 3H19.9999L20 16.2928C20 16.8451 19.5523 17.2928 19 17.2928L7.82834 17.2929Z" />
          </svg>
        )}
        {label}
      </span>
    </a>
  );

  const wrapperClass = `h-[2ch] w-fit overflow-y-hidden select-none max-md:h-5 ${className ?? ''}`;

  if (tag === 'li') {
    return <li className={wrapperClass}>{content}</li>;
  }

  return <div className={wrapperClass}>{content}</div>;
}
