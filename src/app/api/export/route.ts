import * as XLSX from "xlsx";
import { assertAdminApi } from "@/lib/auth";
import { listRsvps } from "@/lib/rsvp";

export async function GET() {
  const unauthorized = await assertAdminApi();
  if (unauthorized) return unauthorized;

  const rsvps = await listRsvps();

  const rows = rsvps.map((rsvp) => ({
    name: rsvp.guest_name,
    attendance: rsvp.attendance,
    guest_count: rsvp.guest_count,
    event: rsvp.event,
    message: rsvp.message,
    created_at: rsvp.created_at,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "RSVP");
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="rsvp.xlsx"',
    },
  });
}
