import TagManager from 'react-gtm-module';

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
if (!gtmId) throw new Error('Missing NEXT_PUBLIC_GTM_ID.');

interface TagManagerOptions {
  userId: string;
}

export const GTM = {
  initialize: (options?: TagManagerOptions) => {
    TagManager.initialize({
      gtmId,
      dataLayer: options,
    });
  },
};
