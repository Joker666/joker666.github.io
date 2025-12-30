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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <div key={i} className="border p-6 flex flex-col gap-3 rounded-lg hover:bg-fd-accent/50 transition-colors">
            <h3 className="text-xl font-bold">{project.title}</h3>
            <p className="text-muted-foreground">{project.description}</p>
            {project.url !== "#" && (
              <Link href={project.url} className="text-fd-primary hover:underline mt-auto">
                View Project →
              </Link>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
