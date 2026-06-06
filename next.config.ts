import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "@auth/prisma-adapter", ".prisma"],
};

export default nextConfig;