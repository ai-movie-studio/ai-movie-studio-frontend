import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "oaidalleapiprodscus.blob.core.windows.net" },
      { protocol: "https", hostname: "imgen.x.ai" },
      { protocol: "https", hostname: "vidgen.x.ai" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};
export default nextConfig;
