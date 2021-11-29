import { NextApiRequest, NextApiResponse } from 'next';

import { NextApiBuilder } from '@src/backend/api-wrapper';
import { mongoDbWrapper } from '@src/backend/api-wrapper/mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const db = await req.mongo.getDB();

    // const data = await db
    //   .collection('log')
    //   .find({ isPublic: true }, { projection: { _id: 0, isPublic: 0 } })
    //   .sort({ created: -1 })
    //   .limit(20)
    //   .toArray();

    const totalCount = await db.collection('log').find().count();

    return res.status(200).json({
      totalCount,
      // recentText: data.map((val) => ({ ...val, created: String(val.created) })),
    });
  }
};

export default new NextApiBuilder(handler).add(mongoDbWrapper(['GET'])).build();
