import { siteConfig } from "@/lib/site";
import { getAllReadingTags } from "@/lib/reading-tags";
import type { Metadata } from "next";
import Link from "next/link";

export default function ReadingTagsPage() {
  const tags = getAllReadingTags();

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/reading" className="font-mono text-sm px-2 py-1 transition-colors">
          &lt;- BACK
        </Link>
      </div>

      <section className="border-2 border-fd-foreground bg-fd-card p-8 sm:p-10">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold uppercase leading-tight">Reading Tags</h1>
          <p className="mt-4 text-lg text-fd-muted-foreground">Browse themes across the posts and essays I revisit.</p>
        </div>

        {tags.length === 0 ? (
          <p className="text-sm text-fd-muted-foreground">No tags yet.</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/reading/tags/${tag.slug}`}
                className="bg-fd-secondary px-3 py-2 font-mono text-sm uppercase tracking-widest hover:bg-fd-foreground hover:text-fd-background transition-colors"
              >
                {tag.label}
                <span className="ml-2 text-fd-muted-foreground">({tag.count})</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
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
