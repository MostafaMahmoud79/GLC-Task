import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: false, // Disable React Compiler
  experimental: {
    reactCompiler: false,
  },
};

export default nextConfig;