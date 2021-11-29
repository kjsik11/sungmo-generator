import { dateFromNow } from '@src/utils/moment';

import NextImage from 'next/image';

import mainImage from '/public/images/sungmo.png';

interface Props {
  data: { first: string; second: string; created: string };
}

export default function TextImage({ data }: Props) {
  return (
    <div>
      <div className="relative max-w-[212px]">
        <div className="text-center">
          <NextImage loading="lazy" placeholder="blur" width={212} height={330} src={mainImage} />
        </div>
        <p className="text-2xl w-full font-bold absolute top-[11%] left-1/2 text-center -translate-x-1/2">
          {data.first}
        </p>
        <p className="text-2xl w-full font-bold absolute top-[72%] left-1/2 text-center -translate-x-1/2">
          {data.second}
        </p>
        <p className="text-right text-gray-600 text-sm">{dateFromNow(data.created)} 생성</p>
      </div>
    </div>
  );
}
