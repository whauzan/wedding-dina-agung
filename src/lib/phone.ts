// Normalize an Indonesian phone number to WhatsApp's wa.me format: digits
// only, international country code, no leading "+". Handles the common ways an
// admin might type a number:
//   0812-3456-7890   -> 6281234567890
//   +62 812 3456 7890 -> 6281234567890
//   62 812 3456 7890  -> 6281234567890
//   812 3456 7890     -> 6281234567890 (assume Indonesian mobile, prepend 62)
// Returns null for empty/junk input so callers can store null and hide the
// "Kirim WA" action for guests without a usable number.
export function normalizePhone(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Keep only digits (drops +, spaces, dashes, parens).
  let digits = trimmed.replace(/\D/g, "");
  if (!digits) return null;

  if (digits.startsWith("0")) {
    // Local format: replace the leading 0 with the country code.
    digits = `62${digits.slice(1)}`;
  } else if (!digits.startsWith("62")) {
    // Bare mobile number without country code (e.g. "812..."): assume Indonesia.
    digits = `62${digits}`;
  }

  // A valid ID mobile in wa.me form is roughly 62 + 9–12 digits. Guard against
  // obviously-too-short input so we don't store a broken link target.
  if (digits.length < 10) return null;

  return digits;
}
