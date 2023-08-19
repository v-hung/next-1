const million = require('million/compiler')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Recommended for the `pages` directory, default in `app`.
  experimental: {
    // Required:
    appDir: true,
    serverActions: true,
    serverActionsBodySizeLimit: '20mb',
    serverComponentsExternalPackages: ['bcrypt', 'sharp', 'crypto', "uuid"],
  }
}

const millionConfig = {
  auto: true,
  // if you're using RSC:
  // auto: { rsc: true },
}

// module.exports = million.next(nextConfig, millionConfig)
module.exports = nextConfig