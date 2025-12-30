import Link from "next/link";

const projects = [
  {
    title: "Cogman",
    description: "Simple, efficient, distributed task runner for Golang backed by RabbitMQ and Redis.",
    url: "https://github.com/Joker666/cogman",
  },
  {
    title: "Journey+",
    description: "A journaling app for iOS.",
    url: "https://apps.apple.com/us/app/journey-daily-diary-journal/id6457254962",
  },
  {
    title: "Imgforge",
    description: "Image Processing Reimagined in Rust.",
    url: "https://imgforger.github.io/",
  },
];

export default function ProjectsPage() {
  return (
    <main className="container max-w-5xl mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, i) => (
          <div
            key={i}
            className="group border-2 border-muted bg-card p-8 flex flex-col gap-4 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_var(--color-fd-foreground)] hover:border-fd-foreground"
          >
            <h3 className="text-2xl font-bold font-mono uppercase">{project.title}</h3>
            <p className="text-muted-foreground font-mono leading-relaxed">{project.description}</p>
            {project.url !== "#" && (
              <Link
                href={project.url}
                className="text-fd-primary font-mono text-sm underline underline-offset-4 decoration-1 hover:decoration-2 mt-auto"
              >
                View Project →
              </Link>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
