export default function AboutPage() {
  return (
    <main className="container max-w-5xl mx-auto py-12 px-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">Hello,</h1>
        <div className="text-muted-foreground">
          <p>
            I&apos;m <span className="font-semibold text-foreground">Rafi</span>, a senior software engineer with over
            ten years of experience, currently working at Slumber Studios. These days, I&apos;m hacking some side
            projects, exploring photography, and pursuing a master's degree in machine learning.
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
    </main>
  );
}
