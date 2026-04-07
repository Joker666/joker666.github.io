export interface ReadingEntry {
  title: string;
  author: string;
  publication?: string;
  url: string;
  note: string;
  tags?: string[];
  featured?: boolean;
}

export const readingList: ReadingEntry[] = [
  {
    title: "The Last Quiet Thing",
    author: "Terry Godier",
    url: "https://www.terrygodier.com/the-last-quiet-thing",
    note: "This reframed ADHD for me. It helped me see that the problem is not entirely personal failure, but also a system designed to fragment attention, and that I can take some control back by returning to older, calmer technology.",
    tags: ["attention", "technology", "systems"],
    featured: true,
  },
  {
    title: "The Meaning of Life",
    author: "Ben Mini",
    url: "https://ben-mini.com/2023/the-meaning-of-life",
    note: "This gave me a new way to think about life and memory. One idea that stayed with me is that we measure time through memory, which also explains why some parts of my past feel blurry: I was not really making memories in those periods.",
    tags: ["life", "memory", "reflection"],
    featured: true,
  },
];

export const featuredReading = readingList.filter((entry) => entry.featured).slice(0, 3);
