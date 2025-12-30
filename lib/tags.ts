import { blogPosts } from "@/lib/source";
import { slugifyTag } from "@/lib/string-utils";

export type TagInfo = {
  label: string;
  slug: string;
  count: number;
};

export function getAllTags(): TagInfo[] {
  const tags = new Map<string, TagInfo>();

  for (const page of blogPosts.getPages()) {
    for (const tag of page.data.tags ?? []) {
      const slug = slugifyTag(tag);
      if (!slug) continue;
      const existing = tags.get(slug);
      if (existing) {
        existing.count += 1;
        continue;
      }
      tags.set(slug, { label: tag, slug, count: 1 });
    }
  }

  return [...tags.values()].sort((a, b) =>
    a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
  );
}

export function getPostsByTagSlug(slug: string) {
  return blogPosts
    .getPages()
    .filter((page) => page.data.tags?.some((tag) => slugifyTag(tag) === slug))
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
}
