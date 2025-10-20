import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals = config.externals || {};
    config.externals["@solana/kit"] = "commonjs @solana/kit";
    config.externals["@solana-program/memo"] = "commonjs @solana-program/memo";
    config.externals["@solana-program/system"] = "commonjs @solana-program/system";
    config.externals["@solana-program/token"] = "commonjs @solana-program/token";
    return config;
  },
};

// ✅ Use remotePatterns instead of domains
nextConfig.images = {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'river.delivery',
    },
    {
      protocol: 'https',
      hostname: 'api.dicebear.com',
    },
  ],
  dangerouslyAllowSVG: true,
  contentDispositionType: 'attachment',
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
};

export default nextConfig;