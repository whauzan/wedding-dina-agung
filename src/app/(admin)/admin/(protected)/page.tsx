import { listGuests } from "@/lib/guests";
import { GuestManager } from "./_components/GuestManager";

export default async function AdminGuestsPage() {
  const guests = await listGuests();

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-ink">Daftar Tamu</h1>
      <GuestManager guests={guests} />
    </div>
  );
}
