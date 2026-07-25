-- Run manually in the Supabase SQL editor.
-- Add an optional WhatsApp phone number to guests so /admin can deep-link
-- (wa.me) a prefilled invite message per guest. Stored in international format
-- without the leading "+" (e.g. 6281234567890); normalization happens in the
-- API route before insert/update. Nullable: guests without a known number yet.
alter table guests add column if not exists phone text;
