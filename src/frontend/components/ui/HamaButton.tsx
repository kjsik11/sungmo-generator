import cn from 'classnames';
import NextLink from 'next/link';

import HamaUFO from '../vector/HamaUFO';

export default function HamaButton() {
  return (
    <NextLink href="https://hama.app/?referral=bFR9cqM4DHUkg46k">
      <a
        className={cn(
          'border border-gray-300 py-2 px-10 inline-flex justify-center items-center font-bold rounded-8 rounded-lg hover:bg-black hover:text-white transition-colors',
        )}
      >
        <HamaUFO className="mr-2" />
        Hama 체험해보기
      </a>
    </NextLink>
  );
}
