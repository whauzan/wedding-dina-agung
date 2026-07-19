import "server-only";
import { getSupabaseAdmin } from "./supabase";

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

export async function listRsvps(): Promise<Rsvp[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("rsvp")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Rsvp[];
}
