export type Image = {
  src: string;
  alt?: string;
  caption?: string;
};

export type Link = {
  text: string;
  href: string;
};

export type Hero = {
  title?: string;
  text?: string;
  image?: Image;
  actions?: Link[];
};

export type Subscribe = {
  title?: string;
  text?: string;
  formUrl: string;
};

export type SiteConfig = {
  logo?: Image;
  title: string;
  subtitle?: string;
  description: string;
  image?: Image;
  headerNavLinks?: Link[];
  footerNavLinks?: Link[];
  socialLinks?: Link[];
  hero?: Hero;
  subscribe?: Subscribe;
  postsPerPage?: number;
  projectsPerPage?: number;
};

const siteConfig: SiteConfig = {
  title: "Rafi",
  subtitle: "Software engineer, indie hacker, and amateur traveller.",
  description:
    "Astro.js and Tailwind CSS theme for blog and portfolio by justgoodui.com",
  image: {
    src: "/portrait.jpg",
    alt: "Dante - Astro.js and Tailwind CSS theme",
  },
  headerNavLinks: [
    {
      text: "Home",
      href: "/",
    },
    {
      text: "Projects",
      href: "/projects",
    },
    {
      text: "Blog",
      href: "/blog",
    },
    {
      text: "Tags",
      href: "/tags",
    },
  ],
  footerNavLinks: [
    {
      text: "About",
      href: "/about",
    },
    {
      text: "Contact",
      href: "/contact",
    },
  ],
  socialLinks: [
    {
      text: "GitHub",
      href: "https://github.com/Joker666",
    },
    {
      text: "LinkedIn",
      href: "https://www.linkedin.com/in/hasanrafi",
    },
    {
      text: "X/Twitter",
      href: "https://x.com/rafi_talks",
    },
  ],
  hero: {
    title: "sudo welcome-to-my-world",
    text: "I'm **Rafi**, a software engineer and indie hacker based in Canada. I'm currently working for Slumber Group as a senior software engineer. Right now I'm hacking some side projects, learning photography, and doing masters in machine learning. Explore my <a href='https://github.com/Joker666'>GitHub</a> or follow me on <a href='https://x.com/rafi_talks'>Twitter/X</a>.",
    image: {
      src: "/portrait.jpg",
      alt: "A person sitting at a desk in front of a computer",
    },
    actions: [
      {
        text: "Get in Touch",
        href: "/contact",
      },
    ],
  },
  postsPerPage: 8,
  projectsPerPage: 8,
};

export default siteConfig;
