import { siteConfig } from "@/lib/site";
import { getAllTags } from "@/lib/tags";
import type { Metadata } from "next";
import Link from "next/link";

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/blog" className="font-mono text-sm px-2 py-1 transition-colors">
          &lt;- BACK
        </Link>
      </div>

      <section className="border-2 border-fd-foreground bg-fd-card p-8 sm:p-10">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-mono uppercase leading-tight">Tags</h1>
          <p className="mt-4 text-lg font-mono text-fd-muted-foreground">Browse all tags used in blog posts.</p>
        </div>

        {tags.length === 0 ? (
          <p className="font-mono text-sm text-fd-muted-foreground">No tags yet.</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/blog/tags/${tag.slug}`}
                className="bg-fd-secondary px-3 py-2 font-mono text-sm uppercase tracking-widest hover:bg-fd-foreground hover:text-fd-background transition-colors"
              >
                {tag.label}
                <span className="ml-2 text-xs normal-case text-fd-muted-foreground">({tag.count})</span>
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
