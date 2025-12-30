# Repository Guidelines

## Project Structure & Module Organization
- `app/` holds the Next.js App Router code (routes, layouts, API handlers). Key areas: `app/(home)` for the landing/blog pages, `app/api/search` for search, and `app/og` for Open Graph image generation.
- `content/` stores MDX content. Blog posts live in `content/blogs/` as `.mdx` files.
- `lib/` contains shared utilities and Fumadocs integration (e.g., `lib/source.ts`, `lib/layout.shared.tsx`).
- `source.config.ts` defines Fumadocs collections and frontmatter schema. `mdx-components.tsx` customizes MDX rendering.

## Build, Test, and Development Commands
- `pnpm dev`: start the local dev server at `http://localhost:3000`.
- `pnpm build`: build the production app with Next.js.
- `pnpm start`: run the production server after a build.
- `pnpm types:check`: generate Fumadocs/Next types and run TypeScript checks.
- `pnpm postinstall`: runs `fumadocs-mdx` automatically after install.

## Coding Style & Naming Conventions
- Language: TypeScript with Next.js App Router.
- Styling: Tailwind CSS utilities; global styles in `app/global.css`.
- Formatting: no formatter or linter is configured—match existing file style and keep imports tidy.
- Content: MDX files in `content/blogs/` should use frontmatter that matches `source.config.ts` (title, description, author, date, tags).

## Testing Guidelines
- No automated test runner is configured. Use `pnpm types:check` as the primary safety check.
- If you introduce tests, add the script to `package.json` and document it here.

## Commit & Pull Request Guidelines
- Commit messages in history are short and imperative (e.g., “Update page.tsx”). Keep them concise and scoped to the change.
- PRs should include a clear summary, any relevant issue links, and screenshots for UI/content changes.

## Content & Configuration Tips
- Blog posts are MDX files in `content/blogs/`; keep dates in `YYYY-MM-DD` format.
- Schema changes in `source.config.ts` usually require running `pnpm types:check` to refresh generated types.
