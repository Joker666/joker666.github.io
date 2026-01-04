import { blogPosts, getPageImage } from "@/lib/source";
import { slugifyTag } from "@/lib/string-utils";
import { InlineTOC } from "fumadocs-ui/components/inline-toc";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const page = blogPosts.getPage([params.slug]);

  if (!page) notFound();
  const Mdx = page.data.body;

  return (
    <main className="w-full max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/blog" className="font-mono text-sm sm:px-2 py-1 transition-colors">
          ← BACK
        </Link>
      </div>

      <article className="border-0 sm:border-2 dark:sm:border border-fd-foreground bg-fd-card px-1 py-8 sm:p-12">
        <div className="mb-12 border-b-2 border-fd-foreground pb-8">
          <div className="flex flex-col gap-4 font-mono text-sm text-fd-muted-foreground uppercase tracking-widest mb-6">
            <span>
              {new Date(page.data.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold uppercase leading-tight">{page.data.title}</h1>
          <p className="mt-6 text-base text-fd-muted-foreground leading-relaxed">{page.data.description}</p>
        </div>

        <div
          className="prose max-w-none prose-headings:font-semibold prose-headings:uppercase prose-h1:text-2xl
                    prose-h2:text-xl prose-p:leading-relaxed prose-p:text-fd-foreground prose-a:text-fd-primary
                    prose-blockquote:border-l-4 prose-blockquote:border-fd-foreground prose-blockquote:not-italic
                    prose-code:bg-fd-secondary prose-code:px-1 prose-code:text-fd-foreground prose-code:before:content-none
                    prose-code:after:content-none"
        >
          <InlineTOC items={page.data.toc} />
          <Mdx components={defaultMdxComponents} />
        </div>

        <div className="mt-16 pt-8 border-t-2 border-fd-foreground flex justify-between items-center font-mono text-sm">
          <div>
            <span className="text-fd-muted-foreground uppercase tracking-widest block mb-1">Author</span>
            <span className="font-semibold">{page.data.author}</span>
          </div>
          {page.data.tags && (
            <div className="flex gap-2">
              {page.data.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tags/${slugifyTag(tag)}`}
                  className="bg-fd-secondary px-2 py-1 uppercase text-xs hover:bg-fd-foreground hover:text-fd-background transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </article>
    </main>
  );
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const page = blogPosts.getPage([params.slug]);
  if (!page) notFound();
  const url = page.url;
  const ogImage = getPageImage(page).url;
  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      title: page.data.title,
      description: page.data.description,
      url,
      authors: [page.data.author],
      publishedTime: new Date(page.data.date).toISOString(),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: page.data.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.data.title,
      description: page.data.description,
      images: [ogImage],
    },
  };
}

export function generateStaticParams(): { slug: string }[] {
  return blogPosts.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}
