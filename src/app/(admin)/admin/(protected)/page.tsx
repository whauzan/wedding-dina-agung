import { listGuests } from "@/lib/guests";
import { getWaTemplate } from "@/lib/settings";
import { GuestManager } from "./_components/GuestManager";

export default async function AdminGuestsPage() {
  const [guests, waTemplate] = await Promise.all([
    listGuests(),
    getWaTemplate(),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-ink">Daftar Tamu</h1>
      <GuestManager guests={guests} waTemplate={waTemplate} />
    </div>
  );
}
