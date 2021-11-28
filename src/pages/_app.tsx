import '@assets/main.css';
import 'nprogress/nprogress.css';

import { DefaultSeo } from 'next-seo';
import useNProgress from 'next-use-nprogress';
import Script from 'next/script';
import { useEffect } from 'react';
import { SWRConfig } from 'swr';

import { CommonLayout } from '@src/frontend/components/layout';
import { Modal, Notification } from '@src/frontend/components/ui';
import { useModal } from '@src/frontend/hooks/use-modal';
import { useNoti } from '@src/frontend/hooks/use-noti';
import { fetcher } from '@src/frontend/lib/fetcher';
import { GTM } from '@src/utils/tagmanager';

import type { AppProps } from 'next/app';

const fetcherSWR = async (url: string) => await fetcher(url).json();

export default function App({ Component, pageProps }: AppProps) {
  useNProgress({
    minimum: 0.3,
    easing: 'ease',
    speed: 500,
    showSpinner: false,
  });

  const { modal, closeModal } = useModal();
  const { noti, closeNoti } = useNoti();

  useEffect(() => {
    GTM.initialize();
  }, []);

  return (
    <>
      <Script src="/js/redirectIE.js" strategy="beforeInteractive" />
      <DefaultSeo
        title="김성모 짤 생성기"
        additionalLinkTags={[
          {
            rel: 'icon',
            href: '/assets/favicon.ico',
          },
          {
            rel: 'icon',
            type: 'image/png',
            sizes: '16x16',
            href: '/assets/favicon-16x16.png',
          },
          {
            rel: 'icon',
            type: 'image/png',
            sizes: '32x32',
            href: '/assets/favicon-32x32.png',
          },
          {
            rel: 'apple-touch-icon',
            href: '/assets/apple-touch-icon.png',
            sizes: '180x180',
          },
          {
            rel: 'manifest',
            href: '/assets/site.webmanifest',
          },
        ]}
        openGraph={{
          type: 'website',
          title: '김성모 짤 생성기',
          images: [
            {
              url: '/images/sungmo.png',
              width: 1200,
              height: 630,
              alt: 'Sungmo image',
            },
          ],
        }}
      />
      <SWRConfig value={{ fetcher: fetcherSWR }}>
        <CommonLayout>
          <Component {...pageProps} />
        </CommonLayout>
      </SWRConfig>

      <Modal {...modal} close={closeModal} />
      <Notification {...noti} close={closeNoti} />
    </>
  );
}
