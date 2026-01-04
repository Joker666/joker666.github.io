import { blogPosts } from "@/lib/source";
import { PostList } from "./components/post-list";

export default function HomePage() {
  const posts = [...blogPosts.getPages()]
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
    .map((post) => ({
      title: post.data.title,
      url: post.url,
      date: post.data.date.toISOString(),
      description: post.data.description,
      tags: post.data.tags,
    }));

  return (
    <main className="container max-w-5xl mx-auto py-12 px-4">
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold">Writings</h2>
        <PostList posts={posts} />
      </div>
    </main>
  );
}
