import { listRsvps } from "@/lib/rsvp";

const ATTENDANCE_LABEL: Record<string, string> = {
  hadir: "Hadir",
  tidak_hadir: "Tidak Hadir",
  ragu: "Ragu-ragu",
};

// Guest invitation type → label shown in the "Acara" column. The RSVP form
// doesn't ask which event a guest will attend, so this reflects what they were
// invited to (resolved from the guests table via guest_slug).
const INVITED_TYPE_LABEL: Record<string, string> = {
  akad_resepsi: "Akad & Resepsi",
  resepsi: "Resepsi",
};

export default async function AdminRsvpPage() {
  const rsvps = await listRsvps();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">RSVP</h1>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not page navigation */}
        <a
          href="/api/export"
          className="rounded bg-ink px-4 py-2 text-sm text-white"
        >
          Export ke Excel
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-ink/60">
              <th className="py-2 pr-4">Nama</th>
              <th className="py-2 pr-4">Kehadiran</th>
              <th className="py-2 pr-4">Jumlah</th>
              <th className="py-2 pr-4">Acara</th>
              <th className="py-2 pr-4">Waktu</th>
            </tr>
          </thead>
          <tbody>
            {rsvps.map((rsvp) => (
              <tr key={rsvp.id} className="border-b border-ink/5">
                <td className="py-2 pr-4">{rsvp.guest_name}</td>
                <td className="py-2 pr-4">
                  {rsvp.attendance ? ATTENDANCE_LABEL[rsvp.attendance] : "-"}
                </td>
                <td className="py-2 pr-4">{rsvp.guest_count ?? "-"}</td>
                <td className="py-2 pr-4">
                  {rsvp.invited_type
                    ? INVITED_TYPE_LABEL[rsvp.invited_type]
                    : "-"}
                </td>
                <td className="py-2 pr-4 text-ink/50">
                  {new Date(rsvp.created_at).toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
            {rsvps.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-ink/50">
                  Belum ada RSVP.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
