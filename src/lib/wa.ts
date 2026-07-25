// WhatsApp invite message template helpers. Client-safe (no server-only import)
// so the admin's live preview and the "Kirim WA" action can render the same
// message the server would. The template is stored in the `settings` table
// (key `wa_template`) and edited from /admin; this constant is the fallback/seed.
export const DEFAULT_WA_TEMPLATE = [
  "Assalamu'alaikum Wr. Wb.",
  "",
  "Halo {Nama}, dengan penuh kebahagiaan kami mengundang Anda ke pernikahan kami:",
  "",
  "Agung Nugroho & Yudia Putri M.",
  "",
  "Detail & konfirmasi kehadiran:",
  "{link}",
  "",
  "Merupakan kehormatan bagi kami atas kehadiran Anda. Terima kasih 🤍",
].join("\n");

// Substitute the per-guest placeholders. {Nama} = guest name, {link} = invite
// URL. Both tokens may appear any number of times (or not at all).
export function renderWaMessage(
  template: string,
  guestName: string,
  inviteUrl: string,
): string {
  return template
    .replaceAll("{Nama}", guestName)
    .replaceAll("{link}", inviteUrl);
}
