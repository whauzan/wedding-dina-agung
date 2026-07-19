import Link from "next/link";
import { assertAdminPage } from "@/lib/auth";
import { LogoutButton } from "./_components/LogoutButton";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertAdminPage();

  return (
    <div className="mx-auto min-h-screen w-full max-w-4xl px-6 py-8">
      <header className="mb-8 flex items-center justify-between border-b border-ink/10 pb-4">
        <nav className="flex items-center gap-4">
          <Link href="/admin" className="font-semibold text-ink">
            Tamu
          </Link>
          <Link href="/admin/rsvp" className="text-sm text-ink/70 hover:text-ink">
            RSVP
          </Link>
        </nav>
        <LogoutButton />
      </header>
      {children}
    </div>
  );
}
