create table if not exists post_read_daily (
  slug text not null,
  day date not null default current_date,
  starts integer not null default 0,
  unique_starters integer not null default 0,
  reads integer not null default 0,
  unique_readers integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (slug, day)
);

create table if not exists post_starter_daily (
  slug text not null,
  day date not null default current_date,
  reader_hash text not null,
  created_at timestamptz not null default now(),
  primary key (slug, day, reader_hash)
);

create table if not exists post_reader_daily (
  slug text not null,
  day date not null default current_date,
  reader_hash text not null,
  created_at timestamptz not null default now(),
  primary key (slug, day, reader_hash)
);

create index if not exists post_read_daily_slug_idx on post_read_daily (slug);