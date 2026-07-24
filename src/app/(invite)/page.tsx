import { EnvelopeGate } from "./_components/EnvelopeGate";
import { FALLBACK_GUEST } from "@/lib/guests";

export default function Home() {
  return (
    <EnvelopeGate
      guestName={FALLBACK_GUEST.name}
      guestType={FALLBACK_GUEST.type}
    />
  );
}
