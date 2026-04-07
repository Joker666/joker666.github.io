import type { ReactNode } from "react";
import Link from "next/link";

type SharedTag = {
  label: string;
  slug: string;
  count: number;
};

type TagChipListProps = {
  tags: SharedTag[];
  getHref: (slug: string) => string;
  activeSlug?: string;
};

export function TagChipList({ tags, getHref, activeSlug }: TagChipListProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {tags.map((tag) => {
        const isActive = tag.slug === activeSlug;

        return (
          <Link
            key={tag.slug}
            href={getHref(tag.slug)}
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
  );
}

type TagIndexPageProps = {
  backHref: string;
  title: string;
  description: string;
  emptyMessage: string;
  tags: SharedTag[];
  getHref: (slug: string) => string;
};

export function TagIndexPage({ backHref, title, description, emptyMessage, tags, getHref }: TagIndexPageProps) {
  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href={backHref} className="font-mono text-sm px-2 py-1 transition-colors">
          &lt;- BACK
        </Link>
      </div>

      <section className="border-2 border-fd-foreground bg-fd-card p-8 sm:p-10">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold uppercase leading-tight">{title}</h1>
          <p className="mt-4 text-lg text-fd-muted-foreground">{description}</p>
        </div>

        {tags.length === 0 ? <p className="text-sm text-fd-muted-foreground">{emptyMessage}</p> : <TagChipList tags={tags} getHref={getHref} />}
      </section>
    </main>
  );
}

type TagDetailPageProps = {
  backHref: string;
  allTagsHref: string;
  currentTag: SharedTag;
  countText: string;
  emptyMessage: string;
  tags: SharedTag[];
  getHref: (slug: string) => string;
  hasItems: boolean;
  children: ReactNode;
};

export function TagDetailPage({
  backHref,
  allTagsHref,
  currentTag,
  countText,
  emptyMessage,
  tags,
  getHref,
  hasItems,
  children,
}: TagDetailPageProps) {
  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link href={backHref} className="font-mono text-sm px-2 py-1 transition-colors">
          &lt;- BACK
        </Link>
        <Link
          href={allTagsHref}
          className="text-sm uppercase tracking-widest text-fd-muted-foreground hover:text-fd-foreground transition-colors"
        >
          All tags
        </Link>
      </div>

      <header className="border-2 border-fd-foreground bg-fd-card p-8 sm:p-10 mb-12">
        <span className="text-xs uppercase tracking-widest text-fd-muted-foreground">Tag</span>
        <h1 className="mt-4 text-3xl sm:text-4xl font-semibold uppercase leading-tight">{currentTag.label}</h1>
        <p className="mt-4 text-lg text-fd-muted-foreground">{countText}</p>
      </header>

      <section className="mb-12">
        {hasItems ? children : <p className="text-sm text-fd-muted-foreground">{emptyMessage}</p>}
      </section>

      <section className="border-2 border-fd-foreground bg-fd-card p-8 sm:p-10">
        <h2 className="text-2xl font-semibold uppercase mb-6">All tags</h2>
        <TagChipList tags={tags} getHref={getHref} activeSlug={currentTag.slug} />
      </section>
    </main>
  );
}
