import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";
import { blogPosts } from "@/lib/source";
import { getAllTags } from "@/lib/tags";

export const dynamic = "force-static";

const baseUrl = siteConfig.url.replace(/\/$/, "");

function toAbsoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = [...blogPosts.getPages()];
  const latestPostDate = posts.length
    ? posts.map((post) => new Date(post.data.date)).sort((a, b) => b.getTime() - a.getTime())[0]
    : undefined;

  const latestPostMeta = latestPostDate ? { lastModified: latestPostDate } : {};

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: toAbsoluteUrl("/"),
      ...latestPostMeta,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: toAbsoluteUrl("/blog"),
      ...latestPostMeta,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: toAbsoluteUrl("/blog/tags"),
      ...latestPostMeta,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: toAbsoluteUrl("/about"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: toAbsoluteUrl("/projects"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: toAbsoluteUrl("/contact"),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  const tagEntries: MetadataRoute.Sitemap = getAllTags().map((tag) => ({
    url: toAbsoluteUrl(`/blog/tags/${tag.slug}`),
    ...latestPostMeta,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: toAbsoluteUrl(post.url),
    lastModified: new Date(post.data.date),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...staticEntries, ...tagEntries, ...postEntries];
}
