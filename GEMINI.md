# Project Context: joker666.github.io

## Project Overview

This is a personal blog and documentation site built with **Next.js 16** and **Fumadocs**. It utilizes the Fumadocs framework (Core, UI, MDX) to manage and render content primarily from MDX files. The project is styled using **Tailwind CSS v4**.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Content Management:** Fumadocs MDX
- **UI Library:** Fumadocs UI
- **Styling:** Tailwind CSS 4, PostCSS
- **Package Manager:** pnpm (implied by `pnpm-lock.yaml`)

## Architecture & Directory Structure

- **`app/`**: Contains the Next.js App Router application code.
  - `app/(home)`: Main route group for the landing page and blog listing.
  - `app/api/search`: Search API endpoint.
  - `app/og`: Open Graph image generation.
- **`content/`**: Stores the content of the site.
  - `content/blogs/`: MDX files for blog posts.
- **`lib/`**: Utility libraries and content adapters.
  - `source.ts`: Configures the Fumadocs loader to read from the `content` directory.
  - `layout.shared.tsx`: Shared layout configuration.
- **`source.config.ts`**: Defines the Fumadocs collection configuration and Zod schemas for frontmatter.

## Key Files

- **`source.config.ts`**: Defines the `blogs` collection and the `frontmatterSchema` (author, date, tags, etc.).
- **`lib/source.ts`**: Exports `blogPosts` loader which interfaces between the raw files and the application.
- **`next.config.mjs`**: Next.js configuration.
- **`package.json`**: Project dependencies and scripts.

## Development Commands

| Command            | Description                                                                  |
| :----------------- | :--------------------------------------------------------------------------- |
| `pnpm dev`         | Starts the development server at `http://localhost:3000`.                    |
| `pnpm build`       | Builds the application for production.                                       |
| `pnpm start`       | Starts the production server.                                                |
| `pnpm types:check` | Runs Fumadocs MDX generation, Next.js type generation, and TypeScript check. |
| `pnpm postinstall` | automatically runs `fumadocs-mdx` after installation.                        |

## Development Conventions

### Content Creation

- New blog posts should be added to `content/blogs/` as `.mdx` files.
- **Frontmatter:** All MDX files must include a frontmatter block matching the schema in `source.config.ts`:
  ```yaml
  ---
  title: "Post Title"
  description: "Short description"
  author: "Author Name"
  date: YYYY-MM-DD
  tags:
    - tag1
    - tag2
  ---
  ```

### Styling

- Use Tailwind CSS utility classes for styling.
- Global styles are defined in `app/global.css`.
- The project uses `fumadocs-ui/provider/next` for theming and UI state.

### Type Safety

- Run `pnpm types:check` to ensure type consistency, especially after modifying content schemas.
