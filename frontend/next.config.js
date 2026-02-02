/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",          // ✅ MUST for Render static site
  reactStrictMode: true,

  images: {
    unoptimized: true,       // ✅ static export fix
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
