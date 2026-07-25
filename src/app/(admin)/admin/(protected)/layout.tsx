import { assertAdminPage } from "@/lib/auth";
import { AdminNav } from "./_components/AdminNav";
import { LogoutButton } from "./_components/LogoutButton";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertAdminPage();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-(--admin-border) bg-(--admin-surface-blur) backdrop-blur">
        <div className="mx-auto flex w-full max-w-240 items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-5">
            <span className="text-sm font-semibold tracking-tight text-(--admin-ink)">
              Undangan Admin
            </span>
            <AdminNav />
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[60rem] px-5 py-8">{children}</main>
    </div>
  );
}
