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
- **Datastore:** Supabase (Postgres) — Guests, RSVP submissions, and Wishes.
- **Guest list:** Lives in Supabase (`guests` table), managed live by the client through a password-protected `/admin` dashboard. Not a build-time artifact. See §6.
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

Three tables: guests, RSVP, and wishes.

### `guests`
| column | type | notes |
|---|---|---|
| `id` | uuid, pk, default `gen_random_uuid()` | |
| `created_at` | timestamptz, default `now()` | |
| `name` | text | |
| `type` | text | `akad_resepsi` \| `resepsi` |
| `slug` | text | unique; drives `/{slug}`. Immutable once created — renaming a guest never changes their slug, so a shared invite link never breaks. |

Managed exclusively through `/admin` (see §6). No public access — RLS enabled with zero policies; all reads/writes go through service-role API routes under `/api/guests`.

### `rsvp`
| column | type | notes |
|---|---|---|
| `id` | uuid, pk, default `gen_random_uuid()` | |
| `created_at` | timestamptz, default `now()` | |
| `guest_slug` | text | which invite link submitted (for cross-ref with the `guests` table) |
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

**RLS:** enable Row Level Security on every table.
- `wishes`: allow anonymous `insert` and `select` (public wall). **Not built yet** — table, policies, and UI are a later task.
- `rsvp`: table + RLS exist (enabled, zero policies — no public access at all yet). The anonymous `insert` policy and the public submission form are **not built yet**; only the admin-read side is live.
- `guests`: RLS enabled, zero policies — never publicly accessible, by design (see §5).
- All admin/export reads use the service-role key inside a Next API route, never the client.

### API routes (Next App Router, `app/api/...`)
Built:
- `GET /api/guests`, `POST /api/guests`, `PATCH /api/guests/[id]`, `DELETE /api/guests/[id]` — guest CRUD, admin-only (see §6).
- `GET /api/rsvp` — list RSVP rows, admin-only.
- `GET /api/export` — pull all `rsvp` rows and return an `.xlsx` (SheetJS), admin-only. Linked from `/admin/rsvp`.
- `POST /api/admin/login`, `POST /api/admin/logout` — admin session (see §6).

Not built yet (later task):
- `POST /api/rsvp` — public, validate + insert into `rsvp` (anon key / RLS insert policy, not service role — this is guest-facing).
- `POST /api/wishes`, `GET /api/wishes` — public wishes wall.

Client never talks to Supabase directly. All access goes through API routes so keys stay server-side and validation is centralized.

---

## 6. Guest List & Personalized URLs

**Superseded plan:** the original design generated a build-time `data/guests.json` from a client-provided Excel file (`scripts/generate-guests.ts`, `npm run guests`). That never shipped — the client didn't have a guest list yet at the time, so guests moved to a live Supabase table managed through an admin dashboard instead. `data/guests.json`, `scripts/generate-guests.ts`, and the `guests` npm script do not exist and should not be reintroduced; if a client Excel ever does show up, import it via `/admin` (add rows) rather than resurrecting the build-time flow.

**Current implementation:**
- Guests live in the Supabase `guests` table (`id`, `name`, `type`, `slug` — see §5).
- **`/admin`** is a password-protected dashboard (single shared password → httpOnly session cookie; see `src/lib/auth.ts`) where the client adds, edits, and deletes guests themselves:
  - `/admin` — guest list + add/edit/delete form + "copy invite link" button. Server component at `src/app/(admin)/admin/(protected)/page.tsx`, client logic in `_components/GuestManager.tsx`.
  - `/admin/rsvp` — read-only RSVP responses table + "Export to Excel" button (hits `GET /api/export`).
  - `/admin/login` — password form, posts to `POST /api/admin/login`.
  - Guarded by `assertAdminPage()` (pages, redirects to `/admin/login`) and `assertAdminApi()` (API routes, returns 401) in `src/lib/auth.ts`. Both must be checked independently — Next's proxy/middleware layer is deliberately not used as the auth boundary (see the Next docs' own warning that it must not be relied on alone).
- **Slug rules** (`src/lib/slug.ts`): lowercase, spaces → `-`, strip diacritics/punctuation via Unicode normalization. On duplicate names, append `-2`, `-3`, … deterministically, checked against existing rows at creation time (retried on a DB unique-constraint race). **Slugs are immutable** once assigned — renaming a guest in `/admin` never changes their slug, so a link the couple already shared keeps working.
- **URL shape:** `/{slug}` (e.g. `/budi-santoso`), resolved live via `app/(invite)/[slug]/page.tsx` (`export const dynamic = "force-dynamic"` — guests are mutable data, so this is intentionally not statically prerendered).
  - Resolve slug → guest from the `guests` table at **request time** (`getGuestBySlug` in `src/lib/guests.ts`), not build time.
  - Unknown slug → generic fallback (`FALLBACK_GUEST = { name: "Tamu", type: "resepsi" }`), not a 404. The bare `/` route (`app/(invite)/page.tsx`) renders the same fallback. This was an open question in §9 — now resolved in favor of the friendly-fallback default.
