import { siteConfig } from "@/lib/site";
import { getAllReadingTags, getReadingEntriesByTagSlug } from "@/lib/reading-tags";
import { slugifyTag } from "@/lib/string-utils";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ tag: string }>;
};

export default async function ReadingTagPage({ params }: PageProps) {
  const { tag } = await params;
  const allTags = getAllReadingTags();
  const currentTag = allTags.find((item) => item.slug === tag);

  if (!currentTag) notFound();

  const entries = getReadingEntriesByTagSlug(tag);

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link href="/reading" className="font-mono text-sm px-2 py-1 transition-colors">
          &lt;- BACK
        </Link>
        <Link
          href="/reading/tags"
          className="text-sm uppercase tracking-widest text-fd-muted-foreground hover:text-fd-foreground transition-colors"
        >
          All tags
        </Link>
      </div>

      <header className="border-2 border-fd-foreground bg-fd-card p-8 sm:p-10 mb-12">
        <span className="text-xs uppercase tracking-widest text-fd-muted-foreground">Tag</span>
        <h1 className="mt-4 text-3xl sm:text-4xl font-semibold uppercase leading-tight">{currentTag.label}</h1>
        <p className="mt-4 text-lg text-fd-muted-foreground">
          {entries.length} entr{entries.length === 1 ? "y" : "ies"}
        </p>
      </header>

      <section className="mb-12">
        {entries.length === 0 ? (
          <p className="text-sm text-fd-muted-foreground">No reading entries with this tag yet.</p>
        ) : (
          <div className="flex flex-col gap-12">
            {entries.map((entry) => (
              <article
                key={entry.url}
                className="group border-2 border-fd-foreground bg-fd-card p-6 sm:p-8 transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_var(--color-fd-foreground)]"
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-1 flex-col gap-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-fd-muted-foreground">
                      {entry.publication ? `${entry.author} / ${entry.publication}` : entry.author}
                    </span>

                    <div className="flex flex-col gap-3">
                      <h2 className="text-2xl font-semibold">{entry.title}</h2>
                      <p className="text-base leading-relaxed text-fd-muted-foreground">{entry.note}</p>
                    </div>

                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-4">
                        {entry.tags.map((tag) => (
                          <Link
                            key={tag}
                            href={`/reading/tags/${slugifyTag(tag)}`}
                            className="text-sm underline underline-offset-4 decoration-1 hover:decoration-2 hover:text-fd-primary"
                          >
                            {tag}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 border-2 border-fd-foreground px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-fd-primary hover:text-fd-primary-foreground hover:shadow-[4px_4px_0px_0px_var(--color-fd-foreground)]"
                  >
                    Read Post
                  </a>
                </div>
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
                href={`/reading/tags/${tag.slug}`}
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
  const currentTag = getAllReadingTags().find((item) => item.slug === tag);

  if (!currentTag) {
    return { title: "Tag not found" };
  }

  const title = `Reading Tag: ${currentTag.label}`;
  const description = `Reading entries tagged "${currentTag.label}".`;
  const url = `/reading/tags/${currentTag.slug}`;

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
  return getAllReadingTags().map((tag) => ({ tag: tag.slug }));
}
