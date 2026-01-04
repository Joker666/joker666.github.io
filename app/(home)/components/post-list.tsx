"use client";

import Link from "next/link";
import { useState } from "react";

interface Post {
  title: string;
  url: string;
  dateLabel: string;
  description?: string;
  tags?: string[];
}

const POSTS_PER_PAGE = 8;

export function PostList({ posts }: { posts: Post[] }) {
  const [displayedPosts, setDisplayedPosts] = useState(posts.slice(0, POSTS_PER_PAGE));

  const handleLoadMore = () => {
    const currentLength = displayedPosts.length;
    const nextPosts = posts.slice(0, currentLength + POSTS_PER_PAGE);
    setDisplayedPosts(nextPosts);
  };

  const hasMore = displayedPosts.length < posts.length;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        {displayedPosts.map((post) => (
          <Link
            key={post.url}
            href={post.url}
            className="group flex flex-col gap-1 rounded-lg border-2 border-muted bg-card p-4 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--color-fd-foreground)] hover:border-fd-foreground"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-medium group-hover:underline">{post.title}</h3>
              <time className="text-sm font-mono text-muted-foreground whitespace-nowrap">{post.dateLabel}</time>
            </div>
            {post.description && <p className="text-sm text-muted-foreground line-clamp-2">{post.description}</p>}
          </Link>
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={handleLoadMore}
          className="self-center cursor-pointer border-2 border-fd-foreground px-6 py-2 text-sm font-semibold uppercase tracking-widest transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--color-fd-foreground)]"
        >
          Load More
        </button>
      )}
    </div>
  );
}
