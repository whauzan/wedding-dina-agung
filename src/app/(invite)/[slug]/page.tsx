import { EnvelopeGate } from "../_components/EnvelopeGate";
import { getGuestBySlug, FALLBACK_GUEST } from "@/lib/guests";

// Guest data (name + variant) is effectively static once created, so serve it
// from cache and refresh in the background rather than hitting Supabase on every
// open — a shared/viral link can hammer the same slug. Slugs are immutable, so
// links never break; a rename just takes up to `revalidate`s to show its new
// name. Unknown slugs still fall back to FALLBACK_GUEST below.
export const revalidate = 300;

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
