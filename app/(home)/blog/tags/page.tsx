import { TagIndexPage } from "@/app/(home)/components/tag-pages";
import { siteConfig } from "@/lib/site";
import { getAllTags } from "@/lib/tags";
import type { Metadata } from "next";

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <TagIndexPage
      backHref="/blog"
      title="Tags"
      description="Browse all tags used in blog posts."
      emptyMessage="No tags yet."
      tags={tags}
      getHref={(slug) => `/blog/tags/${slug}`}
    />
  );
}

export function generateMetadata(): Metadata {
  return {
    title: "Tags",
    description: "Browse all blog tags.",
    alternates: {
      canonical: "/blog/tags",
    },
    openGraph: {
      type: "website",
      title: "Tags",
      description: "Browse all blog tags.",
      url: "/blog/tags",
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: "Rafi Hasan",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Tags",
      description: "Browse all blog tags.",
      images: [siteConfig.ogImage],
    },
  };
}
