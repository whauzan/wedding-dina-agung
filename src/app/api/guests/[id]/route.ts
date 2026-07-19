import { assertAdminApi } from "@/lib/auth";
import { deleteGuest, updateGuest, type GuestType } from "@/lib/guests";

const VALID_TYPES: GuestType[] = ["akad_resepsi", "resepsi"];

export async function PATCH(
  request: Request,
  { params }: RouteContext<"/api/guests/[id]">,
) {
  const unauthorized = await assertAdminApi();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const type = body?.type;

  if (!name) {
    return Response.json({ error: "Name is required" }, { status: 400 });
  }
  if (!VALID_TYPES.includes(type)) {
    return Response.json({ error: "Invalid guest type" }, { status: 400 });
  }

  const guest = await updateGuest(id, { name, type });
  return Response.json(guest);
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext<"/api/guests/[id]">,
) {
  const unauthorized = await assertAdminApi();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await deleteGuest(id);
  return Response.json({ ok: true });
}
