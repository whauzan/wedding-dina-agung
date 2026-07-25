import "server-only";
import { getSupabaseAdmin } from "./supabase";
import { generateUniqueSlug } from "./slug";

export type GuestType = "akad_resepsi" | "resepsi";

export type Guest = {
  id: string;
  created_at: string;
  name: string;
  type: GuestType;
  slug: string;
  phone: string | null;
};

export const FALLBACK_GUEST: Pick<Guest, "name" | "type"> = {
  name: "Tamu",
  type: "resepsi",
};

export async function listGuests(): Promise<Guest[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("guests")
    .select("id, created_at, name, type, slug, phone")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Guest[];
}

/** Resolve a slug to the fields the invite page renders (name + variant). The
 *  friendly-fallback guest is the same shape, so callers never need the rest. */
export async function getGuestBySlug(
  slug: string,
): Promise<Pick<Guest, "name" | "type"> | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("guests")
    .select("name, type")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data as Pick<Guest, "name" | "type"> | null;
}

async function slugExists(slug: string): Promise<boolean> {
  const { data, error } = await getSupabaseAdmin()
    .from("guests")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data !== null;
}

export async function createGuest(input: {
  name: string;
  type: GuestType;
  phone: string | null;
}): Promise<Guest> {
  const slug = await generateUniqueSlug(input.name, slugExists);

  const { data, error } = await getSupabaseAdmin()
    .from("guests")
    .insert({ name: input.name, type: input.type, slug, phone: input.phone })
    .select()
    .single();

  if (error) throw error;
  return data as Guest;
}

export async function updateGuest(
  id: string,
  input: { name: string; type: GuestType; phone: string | null },
): Promise<Guest> {
  const { data, error } = await getSupabaseAdmin()
    .from("guests")
    .update({ name: input.name, type: input.type, phone: input.phone })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Guest;
}

export async function deleteGuest(id: string): Promise<void> {
  const { error } = await getSupabaseAdmin().from("guests").delete().eq("id", id);
  if (error) throw error;
}
