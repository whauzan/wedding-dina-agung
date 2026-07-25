import "server-only";
import { getSupabaseAdmin } from "./supabase";

export type Wish = {
  id: string;
  created_at: string;
  name: string;
  message: string;
  guest_slug: string | null;
};

export type CreateWishInput = {
  name: string;
  message: string;
  guest_slug: string | null;
};

/** Public wishes wall — newest first, paginated. */
export async function listWishes(
  limit = 20,
  offset = 0,
): Promise<{ wishes: Wish[]; total: number }> {
  const { data, error, count } = await getSupabaseAdmin()
    .from("wishes")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { wishes: (data ?? []) as Wish[], total: count ?? 0 };
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
