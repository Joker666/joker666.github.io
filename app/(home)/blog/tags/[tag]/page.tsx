import { siteConfig } from "@/lib/site";
import { slugifyTag } from "@/lib/string-utils";
import { getAllTags, getPostsByTagSlug } from "@/lib/tags";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ tag: string }>;
};

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const allTags = getAllTags();
  const currentTag = allTags.find((item) => item.slug === tag);

  if (!currentTag) notFound();

  const posts = getPostsByTagSlug(tag);

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link href="/blog" className="font-mono text-sm px-2 py-1 transition-colors">
          &lt;- BACK
        </Link>
        <Link
          href="/blog/tags"
          className="text-sm uppercase tracking-widest text-fd-muted-foreground hover:text-fd-foreground transition-colors"
        >
          All tags
        </Link>
      </div>

      <header className="border-2 border-fd-foreground bg-fd-card p-8 sm:p-10 mb-12">
        <span className="text-xs uppercase tracking-widest text-fd-muted-foreground">Tag</span>
        <h1 className="mt-4 text-3xl sm:text-4xl font-semibold uppercase leading-tight">{currentTag.label}</h1>
        <p className="mt-4 text-lg text-fd-muted-foreground">
          {posts.length} post{posts.length === 1 ? "" : "s"}
        </p>
      </header>

      <section className="mb-12">
        {posts.length === 0 ? (
          <p className="text-sm text-fd-muted-foreground">No posts with this tag yet.</p>
        ) : (
          <div className="flex flex-col gap-12">
            {posts.map((post) => (
              <article
                key={post.url}
                className="group border-2 border-fd-foreground bg-fd-card p-6 sm:p-8 transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_var(--color-fd-foreground)]"
              >
                <Link href={post.url} className="flex flex-col">
                  <span className="text-xs font-mono uppercase tracking-widest text-fd-muted-foreground mb-6">
                    {new Date(post.data.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>

                  <h2 className="text-2xl font-semibold mb-6 group-hover:text-fd-primary transition-colors">
                    {post.data.title}
                  </h2>

                  <p className="text-base leading-relaxed mb-8 text-fd-muted-foreground">{post.data.description}</p>
                </Link>

                {post.data.tags && post.data.tags.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {post.data.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog/tags/${slugifyTag(tag)}`}
                        className="text-sm underline underline-offset-4 decoration-1 hover:decoration-2 hover:text-fd-primary"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="border-2 border-fd-foreground bg-fd-card p-8 sm:p-10">
        <h2 className="text-2xl font-semibold uppercase mb-6">All tags</h2>
        <div className="flex flex-wrap gap-4">
          {allTags.map((tag) => {
            const isActive = tag.slug === currentTag.slug;
            return (
              <Link
                key={tag.slug}
                href={`/blog/tags/${tag.slug}`}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "bg-fd-foreground text-fd-background px-3 py-2 font-mono text-sm uppercase tracking-widest"
                    : "bg-fd-secondary px-3 py-2 font-mono text-sm uppercase tracking-widest hover:bg-fd-foreground hover:text-fd-background transition-colors"
                }
              >
                {tag.label}
                <span className="ml-2 text-fd-muted-foreground">({tag.count})</span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const currentTag = getAllTags().find((item) => item.slug === tag);
  if (!currentTag) {
    return { title: "Tag not found" };
  }
  const title = `Tag: ${currentTag.label}`;
  const description = `Blog posts tagged "${currentTag.label}".`;
  const url = `/blog/tags/${currentTag.slug}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url,
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
      title,
      description,
      images: [siteConfig.ogImage],
    },
  };
}

export function generateStaticParams(): { tag: string }[] {
  return getAllTags().map((tag) => ({ tag: tag.slug }));
}
