import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'upload.wikimedia.org',
      'ube.edu.ec',
      'sga.ube.edu.ec',
      'postgrado.ube.edu.ec',
      'lh3.googleusercontent.com', // Google OAuth
      'platform-lookaside.fbsbx.com', // Facebook OAuth
    ],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ]
  },
};

export default nextConfig;