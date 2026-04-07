import { readingList, type ReadingEntry } from "@/lib/reading";
import { slugifyTag } from "@/lib/string-utils";

export type ReadingTagInfo = {
  label: string;
  slug: string;
  count: number;
};

export function getAllReadingTags(): ReadingTagInfo[] {
  const tags = new Map<string, ReadingTagInfo>();

  for (const entry of readingList) {
    for (const tag of entry.tags ?? []) {
      const slug = slugifyTag(tag);
      if (!slug) continue;

      const existing = tags.get(slug);
      if (existing) {
        existing.count += 1;
        continue;
      }

      tags.set(slug, {
        label: tag,
        slug,
        count: 1,
      });
    }
  }

  return [...tags.values()].sort((a, b) =>
    a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
  );
}

export function getReadingEntriesByTagSlug(slug: string): ReadingEntry[] {
  return readingList.filter((entry) => entry.tags?.some((tag) => slugifyTag(tag) === slug));
}
