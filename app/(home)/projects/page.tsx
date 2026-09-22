import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "A selection of software projects I've worked on.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    type: "website",
    title: "Projects",
    description: "A selection of software projects I've worked on.",
    url: "/projects",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Rafi Hasan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects",
    description: "A selection of software projects I've worked on.",
    images: [siteConfig.ogImage],
  },
};

interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  tag: string;
  stack: string;
}

interface ProjectDomain {
  name: string;
  projects: Project[];
}

const projectDomains: ProjectDomain[] = [
  {
    name: "Native Apps",
    projects: [
      {
        id: "paper",
        title: "Paper",
        description: "A minimal WYSIWYG Markdown editor for macOS that hides the syntax and formats text in place.",
        url: "https://usepaper.github.io/",
        tag: "macOS",
        stack: "Swift",
      },
      {
        id: "reflex",
        title: "Reflex",
        description: "A native macOS link router that sends each link to the right browser or browser profile.",
        url: "https://rafihasan.com/Reflex/",
        tag: "macOS",
        stack: "Swift",
      },
      {
        id: "today",
        title: "Today",
        description: "The minimal to-do app that clears your list every morning.",
        url: "https://apps.apple.com/us/app/today-a-daily-to-do-list/id6759506994",
        tag: "iOS",
        stack: "SwiftUI",
      },
      {
        id: "journey-plus",
        title: "Journey+",
        description: "A daily diary and journaling app for iOS.",
        url: "https://apps.apple.com/us/app/journey-daily-diary-journal/id6457254962",
        tag: "iOS",
        stack: "SwiftUI",
      },
    ],
  },
  {
    name: "Systems & Infrastructure",
    projects: [
      {
        id: "cogman",
        title: "Cogman",
        description: "Simple, efficient, distributed task runner for Golang backed by RabbitMQ and Redis.",
        url: "https://github.com/Joker666/cogman",
        tag: "Infra",
        stack: "Go · RabbitMQ · Redis",
      },
      {
        id: "imgforge",
        title: "Imgforge",
        description: "A fast and secure image proxy built on libvips. Drop-in compatible with imgproxy URLs.",
        url: "https://imgforger.github.io/",
        tag: "Server",
        stack: "Go · libvips",
      },
    ],
  },
  {
    name: "AI & Machine Learning",
    projects: [
      {
        id: "askmydocs",
        title: "AskMyDocs",
        description: "A local PDF Q&A backend built with FastAPI, Docling, PostgreSQL + pgvector, Pydantic AI, and Ollama.",
        url: "https://github.com/Joker666/AskMyDocs",
        tag: "AI",
        stack: "Python · FastAPI · pgvector · Ollama",
      },
    ],
  },
];

export default function ProjectsPage() {
  return (
    <main className="container max-w-4xl mx-auto py-12 px-4">
      <div className="flex flex-col gap-12">
        {projectDomains.map((domain) => (
          <section key={domain.name} className="flex flex-col">
            <div className="flex items-baseline gap-3 pb-3 border-b-2 border-fd-foreground">
              <h2 className="text-xs font-mono uppercase tracking-[0.25em] font-semibold text-fd-primary">
                {domain.name}
              </h2>
              <span className="text-xs font-mono text-fd-muted-foreground">
                ({domain.projects.length})
              </span>
            </div>

            <div className="flex flex-col divide-y divide-fd-muted">
              {domain.projects.map((project) => (
                <a
                  key={project.id}
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-6 transition-opacity hover:opacity-70"
                >
                  <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                    <div className="flex items-baseline gap-2.5">
                      <h3 className="font-semibold text-[1.1rem] text-fd-foreground underline-offset-4 group-hover:underline">
                        {project.title}
                      </h3>
                      <span className="text-fd-muted-foreground text-xs font-mono group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform inline-block">
                        ↗
                      </span>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-fd-muted-foreground">
                        [{project.tag}]
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="shrink-0 text-xs font-mono text-fd-muted-foreground sm:text-right">
                    {project.stack}
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
