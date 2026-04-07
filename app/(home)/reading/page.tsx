import { siteConfig } from "@/lib/site";
import { slugifyTag } from "@/lib/string-utils";
import { readingList } from "@/lib/reading";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Reading",
  description: "A curated list of essays, posts, and papers that shaped Rafi Hasan's interests.",
  alternates: {
    canonical: "/reading",
  },
  openGraph: {
    type: "website",
    title: "Reading",
    description: "A curated list of essays, posts, and papers that shaped Rafi Hasan's interests.",
    url: "/reading",
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
    title: "Reading",
    description: "A curated list of essays, posts, and papers that shaped Rafi Hasan's interests.",
    images: [siteConfig.ogImage],
  },
};

export default function ReadingPage() {
  return (
    <main className="container max-w-4xl mx-auto px-4 py-12">
      <div className="flex flex-col gap-4">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-fd-muted-foreground">Reading</p>
        <h1 className="text-4xl font-semibold">The posts and papers I keep returning to</h1>
        <p className="max-w-3xl text-muted-foreground">
          This page is for writing that taught me something durable: sharper engineering taste, a better research
          instinct, or a more useful way to look at systems and people.
        </p>
        <div>
          <Link
            href="/reading/tags"
            className="text-sm uppercase tracking-widest text-fd-muted-foreground underline underline-offset-4 hover:text-fd-foreground"
          >
            Browse by tag
          </Link>
        </div>
      </div>

      {readingList.length > 0 ? (
        <div className="mt-12 flex flex-col gap-6">
          {readingList.map((entry) => (
            <article
              key={entry.url}
              className="border-2 border-fd-foreground bg-fd-card p-6 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--color-fd-foreground)] sm:p-8"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-1 flex-col gap-4">
                  <p className="text-xs font-mono uppercase tracking-[0.2em] text-fd-muted-foreground">
                    {entry.publication ? `${entry.author} / ${entry.publication}` : entry.author}
                  </p>
                  <div className="flex flex-col gap-3">
                    <h2 className="text-2xl font-semibold">{entry.title}</h2>
                    <p className="max-w-2xl text-muted-foreground">{entry.note}</p>
                  </div>
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-3">
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
      ) : (
        <div className="mt-12 grid gap-6 md:grid-cols-[1.3fr_0.9fr]">
          <section className="border-2 border-fd-foreground bg-fd-card p-8">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-fd-muted-foreground">Why This Exists</p>
            <div className="mt-4 flex flex-col gap-4 text-muted-foreground">
              <p>
                The main blog is for things I wrote. This page is for things I read and want to keep close at hand.
              </p>
              <p>
                It gives visiting users a faster signal about my interests than a bio paragraph can: systems,
                machine learning, software craftsmanship, and the occasional piece outside engineering that still
                changes how I work.
              </p>
            </div>
          </section>

          <section className="border-2 border-dashed border-fd-foreground p-8">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-fd-muted-foreground">How To Fill It</p>
            <div className="mt-4 flex flex-col gap-4 text-muted-foreground">
              <p>Add entries in `lib/reading.ts` as you collect favorites.</p>
              <p>Keep each note short and personal so the page reflects your taste, not just the outbound links.</p>
              <p>Once you add tags, they automatically get their own archive pages.</p>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
