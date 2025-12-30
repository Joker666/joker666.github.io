import Link from "next/link";
import { blogPosts } from "@/lib/source";
import { Calendar, User } from "lucide-react";

export default function Home() {
  const posts = [...blogPosts.getPages()].sort(
    (a, b) =>
      new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );

  return (
    <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 py-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-bold">Latest Blog Posts</h1>
        <p className="text-fd-muted-foreground text-lg">
          Thoughts, ideas, and updates.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.url}
            href={post.url}
            className="group flex flex-col border border-fd-border bg-fd-card rounded-lg overflow-hidden transition-all hover:border-fd-primary/50 hover:shadow-lg"
          >
            {post.data.image && (
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={post.data.image}
                  alt={post.data.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center gap-4 text-xs text-fd-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  {new Date(post.data.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <User className="size-3" />
                  {post.data.author}
                </span>
              </div>
              
              <h2 className="text-xl font-semibold mb-2 group-hover:text-fd-primary transition-colors">
                {post.data.title}
              </h2>
              
              <p className="text-fd-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                {post.data.description}
              </p>
              
              {post.data.tags && post.data.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-auto pt-4">
                  {post.data.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-fd-secondary text-fd-secondary-foreground text-xs rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
