import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import matter from "gray-matter";
import { ImageResponse } from "@takumi-rs/image-response";
import { jsx, jsxs } from "react/jsx-runtime";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const siteDataPath = path.join(root, "lib", "site.json");
const siteData = JSON.parse(await fs.readFile(siteDataPath, "utf8"));
const siteConfig = {
  ...siteData,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? siteData.url,
};

const outputRoot = path.join(root, "public", "og");

function renderOg({ title, description, site }) {
  return jsxs("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      color: "#f8fafc",
      padding: "64px",
      backgroundColor: "#0f172a",
      backgroundImage: "linear-gradient(135deg, rgba(251,146,60,0.3), transparent)",
      fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
    },
    children: [
      jsx("div", {
        style: {
          fontSize: "28px",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#fb923c",
          fontWeight: 700,
        },
        children: site,
      }),
      jsx("div", {
        style: {
          fontSize: "72px",
          fontWeight: 800,
          lineHeight: 1.1,
          marginTop: "32px",
          maxWidth: "1000px",
        },
        children: title,
      }),
      jsx("div", {
        style: {
          fontSize: "34px",
          lineHeight: 1.4,
          marginTop: "24px",
          color: "rgba(226,232,240,0.9)",
          maxWidth: "1000px",
        },
        children: description,
      }),
      jsx("div", {
        style: {
          marginTop: "auto",
          fontSize: "24px",
          color: "rgba(226,232,240,0.8)",
        },
        children: siteConfig.url.replace(/^https?:\/\//, ""),
      }),
    ],
  });
}

async function writeImage(filePath, element) {
  const response = new ImageResponse(element, {
    width: 1200,
    height: 630,
    format: "webp",
  });
  const arrayBuffer = await response.arrayBuffer();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, Buffer.from(arrayBuffer));
}

await writeImage(
  path.join(outputRoot, "site", "image.webp"),
  renderOg({
    title: siteConfig.name,
    description: siteConfig.description,
    site: siteConfig.name,
  }),
);

const blogsDir = path.join(root, "content", "blogs");
const files = await fs.readdir(blogsDir);
const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

for (const file of mdxFiles) {
  const slug = path.basename(file, ".mdx");
  const source = await fs.readFile(path.join(blogsDir, file), "utf8");
  const { data } = matter(source);
  const title = typeof data.title === "string" ? data.title : slug;
  const description = typeof data.description === "string" ? data.description : "";

  await writeImage(
    path.join(outputRoot, "blog", slug, "image.webp"),
    renderOg({
      title,
      description,
      site: siteConfig.name,
    }),
  );
}

console.log(`Generated ${mdxFiles.length + 1} OG images.`);
