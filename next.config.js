/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.GITHUB_ACTIONS && "/firebase-chatroom",
  trailingSlash: true,
  reactStrictMode: true,
}

module.exports = nextConfig
