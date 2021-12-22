import mainImage from '/public/images/sungmo.png';

import cn from 'classnames';
import NextImage from 'next/image';
import { GetServerSideProps } from 'next';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Input from '@src/frontend/components/ui/Input';

import { useCallback, useRef, useState } from 'react';

import { Button } from '@src/frontend/components/ui';
import { useNoti } from '@src/frontend/hooks/use-noti';
import { fetcher } from '@src/frontend/lib/fetcher';
import Spinner from '@src/frontend/components/ui/Spinner';
import { connectMongo } from '@src/utils/mongodb/connect';

interface Props {
  totalCount: number;
  text: { first: string; second: string };
}

export default function IndexPage({ text, totalCount }: Props) {
  // const { data } = useSWR<{
  //   recentText: { first: string; second: string; created: string }[];
  //   totalCount: number;
  // }>('/api/recentImage', {
  //   fallbackData: {
  //     recentText: [],
  //     totalCount: 50000,
  //   },
  // });

  const [line, setLine] = useState<{ first: string; second: string }>(text);
  const [loading, setLoading] = useState(false);
  // const [isPublic, setIsPublic] = useState(false);
  const downloadRef = useRef<HTMLAnchorElement>(null);

  const { showNoti, showAlert } = useNoti();

  const handleDownload = useCallback(async () => {
    try {
      setLoading(true);

      // if (isPublic) {
      //   badJson.badwords.forEach((word) => {
      //     if (line.first.includes(word) || line.second.includes(word))
      //       throw new ApiError('BAD_WORDS');
      //   });
      // }

      const file = await fetcher('/api/download', {
        searchParams: { first: line.first, second: line.second },
      }).blob();

      if (file && downloadRef && downloadRef.current) {
        const fileDownloadUrl = URL.createObjectURL(file);
        downloadRef.current.href = fileDownloadUrl || '';

        downloadRef.current.click();

        showNoti({ title: '이미지 생성 완료!' });

        return;
      }

      throw new Error('No such file');
    } catch (err: any) {
      showAlert(err);
    } finally {
      setLoading(false);
    }
  }, [showNoti, showAlert, line]);

  return (
    <div className={cn('h-full')}>
      <div className="my-12 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold">김성모 짤 생성기</h1>
        <p className="mt-2 sm:text-lg font-medium">
          현재까지 생성된 총 말대꾸 개수: {totalCount}개
        </p>
      </div>
      <div className="mx-auto max-w-screen-xl px-4 lg:grid grid-cols-2 lg:gap-20 items-center justify-center pb-20">
        <div className="space-y-4 mb-4 lg:mb-0 shadow-md p-4 rounded-md bg-gray-50">
          <Input
            label="첫 번째 대사"
            maxLength={10}
            value={line.first}
            onChange={(e) => setLine((prev) => ({ ...prev, first: e.target.value }))}
          />
          <p className="text-right text-sm text-gray-500">{line.first.length}/10</p>
          <Input
            label="두 번째 대사"
            value={line.second}
            maxLength={10}
            onChange={(e) => setLine((prev) => ({ ...prev, second: e.target.value }))}
          />
          <p className="text-right text-sm text-gray-500">{line.second.length}/10</p>
          {/* <div className="flex space-x-2 items-center">
            <input
              id="check-public"
              checked={isPublic}
              onChange={() => setIsPublic((prev) => !prev)}
              type="checkbox"
            />
            <label htmlFor="check-public">다른 유저에게 공개하기</label>
          </div> */}
        </div>
        <div className="shadow-md p-4 rounded-md bg-gray-50 flex justify-center">
          <div>
            <div id="image-tag" className="relative max-w-[425px]">
              <div className="text-center">
                <NextImage
                  loading="eager"
                  draggable={false}
                  width={425}
                  height={661}
                  src={mainImage}
                />
              </div>
              <p className="text-5xl w-full font-bold absolute top-[13%] left-1/2 text-center -translate-x-1/2">
                {line.first}
              </p>
              <p className="text-5xl w-full font-bold absolute top-[78%] left-1/2 text-center -translate-x-1/2">
                {line.second}
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
          </div>
        </div>
      </div>
      {/* {data && data.recentText.length > 0 ? (
        <div className="text-center py-8 overflow-hidden">
          <p className="text-2xl font-semibold">최근에 생성된 말대꾸(최대 20개)</p>
          <div className="flex space-x-4 overflow-x-auto">
            {data.recentText.map((val, idx) => (
              <div className="first:ml-4 last:pr-4 flex-shrink-0 mt-4" key={`recent-image-${idx}`}>
                <TextImage data={val} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative h-80 w-full">
          <Loading />
        </div>
      )} */}
      <div className="text-center pb-20 flex flex-col items-center space-y-2 text-gray-600 px-4">
        <p>
          <span className="line-through">10만 번째</span>,
          <span className="line-through">11만1111번째</span>
          말대꾸를 생성한 뒤<br /> 출력되는 창의 비밀키를 스크린 샷, 본인의 번호와 함께 메일로
          보내주시면 조그마한 선물을 드릴 예정입니다.
          <br />
          말대꾸 생성기를 많이 사랑해주셔서 감사합니다 ㅎㅎ..😀
        </p>
        <a
          target="_blank"
          href="mailto: kjsik11@gmail.com"
          className="hover:opacity-80 hover:underline font-bold text-blue-600 pb-4"
          rel="noreferrer"
        >
          버그, 피드백 메일로 제보하기
        </a>
        <p>
          모바일의 <span className="font-bold">카카오톡 브라우저</span>와 같은 인앱브라우저
          환경에서는 파일 다운로드 기능이 제대로 동작하지 않을 수 있습니다.
          <br className="hidden sm:block" />
          크롬(안드로이드) 혹은 사파리(아이폰)와 같은 브라우저를 사용해주세요.
        </p>
        <p>
          이미지가 정상적으로 다운로드 되지 않았을경우 서버가 불안정해서 실패했을 확률이 높으니 한번
          더 시도해주세요.
        </p>
        <CopyToClipboard
          onCopy={() => showNoti({ title: '클립보드에 복사되었습니다.' })}
          text="https://sungmo.jjong.co.kr/"
        >
          <Button>URL 복사하기</Button>
        </CopyToClipboard>
      </div>
      <a className="hidden" ref={downloadRef} download="sungmo.jpeg" href="" />
      <a
        target="_blank"
        rel="noreferrer"
        href="https://github.com/kjsik11"
        className="fixed right-0 top-0 w-20 h-20 github-corner"
        aria-label="View source on GitHub"
      >
        <svg width="80" height="80" viewBox="0 0 250 250">
          <path fill="black" d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
          <path
            d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
            fill="white"
            style={{ transformOrigin: '130px 106px' }}
            className="transition-all transform octo-arm"
          />
          <path
            d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
            fill="white"
          />
        </svg>
      </a>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = context.query;

  let totalCount = 50000;
  if (!query.first && !query.second) {
    const { db } = await connectMongo();

    totalCount = await db.collection('log').find().count();
  }

  return {
    props: {
      ...query,
      totalCount,
      text: { first: query.first ?? 'XX가...', second: query.second ?? '말대꾸?!' },
    },
  };
};
