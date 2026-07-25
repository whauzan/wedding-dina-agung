export default function InviteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-120 flex-col bg-slate">
      <div className="invite-texture" aria-hidden="true" />
      {children}
    </div>
  );
}
