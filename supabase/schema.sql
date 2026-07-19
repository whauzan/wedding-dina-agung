-- Run manually in the Supabase SQL editor.
-- guests: single source of truth for personalized invite links, managed via /admin.
create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  type text not null check (type in ('akad_resepsi', 'resepsi')),
  slug text not null unique
);

create index if not exists guests_slug_idx on guests (slug);

alter table guests enable row level security;
-- No policies: guests table has zero public/anon access.
-- All reads/writes go through service-role Next API routes under /api/guests.

-- rsvp: submissions from guests. Table created now so /admin can read from it;
-- the public insert policy + submission form are added in a later task.
create table if not exists rsvp (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  guest_slug text,
  guest_name text,
  attendance text check (attendance in ('hadir', 'tidak_hadir', 'ragu')),
  guest_count int default 1,
  event text check (event in ('akad', 'resepsi', 'keduanya')),
  message text
);

alter table rsvp enable row level security;
-- No policies yet: no public select, no public insert.
-- Admin reads (via /api/rsvp, /api/export) use the service role, which bypasses RLS.
