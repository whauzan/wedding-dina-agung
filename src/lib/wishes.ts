import "server-only";
import { getSupabaseAdmin } from "./supabase";

export type Wish = {
  id: string;
  created_at: string;
  name: string;
  message: string;
  guest_slug: string | null;
};

/** The subset of a wish the public wall renders. */
export type PublicWish = Pick<Wish, "id" | "name" | "message">;

export type CreateWishInput = {
  name: string;
  message: string;
  guest_slug: string | null;
};

/** Public wishes wall — newest first, paginated. Selects only the columns the
 *  wall renders (no `count: "exact"` — the client has no pagination and never
 *  read `total`, so a full-table count scan on every public load was wasted). */
export async function listWishes(
  limit = 20,
  offset = 0,
): Promise<{ wishes: PublicWish[] }> {
  const { data, error } = await getSupabaseAdmin()
    .from("wishes")
    .select("id, name, message")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { wishes: (data ?? []) as PublicWish[] };
}

export async function createWish(input: CreateWishInput): Promise<Wish> {
  const { data, error } = await getSupabaseAdmin()
    .from("wishes")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as Wish;
}
