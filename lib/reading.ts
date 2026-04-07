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
  // Add favorite essays, blog posts, or papers here as you collect them.
];

export const featuredReading = readingList.filter((entry) => entry.featured).slice(0, 3);
