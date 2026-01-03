import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "Rafi Hasan",
    },
    links: [
      {
        text: "Blog",
        url: "/blog",
        active: "nested-url",
      },
      {
        text: "Projects",
        url: "/projects",
      },
      {
        text: "About",
        url: "/about",
      },
    ],
    githubUrl: "https://github.com/Joker666",
  };
}
