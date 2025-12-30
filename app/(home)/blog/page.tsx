import Link from "next/link";
import { blogPosts } from "@/lib/source";

export default function Home() {
  const posts = [...blogPosts.getPages()].sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col gap-12">
        {posts.map((post) => (
          <Link
            key={post.url}
            href={post.url}
            className="group block border-2 border-fd-foreground bg-fd-card p-8 sm:p-10 transition-all hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_var(--color-fd-foreground)]"
          >
            <div className="flex flex-col h-full">
              <span className="text-xs font-mono uppercase tracking-widest text-fd-muted-foreground mb-6">
                {new Date(post.data.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>

              <h2 className="text-3xl font-bold mb-6 font-mono group-hover:text-fd-primary transition-colors">
                {post.data.title}
              </h2>

              <p className="text-lg leading-relaxed mb-8 font-mono text-fd-muted-foreground">{post.data.description}</p>

              {post.data.tags && post.data.tags.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-auto">
                  {post.data.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-sm font-mono underline underline-offset-4 decoration-1 hover:decoration-2 hover:text-fd-primary"
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
