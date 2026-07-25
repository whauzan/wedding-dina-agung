import { EnvelopeGate } from "../_components/EnvelopeGate";
import { getGuestBySlug, FALLBACK_GUEST } from "@/lib/guests";

export const dynamic = "force-dynamic";

export default async function GuestInvitePage({
  params,
}: PageProps<"/[slug]">) {
  const { slug } = await params;
  const guest = (await getGuestBySlug(slug)) ?? FALLBACK_GUEST;

  return (
    <EnvelopeGate
      guestName={guest.name}
      guestType={guest.type}
      guestSlug={slug}
    />
  );
}
