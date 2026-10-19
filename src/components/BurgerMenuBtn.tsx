'use client';

import { Magnetic } from '@/components/common/Magnetic';

type BurgerMenuBtnProps = {
  onClick: () => void;
  className?: string;
  id?: string;
};

export function BurgerMenuBtn({ onClick, className, id }: BurgerMenuBtnProps) {
  return (
    <div id={id} className={`fixed right-7 top-7 z-20 ${className ?? ''}`}>
      <Magnetic strength={0.4} innerStrength={0.15}>
        <button
          type="button"
          onClick={onClick}
          aria-label="Toggle menu"
          id="magneto"
          className="flex-center size-14 cursor-pointer rounded-full bg-flax-smoke-300 brightness-90 ease-in-out lg:size-[4.5rem]"
        >
          <span
            data-magnetic-inner
            className="w-[100%] text-center before:bg-flax-smoke-700 after:bg-flax-smoke-700"
            id="magnetoText"
          />
        </button>
      </Magnetic>
    </div>
  );
}
