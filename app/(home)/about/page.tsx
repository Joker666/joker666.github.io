import Link from "next/link";

import { featuredReading } from "@/lib/reading";

const numberToWords: Record<number, string> = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
  10: "ten",
  11: "eleven",
  12: "twelve",
  13: "thirteen",
  14: "fourteen",
  15: "fifteen",
  16: "sixteen",
  17: "seventeen",
  18: "eighteen",
  19: "nineteen",
  20: "twenty",
};

export default function AboutPage() {
  const startDate = new Date(2014, 10); // November 2014 (0-indexed month)
  const currentDate = new Date();
  let yearsOfExperience = currentDate.getFullYear() - startDate.getFullYear();
  if (currentDate.getMonth() < 10) yearsOfExperience--;
  const yearsText = numberToWords[yearsOfExperience] || yearsOfExperience.toString();

  return (
    <main className="container max-w-4xl mx-auto py-12 px-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">Hello,</h1>
        <div className="text-muted-foreground">
          <p>
            My real name is <span className="font-semibold text-foreground">MD Ahad Hasan</span>, but I go by my
            preferred name, <span className="font-semibold text-foreground">Rafi Hasan</span>. I am a senior software
            engineer with over <span className="font-semibold text-foreground">{yearsText} years </span>of experience,
            currently working at Slumber Studios. These days, I&apos;m hacking some side projects, exploring
            photography, and pursuing a master's degree in machine learning.
          </p>
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-3">
        <p>Feel free to reach out to me.</p>
        <div className="text-lg font-medium">
          <a href="mailto:mr.k779@outlook.com" className="text-fd-primary hover:underline">
            Email
          </a>
          <span className="mx-2 text-fd-muted-foreground">●</span>
          <a href="https://github.com/Joker666" className="text-fd-primary hover:underline">
            Github
          </a>
          <span className="mx-2 text-fd-muted-foreground">●</span>
          <a href="https://www.linkedin.com/in/hasanrafi/" className="text-fd-primary hover:underline">
            LinkedIn
          </a>
          <span className="mx-2 text-fd-muted-foreground">●</span>
          <a
            href="https://scholar.google.com/citations?user=fFq6TTAAAAAJ&hl=en"
            className="text-fd-primary hover:underline"
          >
            Google Scholar
          </a>
        </div>
      </div>
      <section className="mt-14 border-t-2 border-fd-foreground pt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-fd-muted-foreground">Reading Shelf</p>
            <h2 className="text-2xl font-semibold">Writing that shaped how I think</h2>
            <p className="max-w-2xl text-muted-foreground">
              I keep a public list of essays, posts, and papers that influenced my taste in engineering, research, and
              life.
            </p>
          </div>
          <Link href="/reading" className="text-fd-primary underline underline-offset-4 hover:no-underline">
            Browse the reading list
          </Link>
        </div>

        {featuredReading.length > 0 ? (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {featuredReading.map((entry) => (
              <a
                key={entry.url}
                href={entry.url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col gap-3 border-2 border-muted bg-card p-5 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-fd-foreground hover:shadow-[4px_4px_0px_0px_var(--color-fd-foreground)]"
              >
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-fd-muted-foreground">
                  {entry.publication ? `${entry.author} / ${entry.publication}` : entry.author}
                </p>
                <h3 className="text-lg font-semibold group-hover:text-fd-primary">{entry.title}</h3>
                <p className="text-sm text-muted-foreground">{entry.note}</p>
              </a>
            ))}
          </div>
        ) : (
          <p className="mt-8 max-w-2xl border-2 border-dashed border-fd-foreground px-5 py-4 text-muted-foreground">
            This list is intentionally separate from my own blog. It is where I will collect the posts I return to most
            often and the ideas I want this site to signal.
          </p>
        )}
      </section>
    </main>
  );
}
