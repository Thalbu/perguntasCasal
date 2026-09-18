import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // evita que o Next suba a árvore e ache um lockfile fora do repo
  turbopack: { root: __dirname },
};

export default nextConfig;
