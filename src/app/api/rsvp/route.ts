import { assertAdminApi } from "@/lib/auth";
import { createRsvp, listRsvps } from "@/lib/rsvp";

const ATTENDANCE = ["hadir", "tidak_hadir", "ragu"] as const;
type Attendance = (typeof ATTENDANCE)[number];

export async function GET() {
  const unauthorized = await assertAdminApi();
  if (unauthorized) return unauthorized;

  const rsvps = await listRsvps();
  return Response.json(rsvps);
}

// Public — guest-facing RSVP submission. Append-only (multiple submissions
// allowed). The API route is the trust boundary: it validates input, so the
// insert can safely use the service role.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const guestName =
    typeof body?.guest_name === "string" ? body.guest_name.trim() : "";
  const attendance = body?.attendance as Attendance;
  const guestCount = Number(body?.guest_count);
  const guestSlug =
    typeof body?.guest_slug === "string" && body.guest_slug.trim()
      ? body.guest_slug.trim()
      : null;
  const message =
    typeof body?.message === "string" && body.message.trim()
      ? body.message.trim()
      : null;

  if (!guestName) {
    return Response.json({ error: "Nama wajib diisi" }, { status: 400 });
  }
  if (!ATTENDANCE.includes(attendance)) {
    return Response.json({ error: "Konfirmasi kehadiran tidak valid" }, { status: 400 });
  }
  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 2) {
    return Response.json({ error: "Jumlah kehadiran tidak valid" }, { status: 400 });
  }

  const rsvp = await createRsvp({
    guest_slug: guestSlug,
    guest_name: guestName,
    attendance,
    guest_count: guestCount,
    message,
  });

  return Response.json(rsvp, { status: 201 });
}