- The resolved name is passed into `EnvelopeGate`'s `guestName` prop for the "Hi, {Nama}!" cover. Threading `guest.type` through to drive the akad/resepsi rendering variant (§4/§8) is not done yet — only the name is wired up so far.
- The name is not yet prefilled into the RSVP form, since that form doesn't exist yet (see §5's "not built yet" list).

Never hardcode the guest list in components. Single source of truth = the Supabase `guests` table, managed via `/admin`.

---

## 7. RSVP → Excel Export (the "export to Excel" requirement)

Clarified behaviour: submissions append **live** to Supabase as guests submit (once the public RSVP form is built — see §5). "Export to Excel" = reading accumulated rows into an `.xlsx` on demand (the couple/admin does this a few times before the event for seating/catering counts). These are the same flow, not two features.

**Built:** `GET /api/export` (`src/app/api/export/route.ts`) selects all `rsvp` rows via service role and writes `.xlsx` with SheetJS (`xlsx` package). Columns: name, attendance, guest_count, event, message, created_at. Admin-gated via `assertAdminApi()`, linked from a button on `/admin/rsvp` (not a bare unlinked route — §9's export-auth question is resolved, see below).

The client views responses themselves at `/admin/rsvp` (read-only table) without needing you — the minimal admin page mentioned as a "later" option here has been built now, per §6.

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
3. ~~**Export auth.**~~ **Resolved:** shared admin password → httpOnly session cookie, gating the whole `/admin` area (guest management + RSVP/export), not just export in isolation. See §6.
4. ~~**Unknown-slug behaviour.**~~ **Resolved:** friendly generic invite (`FALLBACK_GUEST`, type `resepsi`), not a 404. See §6.
5. **Background music.** Common for these invites (autoplay-on-open with a toggle). Not in the stated requirements — confirm whether wanted. Note browsers block autoplay until user gesture; the envelope tap is a natural trigger.
6. **Language.** UI copy is Indonesian ("Klik surat untuk membukanya"). Keep all guest-facing strings in Indonesian; centralize them for easy edits.

---

## 10. Non-Negotiables / Guardrails

- Mobile-first, phone-width column, tested at ~380px.
- Cormorant Garamond only, via `next/font`; include italics.
- Respect `prefers-reduced-motion` — animations must degrade gracefully.
- Supabase keys server-side only; client hits Next API routes exclusively.
- Guest list single source of truth = the Supabase `guests` table, managed via `/admin`; never hardcode, never regress to a build-time JSON/Excel flow.
- Guest slugs are immutable once assigned — never regenerate a slug on rename.
- `/admin` and all `/api/guests`, `/api/rsvp`, `/api/export`, `/api/admin/*` routes must check auth independently (`assertAdminPage()` / `assertAdminApi()`); never rely on Next's proxy/middleware layer as the only gate.
- RSVP responses are private (no public select); wishes are public.
- Event/content data lives in typed config, not inline in JSX.
- Keep the wax-seal envelope-open as the signature interaction — it gates the rest of the page.

---

## 11. Suggested Build Order

Done:
1. Scaffold Next.js + Tailwind + Framer Motion + Cormorant Garamond. Establish palette, texture, type scale.
2. Envelope-open interaction + scroll lock + transition into invitation.
3. Static sections built so far: intro/couple names, verse, groom/bride (event-details/countdown blocks from §4 still pending — not the same as guest/admin work below).
4. Supabase project + `guests`/`rsvp` tables + RLS (`supabase/migrations/`). `/admin` dashboard: guest CRUD + slug routing (`/[slug]`, live "Hi, {Nama}!" cover), RSVP read view, `.xlsx` export. See §6/§7.

Remaining:
5. Event details + countdown sections (both variants driven by `event.ts` — that typed config doesn't exist yet, content is still inline; see §8).
6. Public RSVP form (prefilled name, validation, submit) → Supabase, with its anon-insert RLS policy.
7. Wishes wall (table + RLS + submit + paginated public read).
8. Animation pass on the remaining sections (enter/exit, `whileInView`), reduced-motion handling, mobile perf.
9. Replace all placeholders with real date/time/venue; QA on real devices.