import { listGuests } from "@/lib/guests";
import { getWaTemplate } from "@/lib/settings";
import { GuestManager } from "./_components/GuestManager";

export default async function AdminGuestsPage() {
  const [guests, waTemplate] = await Promise.all([
    listGuests(),
    getWaTemplate(),
  ]);

  const withoutPhone = guests.filter((g) => !g.phone).length;

  return (
    <div>
      <div className="mb-6">
        <p className="admin-eyebrow">Kelola undangan</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-(--admin-ink)">
          Daftar Tamu
        </h1>
        <p className="mt-1 text-sm text-(--admin-muted)">
          {guests.length} tamu
          {withoutPhone > 0 && ` · ${withoutPhone} belum ada WhatsApp`}
        </p>
      </div>
      <GuestManager guests={guests} waTemplate={waTemplate} />
    </div>
  );
}
