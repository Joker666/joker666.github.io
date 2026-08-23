import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: "export",
  env: {
    // Inlined at build time so the prerendered HTML and the client bundle carry
    // the same year. Computing it at render time desyncs them once the year rolls
    // over, because "output: export" freezes the HTML at build.
    NEXT_PUBLIC_BUILD_YEAR: String(new Date().getFullYear()),
  },
  images: {
    remotePatterns: [
      new URL("https://hackernoon.com/images/**"),
      new URL("https://cdn.draftdock.com/file/draftdock/hasanrafi/**"),
    ],
    unoptimized: true, // Since output is "export"
  },
};

export default withMDX(config);
