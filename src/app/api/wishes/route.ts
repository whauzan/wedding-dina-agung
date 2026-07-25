import { createWish, listWishes } from "@/lib/wishes";

const MAX_LIMIT = 50;
const MAX_MESSAGE = 500;
const MAX_NAME = 80;

// Public — paginated read of the wishes wall (newest first).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const limitRaw = Number(searchParams.get("limit"));
  const offsetRaw = Number(searchParams.get("offset"));
  const limit =
    Number.isInteger(limitRaw) && limitRaw > 0
      ? Math.min(limitRaw, MAX_LIMIT)
      : 20;
  const offset = Number.isInteger(offsetRaw) && offsetRaw > 0 ? offsetRaw : 0;

  const { wishes, total } = await listWishes(limit, offset);
  return Response.json({ wishes, total });
}

// Public — submit a wish. The API route validates input; the insert uses the
// service role (same trust-boundary pattern as the rest of the app).
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  const guestSlug =
    typeof body?.guest_slug === "string" && body.guest_slug.trim()
      ? body.guest_slug.trim()
      : null;

  if (!name || name.length > MAX_NAME) {
    return Response.json({ error: "Nama tidak valid" }, { status: 400 });
  }
  if (!message || message.length > MAX_MESSAGE) {
    return Response.json({ error: "Ucapan tidak valid" }, { status: 400 });
  }

  const wish = await createWish({ name, message, guest_slug: guestSlug });
  return Response.json(wish, { status: 201 });
}
