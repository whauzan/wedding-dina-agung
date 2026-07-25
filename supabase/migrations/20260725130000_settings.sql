-- Run manually in the Supabase SQL editor.
-- settings: small key/value store for admin-editable content that isn't a
-- guest/rsvp/wish. Currently holds the WhatsApp invite message template so the
-- couple can reword it from /admin without a redeploy. Placeholders {Nama} and
-- {link} are substituted per-guest when opening wa.me.
create table if not exists settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table settings enable row level security;
-- No policies: read/write only through service-role Next API routes (/api/settings).

insert into settings (key, value)
values (
  'wa_template',
  E'Assalamu\'alaikum Wr. Wb.\n\nHalo {Nama}, dengan penuh kebahagiaan kami mengundang Anda ke pernikahan kami:\n\nAgung Nugroho & Yudia Putri M.\n\nDetail & konfirmasi kehadiran:\n{link}\n\nMerupakan kehormatan bagi kami atas kehadiran Anda. Terima kasih 🤍'
)
on conflict (key) do nothing;
