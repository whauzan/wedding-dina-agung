import "server-only";
import { getSupabaseAdmin } from "./supabase";
import { DEFAULT_WA_TEMPLATE } from "./wa";

const WA_TEMPLATE_KEY = "wa_template";

// Reads the admin-edited WhatsApp invite template from the settings table,
// falling back to the built-in default if the row is missing (e.g. before the
// seed migration runs).
export async function getWaTemplate(): Promise<string> {
  const { data, error } = await getSupabaseAdmin()
    .from("settings")
    .select("value")
    .eq("key", WA_TEMPLATE_KEY)
    .maybeSingle();

  if (error) throw error;
  return data?.value ?? DEFAULT_WA_TEMPLATE;
}

export async function setWaTemplate(value: string): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("settings")
    .upsert(
      { key: WA_TEMPLATE_KEY, value, updated_at: new Date().toISOString() },
      { onConflict: "key" },
    );

  if (error) throw error;
}
