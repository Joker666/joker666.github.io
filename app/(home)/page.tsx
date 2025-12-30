import Link from "next/link";
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
    }));

  return (
    <main className="container max-w-5xl mx-auto py-12 px-4">
      <div className="mb-12 flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Hello,</h1>
        <div className="prose text-muted-foreground">
          <p>
            I&apos;m <span className="font-bold text-foreground">Rafi</span>, a senior software engineer with over ten
            years of experience, currently working at Slumber Studios. These days, I&apos;m hacking some side projects,
            exploring photography, and pursuing a master's degree in machine learning.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold">Writings</h2>
        <PostList posts={posts} />
      </div>
    </main>
  );
}
