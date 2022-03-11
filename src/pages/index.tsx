import cn from 'classnames';
import { GetStaticProps } from 'next';
import NextImage from 'next/image';
import { useCallback, useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import mainImage from '/public/images/sungmo.png';

import useSWR from 'swr';

import { Button } from '@src/frontend/components/ui';
import Input from '@src/frontend/components/ui/Input';
import Spinner from '@src/frontend/components/ui/Spinner';
import { useNoti } from '@src/frontend/hooks/use-noti';
import { fetcher } from '@src/frontend/lib/fetcher';
import { canvasToBlob, downloadImage } from '@src/utils/image';
import { connectMongo } from '@src/utils/mongodb/connect';

interface Props {
  totalCount: number;
}

export default function IndexPage({ totalCount }: Props) {
  const containerDivRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const firstRef = useRef<HTMLParagraphElement>(null);
  const secondRef = useRef<HTMLParagraphElement>(null);

  const { data } = useSWR<{
    totalCount: number;
  }>('/api/recentImage', { fallbackData: { totalCount }, refreshInterval: 5000 });

  const [first, setFirst] = useState('XX가');
  const [second, setSecond] = useState('말대꾸?!');

  const [loading, setLoading] = useState(false);

  const { showNoti, showAlert } = useNoti();

  const handleDownload = useCallback(async () => {
    try {
      setLoading(true);

      if (!canvasRef.current || !containerDivRef.current) throw new Error('다운로드 실패');

      canvasRef.current.width = 425;
      canvasRef.current.height = 661;
      const image = new Image();
      image.src = '/images/sungmo.png';
      image.width = 425;
      image.height = 661;

      const imageSizeRatio = 425 / containerDivRef.current.offsetWidth;

      image.onload = async () => {
        const ctx = canvasRef.current?.getContext('2d');

        if (!ctx || !canvasRef.current || !firstRef.current || !secondRef.current) {
          showAlert({ name: '다운로드 실패', message: '다시 시도해주세요' });
          return;
        }

        ctx?.drawImage(image, 0, 0, 425, 661);
        ctxRef.current = ctx;
        ctxRef.current.textBaseline = 'top';
        ctxRef.current.textAlign = 'left';
        ctxRef.current.font = "bold 48px 'Nanum Gothic', sans-serif";
        ctxRef.current.fillText(
          first,
          (425 - firstRef.current.offsetWidth * imageSizeRatio) / 2,
          86,
        );
        ctxRef.current.fillText(
          second,
          (425 - secondRef.current.offsetWidth * imageSizeRatio) / 2,
          520,
        );

        await canvasToBlob(canvasRef.current)
          .then(URL.createObjectURL)
          .then((blobUrl) => {
            downloadImage(blobUrl, 'sungmo.png');
          });

        showNoti({ title: '이미지 생성 완료!' });

        await fetcher.post('/api/log', {
          json: { first: first.slice(0, 9), second: second.slice(0, 9) },
        });
      };
    } catch (err: any) {
      showAlert(err);
    } finally {
      setLoading(false);
    }
  }, [showNoti, showAlert, first, second]);

  return (
    <div className={cn('h-full')}>
      <div className="my-12 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold">김성모 짤 생성기</h1>
        <p className="mt-2 sm:text-lg font-medium">
          현재까지 생성된 총 말대꾸 개수: {data?.totalCount.toLocaleString()}개
        </p>
      </div>
      <div className="mx-auto max-w-screen-xl px-4 lg:grid grid-cols-2 lg:gap-20 items-center justify-center pb-20">
        <div className="space-y-4 mb-4 lg:mb-0 shadow-md p-4 rounded-md bg-gray-50">
          <Input
            label="첫 번째 대사"
            maxLength={9}
            value={first}
            onChange={(e) => {
              setFirst(e.target.value);
            }}
          />
          <p className="text-right text-sm text-gray-500">{first.length}/9</p>
          <Input
            label="두 번째 대사"
            value={second}
            onChange={(e) => setSecond(e.target.value)}
            maxLength={9}
          />
          <p className="text-right text-sm text-gray-500">{second.length}/9</p>
        </div>
        <div className="shadow-md p-2 sm:p-4 rounded-md bg-gray-50 flex justify-center">
          <div>
            <div ref={containerDivRef} id="image-tag" className="relative max-w-[425px]">
              <div className="text-center">
                <NextImage
                  loading="eager"
                  draggable={false}
                  width={425}
                  height={661}
                  src={mainImage}
                />
              </div>
              <p className="text-4xl sm:text-5xl w-full font-bold absolute top-[13%] left-1/2 text-center -translate-x-1/2">
                <span ref={firstRef}>{first}</span>
              </p>
              <p className="text-4xl sm:text-5xl w-full font-bold absolute top-[78%] left-1/2 text-center -translate-x-1/2">
                <span ref={secondRef}>{second}</span>
              </p>
            </div>
            <div className="flex justify-center mt-2">
              <Button
                className="w-60 flex justify-center"
                disabled={loading}
                onClick={handleDownload}
              >
                {loading ? <Spinner /> : '이미지 다운로드'}
              </Button>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      </div>

      <div className="text-center pb-20 flex flex-col items-center space-y-2 text-gray-600 px-4">
        <p>말대꾸 생성기를 많이 사랑해주셔서 감사합니다 ㅎㅎ..😀</p>
        <p>
          모바일의 <span className="font-bold">카카오톡 브라우저</span>와 같은 인앱브라우저
          환경에서는 파일 다운로드 기능이 제대로 동작하지 않을 수 있습니다.
          <br className="hidden sm:block" />
          크롬(안드로이드) 혹은 사파리(아이폰)와 같은 브라우저를 사용해주세요.
        </p>
        <CopyToClipboard
          onCopy={() => showNoti({ title: '클립보드에 복사되었습니다.' })}
          text="https://sungmo.jjong.co.kr/"
        >
          <Button>URL 복사하기</Button>
        </CopyToClipboard>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  let totalCount = 500000;

  const { db } = await connectMongo();

  totalCount = await db.collection('log').find().count();

  return {
    props: {
      totalCount,
    },
    revalidate: 60,
  };
};
