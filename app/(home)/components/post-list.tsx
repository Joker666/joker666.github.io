'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Post {
  title: string;
  url: string;
  date: string;
  description?: string;
}

export function PostList({ posts }: { posts: Post[] }) {
  const [displayedPosts, setDisplayedPosts] = useState(posts.slice(0, 5));
  
  const handleLoadMore = () => {
    const currentLength = displayedPosts.length;
    const nextPosts = posts.slice(0, currentLength + 5);
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
            className="group flex flex-col gap-1 rounded-lg border p-4 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold group-hover:underline">
                {post.title}
              </h3>
              <time className="text-sm text-muted-foreground whitespace-nowrap">
                {new Date(post.date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
            </div>
            {post.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {post.description}
              </p>
            )}
          </Link>
        ))}
      </div>
      
      {hasMore && (
        <button
          onClick={handleLoadMore}
          className="self-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Load More
        </button>
      )}
    </div>
  );
}
