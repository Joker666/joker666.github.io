import { TagDetailPage } from "@/app/(home)/components/tag-pages";
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
    <TagDetailPage
      backHref="/blog"
      allTagsHref="/blog/tags"
      currentTag={currentTag}
      countText={`${posts.length} post${posts.length === 1 ? "" : "s"}`}
      emptyMessage="No posts with this tag yet."
      tags={allTags}
      getHref={(slug) => `/blog/tags/${slug}`}
      hasItems={posts.length > 0}
    >
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
    </TagDetailPage>
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
