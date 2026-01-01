import { blogPosts } from "@/lib/source";
import { slugifyTag } from "@/lib/string-utils";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing from Rafi Hasan.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    type: "website",
    title: "Blog",
    description: "Writing from Rafi Hasan.",
    url: "/blog",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Rafi Hasan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog",
    description: "Writing from Rafi Hasan.",
    images: ["/opengraph-image"],
  },
};

export default function Home() {
  const posts = [...blogPosts.getPages()].sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col gap-12">
        {posts.map((post) => (
          <article
            key={post.url}
            className="group border-2 border-fd-foreground bg-fd-card p-8 sm:p-10 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--color-fd-foreground)]"
          >
            <Link href={post.url} className="flex flex-col">
              <span className="text-xs font-mono uppercase tracking-widest text-fd-muted-foreground mb-6">
                {new Date(post.data.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>

              <h2 className="text-2xl font-bold mb-6 font-mono group-hover:text-fd-primary transition-colors">
                {post.data.title}
              </h2>

              <p className="text-base leading-relaxed mb-8 font-mono text-fd-muted-foreground">
                {post.data.description}
              </p>
            </Link>

            {post.data.tags && post.data.tags.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {post.data.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tags/${slugifyTag(tag)}`}
                    className="text-sm font-mono underline underline-offset-4 decoration-1 hover:decoration-2 hover:text-fd-primary"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}
