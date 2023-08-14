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

module.exports = nextConfig;
