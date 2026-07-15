@AGENTS.md

# CLAUDE.md — Wedding Invitation Website

Context file for Claude Code. Read this fully before generating or editing code.

---

## 1. Project Goal

A single-wedding digital invitation website (Indonesian wedding, "undangan digital").
Guests receive personalized URLs. The site opens with a sealed-envelope
interaction, then reveals the invitation with heavy animated transitions,
a live countdown, event details, an RSVP form, and a public wishes wall.

Two invitation variants exist **per guest**:
- **`akad_resepsi`** — shows both the Akad (ceremony) and Resepsi (reception) event blocks.
- **`resepsi`** — shows only the Resepsi block.

The invitation type is a property of the individual guest, not a global site setting.

**Couple:** Agung Nugroho & Yudia Putri M. (placeholder date "2026" in mockups — real date TBD, keep configurable.)

---

## 2. Tech Stack (locked)

- **Framework:** Next.js (App Router), TypeScript.
- **Hosting:** Vercel.
- **Animation:** Framer Motion (`motion`) — enter/exit transitions, envelope-open, section reveals, countdown ticks.
- **Styling:** Tailwind CSS. (Reasonable to use; not explicitly requested but implied for speed. If the user prefers CSS Modules, switch.)
- **Datastore:** Supabase (Postgres) — RSVP submissions and Wishes only.
- **Guest list:** NOT in a database. Generated at build time from a client-provided Excel file into a committed JSON. See §6.
- **Font:** Cormorant Garamond (Google Fonts, via `next/font`). Weights: 400, 500, 600, 700; include italic (mockups use italic for "~ Resepsi ~", "The Wedding of", "Date, 2026", "SAVE THE DATE!").

Do not introduce other state libraries, UI kits, or a separate backend server. Next API routes are the only backend. Keep Supabase keys server-side (service role in route handlers only; never expose to client).

---

## 3. Mobile-First & Design Direction

Mobile-first is a hard requirement. Design and test at ~380px width first; desktop is a centered, max-width (~480px) column — this is a phone-shaped invitation, not a full-bleed desktop site.

**Palette (from mockups):**
- Slate blue-grey background: approx `#9AA3B0` / `#8E97A6` (textured, paper-like).
- Off-white / cream alternate background (used in resepsi-only "Save the Date" card): approx `#F7F5F0`.
- Ink/near-black for body text on light: approx `#2B2B2B`.
- White line-art florals (forget-me-nots) on slate; ink line-art florals on cream.
- Deep red wax seal (`#8B2E2E`-ish) on the envelope.

**Motifs:** forget-me-not line florals in corners; thin corner-bracket frames (see couple-name mockup); wax-seal envelope for the open interaction; floral arch line illustrations on the Save-the-Date section (two variants — one for resepsi bg, one for akad bg).

**Type treatment:** Cormorant Garamond throughout. Large centered display for names and dates, small-caps-ish italic labels ("~ Akad ~", "~ Resepsi ~"), letter-spacing on section labels. Match the mockups' hierarchy.

**Texture:** backgrounds have a subtle plaster/paper texture. Use a tiling texture image or CSS; keep it subtle and performant on mobile.

---

## 4. Screen / Section Flow

Single-page experience, revealed in stages. Order:

