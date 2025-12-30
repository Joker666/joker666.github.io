import Link from "next/link";

const projects = [
  {
    title: "Project One",
    description: "A cool project I am working on.",
    url: "/",
    status: "In Progress"
  },
  {
    title: "Project Two",
    description: "Another awesome project.",
    url: "/",
    status: "Completed"
  }
];

export default function ProjectsPage() {
  return (
    <main className="container max-w-5xl mx-auto py-12 px-4">
      <div className="mb-12 flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Projects</h1>
        <div className="prose text-muted-foreground">
          <p>
            Here is a showcase of my personal and professional projects.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <div key={i} className="border p-6 flex flex-col gap-3 rounded-lg hover:bg-fd-accent/50 transition-colors">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold">{project.title}</h3>
              <span className="text-xs px-2 py-1 bg-fd-secondary rounded-full">{project.status}</span>
            </div>
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
