export default function InviteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-120 flex-col">
      {children}
    </div>
  );
}