1. **Cover / Envelope (gate).** Cream/light bg. "Hi, {Nama}!" (guest's real name from slug). A wax-sealed envelope illustration. Caption "Klik surat untuk membukanya". Tapping the envelope plays a seal-break + open animation, then transitions into the invitation. Until opened, the rest is not scrollable (lock scroll). Background music toggle can live here (see §8 open questions).
2. **Invitation intro.** Slate bg. Line-floral bloom. "You are invited to" → couple names section:
   - "The Wedding of" (italic)
   - **Agung Nugroho & Yudia Putri M.** (large display)
   - "Date, 2026" (real date once known)
   - Corner-bracket frame + corner florals.
3. **Save the Date / Countdown.** Live countdown to the event (days / hours / minutes / seconds). For `akad_resepsi`, count down to the Akad start; for `resepsi`, to the Resepsi start. (Confirm target with user — see §9.)
4. **Event details.**
   - `akad_resepsi`: two blocks — `~ Akad ~` (date + time) then `~ Resepsi ~` (date + time). Same venue in current data, but render venue per-event (model supports two venues + two map links).
   - `resepsi`: single `~ Resepsi ~` block.
   - Each block: label, "Hari, DD MM YYYY", time, "Nama Tempat", venue name, full address, and a maps link/button.
5. **RSVP form.** Writes to Supabase. See §5.
6. **Wishes wall.** Public. Submit a wish; read others' wishes. See §5.
7. **Closing.** Thank-you / couple names / floral close.

Every section transition uses Framer Motion (fade/slide/scale on scroll-into-view via `whileInView`, plus the dedicated envelope-open sequence). "Lots of animation" is a requirement — be generous but keep it smooth on mobile (respect `prefers-reduced-motion`).

---

## 5. Data Model (Supabase)

Two tables. RSVP and wishes only. No guest list here.

### `rsvp`
| column | type | notes |
|---|---|---|
| `id` | uuid, pk, default `gen_random_uuid()` | |
| `created_at` | timestamptz, default `now()` | |
| `guest_slug` | text | which invite link submitted (for cross-ref with guest JSON) |
| `guest_name` | text | prefilled from slug, but store what was submitted |
| `attendance` | text | enum-like: `hadir` / `tidak_hadir` / `ragu` (attending / not / maybe) |
| `guest_count` | int | number of people attending (nullable / default 1) |
| `event` | text | for `akad_resepsi` guests: which they'll attend — `akad` / `resepsi` / `keduanya`. Null for resepsi-only. |
| `message` | text | optional note attached to RSVP (nullable) |

### `wishes`
| column | type | notes |
|---|---|---|
| `id` | uuid, pk | |
| `created_at` | timestamptz, default `now()` | |
| `name` | text | display name |
| `message` | text | the wish |
| `guest_slug` | text | nullable, for reference |

**RLS:** enable Row Level Security.
- `wishes`: allow anonymous `insert` and `select` (public wall).
- `rsvp`: allow anonymous `insert` only; **no public `select`** (RSVP responses are private).
- All reads for admin/export use the service-role key inside a Next API route, never the client.

### API routes (Next App Router, `app/api/...`)
- `POST /api/rsvp` — validate + insert into `rsvp` (service role).
- `POST /api/wishes` — validate + insert into `wishes`.
- `GET /api/wishes` — return wishes for the wall (paginate; newest first).
- `GET /api/export` — **admin-only** — pull all `rsvp` rows and return an `.xlsx` (SheetJS). Protect with a secret query token or basic env-var check; this is not linked in the UI. (Confirm auth approach with user — see §9.)

Client never talks to Supabase directly. All access goes through API routes so keys stay server-side and validation is centralized.

---

## 6. Guest List & Personalized URLs

- Client provides an **Excel file**: columns `name`, `type` (`akad_resepsi` or `resepsi`). Expect messy input — trim whitespace, normalize casing, tolerate Indonesian type labels and map them.
- A **build-time script** (`scripts/generate-guests.ts`, run manually / via `npm run guests`) reads the `.xlsx` (SheetJS) and outputs `data/guests.json`:
  ```json
  {
    "budi-santoso": { "name": "Budi Santoso", "type": "akad_resepsi" },
    "siti-aminah":  { "name": "Siti Aminah",  "type": "resepsi" }
  }
  ```
- **Slug rules:** lowercase, spaces → `-`, strip diacritics/punctuation. On duplicate slugs, append `-2`, `-3`, … deterministically (sort input first so output is stable across runs). Log all collisions.
- **URL shape:** `/{slug}` (e.g. `/budi-santoso`). Use a dynamic route `app/[slug]/page.tsx`.
  - Resolve slug → guest from `guests.json` at request/build time.
  - Unknown slug → a graceful generic fallback ("Hi, Tamu!") or a 404 with a friendly message. Decide with user; default to a friendly generic invite (type `resepsi`) so no valid guest is ever locked out by a slug typo.
- Consider `generateStaticParams` to statically pre-render every guest page (fast, cacheable) since the guest list is known at build time. RSVP/wishes stay dynamic (client fetch / API).
- The name is also prefilled into the RSVP form and the "Hi, {Nama}!" cover.

Never hardcode the guest list in components. Single source of truth = `guests.json`, generated from the client's Excel.

---

## 7. RSVP → Excel Export (the "export to Excel" requirement)

Clarified behaviour: submissions append **live** to Supabase as guests submit. "Export to Excel" = reading accumulated rows into an `.xlsx` on demand (the couple/admin does this a few times before the event for seating/catering counts). These are the same flow, not two features.

Implementation: `GET /api/export` (or a standalone `scripts/export-rsvp.ts`) selects all `rsvp` rows via service role and writes `.xlsx` with SheetJS. Columns: name, attendance, guest_count, event, message, created_at. Keep it access-gated.

If the client wants to view responses themselves without you, add a minimal read-only admin page later — do not degrade the architecture to a Google Sheet to achieve this.

---

## 8. Content: The Two Variants (source of truth)

Event content should live in a typed config (`data/event.ts`), not scattered in components. Structure:

```ts
export const wedding = {
  couple: { groom: "Agung Nugroho", bride: "Yudia Putri M." },
  akad:   { date: "2029-08-22", time: "…", venueName: "Kembar Cafe & Venue",
            address: "Jl. Sakti Lubis No.40, Sitirejo II, Kec. Medan Amplas, Kota Medan, Sumatera Utara 20217",
            mapsUrl: "…" },
  resepsi:{ date: "2029-08-22", time: "…", venueName: "Kembar Cafe & Venue",
            address: "…same or different…", mapsUrl: "…" },
};
```
(Placeholder date `22 08 2029` and venue are from the mockups — replace with real values. Times are currently unknown — see §9.)

**Rendering rule by guest type:**
- `akad_resepsi` → render Akad block + Resepsi block; countdown targets Akad.
- `resepsi` → render Resepsi block only; countdown targets Resepsi.

Design differs slightly between contexts too (mockup shows white "Save the Date" card for resepsi-only vs. textured slate with both blocks for akad+resepsi) — keep the visual variant tied to guest type but driven by the same components with props, not duplicated pages.

**Venue model:** support two distinct venues + two maps links even though both are currently the same. Cheap now, painful to retrofit.

---

## 9. Open Questions / Decisions Still Needed (do not invent)

Flag these to the user rather than guessing:
1. **Real wedding date and the Akad/Resepsi times.** Mockups use `22 08 2029` and "Hari" / "Nama Tempat" placeholders. Need real date + both times before countdown and details are final.
2. **Countdown target confirmation.** Assumed Akad-start for `akad_resepsi`, Resepsi-start for `resepsi`. Confirm.
3. **Export auth.** `GET /api/export` protection: shared secret token vs. a simple password page vs. run-locally script only. Pick one.
4. **Unknown-slug behaviour.** Friendly generic invite (default) vs. hard 404.
5. **Background music.** Common for these invites (autoplay-on-open with a toggle). Not in the stated requirements — confirm whether wanted. Note browsers block autoplay until user gesture; the envelope tap is a natural trigger.
6. **Language.** UI copy is Indonesian ("Klik surat untuk membukanya"). Keep all guest-facing strings in Indonesian; centralize them for easy edits.

---

## 10. Non-Negotiables / Guardrails

- Mobile-first, phone-width column, tested at ~380px.
- Cormorant Garamond only, via `next/font`; include italics.
- Respect `prefers-reduced-motion` — animations must degrade gracefully.
- Supabase keys server-side only; client hits Next API routes exclusively.
- Guest list single source of truth = `guests.json` from client Excel; never hardcode.
- RSVP responses are private (no public select); wishes are public.
- Event/content data lives in typed config, not inline in JSX.
- Keep the wax-seal envelope-open as the signature interaction — it gates the rest of the page.

---

## 11. Suggested Build Order

1. Scaffold Next.js + Tailwind + Framer Motion + Cormorant Garamond. Establish palette, texture, type scale.
2. Guest slug routing (`/[slug]`), `guests.json` + generation script, "Hi, {Nama}!" cover.
3. Envelope-open interaction + scroll lock + transition into invitation.
4. Static sections: intro/couple names, event details (both variants driven by `event.ts`), countdown.
5. Supabase project + tables + RLS. API routes for RSVP and wishes.
6. RSVP form (prefilled name, validation, submit) → Supabase.
7. Wishes wall (submit + paginated public read).
8. Export route/script → `.xlsx`.
9. Animation pass everywhere (enter/exit, `whileInView`), reduced-motion handling, mobile perf.
10. Replace all placeholders with real date/time/venue; QA on real devices.