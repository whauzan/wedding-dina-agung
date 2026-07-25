import "server-only";
import { getSupabaseAdmin } from "./supabase";
import type { GuestType } from "./guests";

export type Rsvp = {
  id: string;
  created_at: string;
  guest_slug: string | null;
  guest_name: string | null;
  attendance: "hadir" | "tidak_hadir" | "ragu" | null;
  guest_count: number | null;
  event: "akad" | "resepsi" | "keduanya" | null;
  message: string | null;
};

// An RSVP row plus the invitation type the guest was invited under, resolved
// from the `guests` table via `guest_slug`. The form never asks which event a
// guest will attend (`event` is always null), so "Acara" in the admin view
// reflects what they were *invited* to, not a choice they made.
export type RsvpWithInvite = Rsvp & {
  invited_type: GuestType | null;
};

export async function listRsvps(): Promise<RsvpWithInvite[]> {
  const supabase = getSupabaseAdmin();

  const { data: rsvps, error } = await supabase
    .from("rsvp")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  const allRows = rsvps as Rsvp[];

  // Submissions are append-only (POST /api/rsvp never overwrites), so a guest
  // who confirms twice has multiple rows. For the admin view + export we keep
  // only each guest's latest confirmation, identified by guest_slug. Rows are
  // already sorted newest-first, so the first time we see a slug is its latest.
  // Null-slug rows (fallback / unknown-slug visitors) have no real identity, so
  // they're never merged — each is kept as its own row.
  const seenSlugs = new Set<string>();
  const rows = allRows.filter((r) => {
    if (!r.guest_slug) return true;
    if (seenSlugs.has(r.guest_slug)) return false;
    seenSlugs.add(r.guest_slug);
    return true;
  });

  const slugs = [...seenSlugs];

  const typeBySlug = new Map<string, GuestType>();
  if (slugs.length > 0) {
    const { data: guests, error: guestsError } = await supabase
      .from("guests")
      .select("slug, type")
      .in("slug", slugs);

    if (guestsError) throw guestsError;
    for (const g of guests as { slug: string; type: GuestType }[]) {
      typeBySlug.set(g.slug, g.type);
    }
  }

  return rows.map((r) => ({
    ...r,
    invited_type: r.guest_slug ? typeBySlug.get(r.guest_slug) ?? null : null,
  }));
}

export type CreateRsvpInput = {
  guest_slug: string | null;
  guest_name: string;
  attendance: NonNullable<Rsvp["attendance"]>;
  guest_count: number;
  // `event` is intentionally always null: we don't collect which event a guest
  // will attend (form omits it, per the design decision).
  message: string | null;
};

export async function createRsvp(input: CreateRsvpInput): Promise<Rsvp> {
  const { data, error } = await getSupabaseAdmin()
    .from("rsvp")
    .insert({ ...input, event: null })
    .select()
    .single();

  if (error) throw error;
  return data as Rsvp;
}
