import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "web-tree-sitter",
    "tree-sitter-typescript",
    "tree-sitter-python"
  ]
};

export default nextConfig;
