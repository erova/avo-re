import type { NextConfig } from "next";

// The portfolio's canonical host (e.g. "chris.avo.re"). Set it in Vercel only once
// that domain is live. While unset, nothing redirects, so avo.re keeps working.
const portfolioHost = process.env.PORTFOLIO_HOST;

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_TAMBO_API_KEY: process.env.NEXT_PUBLIC_TAMBO_API_KEY,
  },
  async redirects() {
    // Northwestern Mutual case studies moved from /work to /writing.
    const moved = ["nm-mobile", "nm-blueprint"].map((slug) => ({
      source: `/work/${slug}`,
      destination: `/writing/${slug}`,
      permanent: true,
    }));
    if (!portfolioHost) return moved;
    return [
      ...moved,
      {
        // Only the front door. Prototype and content URLs under avo.re keep working.
        source: "/",
        has: [{ type: "host", value: "(www\\.)?avo\\.re" }],
        destination: `https://${portfolioHost}/`,
        permanent: false, // switch to true once the subdomain is settled
      },
    ];
  },
};

export default nextConfig;
