import { notFound } from "next/navigation";
import Link from "next/link";
import { InlineTOC } from "fumadocs-ui/components/inline-toc";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { blogPosts } from "@/lib/source";
import { slugifyTag } from "@/lib/tags";

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const page = blogPosts.getPage([params.slug]);

  if (!page) notFound();
  const Mdx = page.data.body;

  return (
    <main className="w-full max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/blog" className="font-mono text-sm px-2 py-1 transition-colors">
          ← BACK
        </Link>
      </div>

      <article className="border-2 border-fd-foreground bg-fd-card p-8 sm:p-12">
        <div className="mb-12 border-b-2 border-fd-foreground pb-8">
          <div className="flex flex-col gap-4 font-mono text-sm text-fd-muted-foreground uppercase tracking-widest mb-6">
            <span>
              {new Date(page.data.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-mono uppercase leading-tight">{page.data.title}</h1>
          <p className="mt-6 text-lg font-mono text-fd-muted-foreground leading-relaxed">{page.data.description}</p>
        </div>

        <div className="prose prose-neutral prose-lg max-w-none font-mono prose-headings:font-bold prose-headings:uppercase prose-h1:text-2xl prose-h2:text-xl prose-p:text-fd-foreground prose-a:text-fd-primary prose-blockquote:border-l-4 prose-blockquote:border-fd-foreground prose-blockquote:not-italic prose-code:bg-fd-secondary prose-code:text-fd-foreground prose-code:px-1 prose-code:before:content-none prose-code:after:content-none">
          <InlineTOC items={page.data.toc} />
          <Mdx components={defaultMdxComponents} />
        </div>

        <div className="mt-16 pt-8 border-t-2 border-fd-foreground flex justify-between items-center font-mono text-sm">
          <div>
            <span className="text-fd-muted-foreground uppercase tracking-widest block mb-1">Author</span>
            <span className="font-bold">{page.data.author}</span>
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

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const page = blogPosts.getPage([params.slug]);
  if (!page) notFound();
  return {
    title: page.data.title,
    description: page.data.description,
  };
}

export function generateStaticParams(): { slug: string }[] {
  return blogPosts.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}
