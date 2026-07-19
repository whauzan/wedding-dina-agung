export function slugifyBase(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function generateUniqueSlug(
  name: string,
  slugExists: (candidate: string) => Promise<boolean>,
): Promise<string> {
  const base = slugifyBase(name) || "tamu";

  let candidate = base;
  let suffix = 2;
  while (await slugExists(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}
