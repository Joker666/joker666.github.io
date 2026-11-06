# Repository Guidelines

This is Rafi Hasan's personal blog. It uses Next.js 16 (App Router), Fumadocs (core, UI, MDX), Tailwind CSS 4 and TypeScript. The site is a static export (`output: "export"` in `next.config.mjs`) that GitHub Pages hosts. `.github/workflows/nextjs.yml` builds and deploys it on every push to `main`.

## Project Structure

- `app/(home)/`: the site pages (home, blog, blog tags, reading, projects, research, about, contact). Shared page parts are in `app/(home)/components/`.
- `app/api/search/route.ts`: exports the static search index. `components/search.tsx` is the search dialog that loads it.
- `app/sitemap.ts`, `app/llms-full.txt/`, `app/icon.tsx`, `app/apple-icon.tsx`: generated metadata routes.
- `content/blogs/`: blog posts as `.mdx` files.
- `source.config.ts`: the Fumadocs collection and the frontmatter schema.
- `lib/source.ts`: the `blogPosts` loader. `getPosts()` hides drafts outside development.
- `lib/site.json` and `lib/site.ts`: site name, URL and description.
- `lib/reading.ts`: the reading list data. The projects and research data are arrays in their `page.tsx` files.
- `scripts/generate-og.mjs`: makes the Open Graph images in `public/og/` (git ignores them). It runs before every build as `prebuild`.
- `workers/read-tracker/`: a Cloudflare Worker that records blog reads in Neon. It is a separate package with its own lockfile and `pnpm-workspace.yaml`. Do not commit its `wrangler.toml`.

## Commands

- `pnpm dev`: start the dev server at `http://localhost:3000`.
- `pnpm build`: make the OG images, then build the static site into `out/`.
- `pnpm types:check`: generate the Fumadocs and Next types, then run `tsc`.
- `pnpm og:generate`: make the OG images only.

## Blog Posts

Add a post as `content/blogs/YYYY-MM-DD-slug.mdx`. The frontmatter must match `source.config.ts`:

```yaml
---
title: "Post Title"
description: Short description
author: Rafi Hasan
date: 2026-01-31
tags:
  - tag-one
draft: true # optional, hides the post in production
series: Series Name # optional, with seriesPart: 1
---
```

Math uses KaTeX. Write `$$x$$` for inline math and a ```` ```math ```` block for display math.

## Style

- Match the existing file style. No formatter or linter is configured.
- Use Tailwind utilities. Global styles are in `app/global.css`.
- The sans font is Overpass. `app/global.css` moves some Fumadocs elements by a few pixels so that Overpass text aligns with the icons. These rules use Fumadocs selectors (`[data-search-full]`, `#nd-nav`). After a Fumadocs upgrade, make sure that they still match.
- Search uses `zbsearch`, which Fumadocs uses in place of Orama. Import `create` from `zbsearch`, not from `@orama/orama`.

## Checks

There is no test runner. Before you finish a change, run `pnpm types:check` and `pnpm build`. For a visual change, also look at the page in the dev server.

## Dependencies

- Use pnpm 12. CI uses the same version and installs with `--frozen-lockfile`.
- Allow package build scripts in `allowBuilds` in `pnpm-workspace.yaml`. pnpm 12 stops the install when a build script is not allowed.

## Commits and Pull Requests

- Write short, imperative commit messages that cover one change, for example "Update projects page layout".
- A PR needs a clear summary and links to related issues. Add screenshots for changes to the UI or to content.
