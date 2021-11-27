import type { MongoDB } from '@src/utils/mongodb/connect';

import type { NextApiRequest as GenuineNextApiRequest } from 'next';

declare module 'next' {
  // This is a hack. In order to use custom storage extends NextApiRequest
  interface NextApiRequest extends GenuineNextApiRequest {
    mongo: MongoDB;
  }
}
