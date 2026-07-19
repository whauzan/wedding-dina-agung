import { assertAdminApi } from "@/lib/auth";
import { createGuest, listGuests, type GuestType } from "@/lib/guests";

const VALID_TYPES: GuestType[] = ["akad_resepsi", "resepsi"];

export async function GET() {
  const unauthorized = await assertAdminApi();
  if (unauthorized) return unauthorized;

  const guests = await listGuests();
  return Response.json(guests);
}

export async function POST(request: Request) {
  const unauthorized = await assertAdminApi();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const type = body?.type;

  if (!name) {
    return Response.json({ error: "Name is required" }, { status: 400 });
  }
  if (!VALID_TYPES.includes(type)) {
    return Response.json({ error: "Invalid guest type" }, { status: 400 });
  }

  // Slug uniqueness is enforced by the DB; retry once if a concurrent
  // create raced us for the same slug (Postgres unique_violation = 23505).
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const guest = await createGuest({ name, type });
      return Response.json(guest, { status: 201 });
    } catch (error) {
      const isUniqueViolation =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "23505";

      if (!isUniqueViolation || attempt === 2) throw error;
    }
  }

  return Response.json({ error: "Failed to create guest" }, { status: 500 });
}
