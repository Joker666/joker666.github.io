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
        <p>Feel free to reach out to me via email:</p>
        <a href="mailto:mr.k779@outlook.com" className="text-lg font-medium text-fd-primary hover:underline">
          mr.k779@outlook.com
        </a>
      </div>
    </main>
  );
}
