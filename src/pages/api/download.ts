import Chromium from 'chrome-aws-lambda';
import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';

import { NextApiBuilder } from '@src/backend/api-wrapper';
import { mongoDbWrapper } from '@src/backend/api-wrapper/mongodb';
import { FONT_PATH } from '@src/utils/env';
import { getOptions } from '@src/utils/options';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { first, second, isPublic } = (await Joi.object({
      first: Joi.string().allow('').max(10).required(),
      second: Joi.string().allow('').max(10).required(),
      isPublic: Joi.boolean().required(),
    })
      .required()
      .validateAsync(req.query)) as { first: string; second: string; isPublic: boolean };

    const options = await getOptions(process.env.NODE_ENV === 'development');

    await Chromium.font(FONT_PATH);

    const browser = await Chromium.puppeteer.launch(options);

    const page = await browser.newPage();

    await page.goto(
      `${
        process.env.NODE_ENV === 'production'
          ? 'https://sungmo.jjong.co.kr'
          : 'http://localhost:3000'
      }?first=${first}&second=${second}`,
    );

    await page.waitForSelector('#image-tag'); // wait for the selector to load
    const element = await page.$('#image-tag'); // declare a variable with an ElementHandle
    if (!element) {
      console.log('error');
      return res.status(404).end();
    }
    const file = await element.screenshot({ type: 'jpeg' });

    await browser.close();

    const db = await req.mongo.getDB();

    await db.collection('log').insertOne({ first, second, isPublic, created: new Date() });

    return res.send(file);
  }
};

export default new NextApiBuilder(handler).add(mongoDbWrapper(['GET'])).build();
