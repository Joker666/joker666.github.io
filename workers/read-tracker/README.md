# Read Tracker Worker

This Worker records engaged blog reads from the static GitHub Pages site into Neon.

## Database Setup

Run `schema.sql` in the Neon SQL editor.

## Worker Setup

If a Neon connection string has been pasted into chat, issue trackers, logs, or any other shared surface, rotate that role's password in Neon before deploying this Worker.

1. Copy the example config:

   ```sh
   cp wrangler.toml.example wrangler.toml
   ```

2. Install Worker dependencies:

   ```sh
   pnpm install
   ```

3. Store secrets in Cloudflare:

   ```sh
   pnpm wrangler secret put DATABASE_URL
   pnpm wrangler secret put READER_HASH_SALT
   ```

   Use the Neon connection string for `DATABASE_URL`. Use a long random value for `READER_HASH_SALT`.

4. Deploy:

   ```sh
   pnpm run deploy
   ```

5. Add the deployed Worker endpoint to the static site build environment:

   ```sh
   NEXT_PUBLIC_READ_TRACKER_URL=https://your-worker.example.workers.dev/read
   ```

## Endpoints

- `POST /read` records either a `start` event or an engaged `read` event for a blog slug.
- `GET /stats?slug=your-post-slug` returns aggregate starts, reads, unique starters, and unique readers.

The Worker only stores daily aggregate counts and salted reader hashes for per-post daily uniqueness. It does not store IP addresses or raw reader IDs.
