import { neon } from "@neondatabase/serverless";

const slugPattern = /^[a-z0-9][a-z0-9-]{0,160}$/;

function json(data, init = {}, headers = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...headers,
      ...init.headers,
    },
  });
}

function getCorsHeaders(request, env) {
  const origin = request.headers.get("Origin");
  const allowedOrigin = env.ALLOWED_ORIGIN;

  if (!allowedOrigin) {
    const corsOrigin = origin || "*";
    const headers = {
      "Access-Control-Allow-Origin": corsOrigin,
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin",
    };
    if (corsOrigin !== "*") {
      headers["Access-Control-Allow-Credentials"] = "true";
    }
    return headers;
  }

  if (origin === allowedOrigin) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Credentials": "true",
      Vary: "Origin",
    };
  }

  return null;
}

function isValidSlug(slug) {
  return typeof slug === "string" && slugPattern.test(slug);
}

async function hashReader(readerId, slug, env) {
  const salt = env.READER_HASH_SALT;

  if (!salt) {
    throw new Error("READER_HASH_SALT is not configured");
  }

  const bytes = new TextEncoder().encode(`${salt}:${slug}:${readerId}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);

  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function recordRead(request, env, corsHeaders) {
  const body = await request.json().catch(() => null);
  const slug = body?.slug;
  const readerId = body?.readerId;
  const event = body?.event;

  if (!isValidSlug(slug)) {
    return json({ error: "Invalid slug" }, { status: 400 }, corsHeaders);
  }

  if (event !== "start" && event !== "read") {
    return json({ error: "Invalid event" }, { status: 400 }, corsHeaders);
  }

  if (typeof readerId !== "string" || readerId.length < 16 || readerId.length > 128) {
    return json({ error: "Invalid reader id" }, { status: 400 }, corsHeaders);
  }

  const readerHash = await hashReader(readerId, slug, env);
  const sql = neon(env.DATABASE_URL);

  if (event === "start") {
    const rows = await sql`
      with new_starter as (
        insert into post_starter_daily (slug, day, reader_hash)
        values (${slug}, current_date, ${readerHash})
        on conflict do nothing
        returning 1
      ),
      updated_daily as (
        insert into post_read_daily (slug, day, starts, unique_starters)
        values (${slug}, current_date, 1, (select count(*) from new_starter))
        on conflict (slug, day) do update set
          starts = post_read_daily.starts + 1,
          unique_starters = post_read_daily.unique_starters + (select count(*) from new_starter),
          updated_at = now()
        returning slug, day, starts, unique_starters, reads, unique_readers
      )
      select slug, day, starts, unique_starters, reads, unique_readers from updated_daily
    `;

    return json({ ok: true, event, read: rows[0] }, { status: 202 }, corsHeaders);
  }

  const rows = await sql`
    with new_reader as (
      insert into post_reader_daily (slug, day, reader_hash)
      values (${slug}, current_date, ${readerHash})
      on conflict do nothing
      returning 1
    ),
    updated_daily as (
      insert into post_read_daily (slug, day, reads, unique_readers)
      values (${slug}, current_date, 1, (select count(*) from new_reader))
      on conflict (slug, day) do update set
        reads = post_read_daily.reads + 1,
        unique_readers = post_read_daily.unique_readers + (select count(*) from new_reader),
        updated_at = now()
      returning slug, day, starts, unique_starters, reads, unique_readers
    )
    select slug, day, starts, unique_starters, reads, unique_readers from updated_daily
  `;

  return json({ ok: true, event, read: rows[0] }, { status: 202 }, corsHeaders);
}

async function getStats(request, env, corsHeaders) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");

  if (!isValidSlug(slug)) {
    return json({ error: "Invalid slug" }, { status: 400 }, corsHeaders);
  }

  const sql = neon(env.DATABASE_URL);
  const rows = await sql`
    select
      coalesce(sum(starts), 0)::int as starts,
      coalesce(sum(unique_starters), 0)::int as unique_starters,
      coalesce(sum(reads), 0)::int as reads,
      coalesce(sum(unique_readers), 0)::int as unique_readers
    from post_read_daily
    where slug = ${slug}
  `;

  return json({ slug, ...rows[0] }, { headers: { "Cache-Control": "public, max-age=60" } }, corsHeaders);
}

export default {
  async fetch(request, env) {
    const corsHeaders = getCorsHeaders(request, env);

    if (!corsHeaders) {
      return json({ error: "Origin not allowed" }, { status: 403 });
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);

    try {
      if (request.method === "POST" && url.pathname === "/read") {
        return await recordRead(request, env, corsHeaders);
      }

      if (request.method === "GET" && url.pathname === "/stats") {
        return await getStats(request, env, corsHeaders);
      }

      return json({ error: "Not found" }, { status: 404 }, corsHeaders);
    } catch (error) {
      console.error(error);
      return json({ error: "Internal server error" }, { status: 500 }, corsHeaders);
    }
  },
};
