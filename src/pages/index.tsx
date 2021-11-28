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

interface Props {
  text: { first: string; second: string };
}

export default function IndexPage({ text }: Props) {
  const [line, setLine] = useState<{ first: string; second: string }>(text);
  const [loading, setLoading] = useState(false);
  const downloadRef = useRef<HTMLAnchorElement>(null);

  const { showNoti, showAlert } = useNoti();

  const handleDownload = useCallback(async () => {
    try {
      setLoading(true);

      const file = await fetcher('/api/download', {
        searchParams: { first: line.first, second: line.second },
      }).blob();

      if (file && downloadRef && downloadRef.current) {
        const fileDownloadUrl = URL.createObjectURL(file);
        downloadRef.current.href = fileDownloadUrl || '';

        downloadRef.current.click();

        showNoti({ title: '이미지 생성 완료!' });

        setLine({ first: '', second: '' });

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
    <div className={cn('mx-auto max-w-screen-xl p-4 h-full')}>
      <p className="text-4xl sm:text-6xl font-bold text-center my-12">김성모 짤 생성기</p>
      <div className="lg:grid grid-cols-2 lg:gap-20 items-center justify-center pb-20">
        <div className="space-y-4 shadow-md p-4 rounded-md bg-gray-50">
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
        </div>
        <div className="shadow-md p-4 rounded-md bg-gray-50 flex justify-center">
          <div>
            <div id="image-tag" className="relative max-w-[425px]">
              <div className="text-center">
                <NextImage draggable={false} width={425} height={661} src={mainImage} />
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
      <div className="text-center pb-20 flex flex-col items-center space-y-2 text-gray-600">
        <p>많이 사용해주셔서 감사합니다 ㅎㅎ..😀</p>
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
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = context.query;

  return {
    props: {
      ...query,
      text: { first: query.first ?? 'XX가...', second: query.second ?? '말대꾸?!' },
    },
  };
};
