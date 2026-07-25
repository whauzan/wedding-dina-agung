import { listRsvps } from "@/lib/rsvp";

const ATTENDANCE_LABEL: Record<string, string> = {
  hadir: "Hadir",
  tidak_hadir: "Tidak Hadir",
  ragu: "Ragu-ragu",
};

// Attendance → pill variant so status reads at a glance in the table.
const ATTENDANCE_PILL: Record<string, string> = {
  hadir: "admin-pill admin-pill--ok",
  tidak_hadir: "admin-pill admin-pill--danger",
  ragu: "admin-pill admin-pill--warn",
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
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="admin-eyebrow">Konfirmasi kehadiran</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-(--admin-ink)">
            RSVP
          </h1>
          <p className="mt-1 text-sm text-(--admin-muted)">
            {rsvps.length} respons
          </p>
        </div>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not page navigation */}
        <a href="/api/export" className="admin-btn admin-btn--accent">
          Export ke Excel
        </a>
      </div>

      <div className="admin-card overflow-x-auto">
        <table className="admin-table min-w-max">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Kehadiran</th>
              <th>Jumlah</th>
              <th>Acara</th>
              <th>Waktu</th>
            </tr>
          </thead>
          <tbody>
            {rsvps.map((rsvp) => (
              <tr key={rsvp.id}>
                <td className="font-medium text-(--admin-ink)">
                  {rsvp.guest_name}
                </td>
                <td>
                  {rsvp.attendance ? (
                    <span className={ATTENDANCE_PILL[rsvp.attendance]}>
                      {ATTENDANCE_LABEL[rsvp.attendance]}
                    </span>
                  ) : (
                    <span className="text-(--admin-faint)">—</span>
                  )}
                </td>
                <td className="admin-num">{rsvp.guest_count ?? "-"}</td>
                <td>
                  {rsvp.invited_type ? (
                    <span className="admin-pill">
                      {INVITED_TYPE_LABEL[rsvp.invited_type]}
                    </span>
                  ) : (
                    <span className="text-(--admin-faint)">—</span>
                  )}
                </td>
                <td className="admin-num text-(--admin-muted)">
                  {new Date(rsvp.created_at).toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
            {rsvps.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-(--admin-muted)">
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
