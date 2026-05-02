import Link from "next/link";

interface Post {
  title: string;
  url: string;
  dateLabel: string;
  description?: string;
  tags?: string[];
  draft?: boolean;
}

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="flex flex-col">
      {posts.map((post) => (
        <Link
          key={post.url}
          href={post.url}
          className="group flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 py-2 transition-opacity hover:opacity-70"
        >
          <div className="flex items-center gap-3">
            <h3 className="text-[1.05rem] font-medium underline-offset-4 group-hover:underline">
              {post.title}
            </h3>
            {post.draft && (
              <span className="text-xs uppercase tracking-widest text-fd-muted-foreground">
                [Draft]
              </span>
            )}
          </div>
          <time className="text-sm text-fd-muted-foreground shrink-0 tabular-nums">
            {post.dateLabel}
          </time>
        </Link>
      ))}
    </div>
  );
}
