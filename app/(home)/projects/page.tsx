import Link from "next/link";

const projects = [
  {
    id: "cogman",
    title: "Cogman",
    description: "Simple, efficient, distributed task runner for Golang backed by RabbitMQ and Redis.",
    url: "https://github.com/Joker666/cogman",
  },
  {
    id: "journey-plus",
    title: "Journey+",
    description: "A journaling app for iOS.",
    url: "https://apps.apple.com/us/app/journey-daily-diary-journal/id6457254962",
  },
  {
    id: "imgforge",
    title: "Imgforge",
    description: "A fast and secure image proxy built on libvips. Drop-in compatible with imgproxy URLs.",
    url: "https://imgforger.github.io/",
  },
];

export default function ProjectsPage() {
  return (
    <main className="container max-w-5xl mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group border-2 border-muted bg-card p-8 flex flex-col gap-4 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--color-fd-foreground)] hover:border-fd-foreground"
          >
            <h3 className="text-2xl font-semibold uppercase">{project.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{project.description}</p>
            {project.url !== "#" && (
              <Link
                href={project.url}
                className="text-fd-primary text-sm underline underline-offset-4 decoration-1 hover:decoration-2 mt-auto"
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
