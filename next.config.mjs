import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: "export",
  serverExternalPackages: ["@takumi-rs/image-response"],
  images: {
    remotePatterns: [
      new URL("https://hackernoon.com/images/**"),
      new URL("https://cdn.draftdock.com/file/draftdock/hasanrafi/**"),
    ],
    unoptimized: true, // Since output is "export"
  },
};

export default withMDX(config);
