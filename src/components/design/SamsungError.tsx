'use client';

import { useEffect } from 'react';
import { displayNone } from '@/lib/animations';
import { useLenis } from '@/components/providers/LenisProvider';

export function SamsungError() {
  const { lenis } = useLenis();

  useEffect(() => {
    if (lenis) lenis.stop();
  }, [lenis]);

  const handleClick = () => {
    displayNone('#samsung-error-modal');
  };

  return (
    <div
      id="samsung-error-modal"
      className="flex-center fixed inset-0 z-50 h-svh w-svw bg-black/75 opacity-0"
    >
      <div className="flex-center z-50 mx-auto size-full h-1/2 w-11/12 flex-col rounded-lg bg-white p-5 shadow-sm md:w-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="inline-block rounded-full bg-yellow-50 p-4">
            <svg className="h-12 w-12 fill-current text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z" />
            </svg>
          </div>
          <h2 className="mt-2 font-semibold text-gray-800">
            It seems you&apos;re using the <b>Samsung Internet Browser</b>.
          </h2>
          <p className="mt-2 w-full text-start text-sm leading-relaxed text-gray-600">
            Some features might not work as expected, especially in dark mode, to
            fix it please follow the steps below:
          </p>
          <br />
          <div className="flex-center">
            <i>Labs</i>
            <i>Enable &apos;Use website dark theme&apos;</i>
          </div>
          <p className="mt-3 text-xl font-bold">Then reload the page.</p>
        </div>
        <div className="mt-3 flex w-full items-center" onClick={handleClick}>
          <button className="flex-1 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200">
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
