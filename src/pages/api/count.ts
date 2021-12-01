import { NextApiRequest, NextApiResponse } from 'next';

import { NextApiBuilder } from '@src/backend/api-wrapper';
import { mongoDbWrapper } from '@src/backend/api-wrapper/mongodb';

export const API_VERSION = '0.1.0';

/**
 *
 * @api {get} /api/version  Get API version
 * @apiName GetApiVersion
 * @apiGroup General
 * @apiVersion  0.1.0
 *
 *
 * @apiSuccess (200) {String} apiVersion api server version
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/2 200 OK
 * {
 *     "apiVersion": "0.1.0"
 * }
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const db = await req.mongo.getDB();

    const totalCount = await db.collection('log').find().count();

    return res.status(200).json({ totalCount });
  }
};

export default new NextApiBuilder(handler).add(mongoDbWrapper(['GET'])).build();
