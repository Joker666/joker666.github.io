import { TagIndexPage } from "@/app/(home)/components/tag-pages";
import { siteConfig } from "@/lib/site";
import { getAllReadingTags } from "@/lib/reading-tags";
import type { Metadata } from "next";

export default function ReadingTagsPage() {
  const tags = getAllReadingTags();

  return (
    <TagIndexPage
      backHref="/reading"
      title="Reading Tags"
      description="Browse themes across the posts and essays I revisit."
      emptyMessage="No tags yet."
      tags={tags}
      getHref={(slug) => `/reading/tags/${slug}`}
    />
  );
}

export function generateMetadata(): Metadata {
  return {
    title: "Reading Tags",
    description: "Browse all tags used in the reading list.",
    alternates: {
      canonical: "/reading/tags",
    },
    openGraph: {
      type: "website",
      title: "Reading Tags",
      description: "Browse all tags used in the reading list.",
      url: "/reading/tags",
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
      title: "Reading Tags",
      description: "Browse all tags used in the reading list.",
      images: [siteConfig.ogImage],
    },
  };
}
