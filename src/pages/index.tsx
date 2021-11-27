import mainImage from '/public/images/sungmo.png';

import cn from 'classnames';
import NextImage from 'next/image';
import { GetServerSideProps } from 'next';

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

        showNoti({ title: 'Success!!' });

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
      <p className="text-6xl font-bold text-center my-12 ">Sungmo Generator</p>
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
        <div className="shadow-md p-4 rounded-md bg-gray-50">
          <div id="image-tag" className="relative w-full">
            <div className="text-center">
              <NextImage width={425} height={661} src={mainImage} />
            </div>
            <p className="text-5xl w-full font-extraDark absolute top-[13%] left-1/2 text-center -translate-x-1/2">
              {line.first}
            </p>
            <p className="text-5xl w-full font-extraDark absolute top-[78%] left-1/2 text-center -translate-x-1/2">
              {line.second}
            </p>
          </div>
          <div className="flex justify-center mt-2">
            <Button
              className="w-60 flex justify-center"
              disabled={loading}
              onClick={handleDownload}
            >
              {loading ? <Spinner /> : 'Download Image'}
            </Button>
          </div>
        </div>
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
      text: { first: query.first ?? '여자가...', second: query.second ?? '말대꾸?!' },
    },
  };
};
