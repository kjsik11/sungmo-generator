// @ts-check

const { StatusCodes } = require('http-status-codes');

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/docs/index.html',
        statusCode: StatusCodes.PERMANENT_REDIRECT,
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
