-- Run manually in the Supabase SQL editor.
-- wishes: public wishes wall. Reads/writes go through service-role Next API
-- routes (POST /api/wishes, GET /api/wishes) — same trust-boundary pattern as
-- guests/rsvp: the API route validates input, so the table needs no anon
-- policies. RLS stays on with zero policies (no direct public access).
create table if not exists wishes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  message text not null,
  guest_slug text
);

create index if not exists wishes_created_at_idx on wishes (created_at desc);

alter table wishes enable row level security;
-- No policies: all access is via service-role Next API routes.
