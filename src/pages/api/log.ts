import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';

import { NextApiBuilder } from '@src/backend/api-wrapper';
import { mongoDbWrapper } from '@src/backend/api-wrapper/mongodb';
import { connectMongo } from '@src/utils/mongodb/connect';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { first, second } = (await Joi.object({
      first: Joi.string().allow('').max(9).required(),
      second: Joi.string().allow('').max(9).required(),
    })
      .required()
      .validateAsync(req.body)) as { first: string; second: string };

    const { db } = await connectMongo();

    await db.collection('log').insertOne({ first, second, created: new Date() });

    return res.end();
  }
};

export default new NextApiBuilder(handler).add(mongoDbWrapper(['POST'])).build();
