import { connectMongo } from '@src/utils/mongodb/connect';

import type { ApiWrapper } from '.';
import type { NextApiHandler } from 'next';

export function mongoDbWrapper(
  methods: string[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTION'],
): ApiWrapper {
  const wrapper = (handler: NextApiHandler) => {
    const inner: NextApiHandler = async (req, res) => {
      // Skip if method is not supported
      if (methods.includes(req.method || '')) {
        req.mongo = await connectMongo();
      }

      return await handler(req, res);
    };

    return inner;
  };

  return wrapper;
}
