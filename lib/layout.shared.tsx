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
        text: "Reading",
        url: "/reading",
      },
      {
        text: "Projects",
        url: "/projects",
      },
      {
        text: "Research",
        url: "/research",
      },
      {
        text: "About",
        url: "/about",
      },
    ],
  };
}
