import { assertAdminApi } from "@/lib/auth";
import { listRsvps } from "@/lib/rsvp";

export async function GET() {
  const unauthorized = await assertAdminApi();
  if (unauthorized) return unauthorized;

  const rsvps = await listRsvps();
  return Response.json(rsvps);
}
