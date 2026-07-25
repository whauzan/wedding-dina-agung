// Layout for the whole admin area (login + protected dashboard). The invite
// side keeps Cormorant as the <body> default; here we switch the subtree to
// Inter via the --font-inter variable set on <html> in the root layout.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="font-inter">{children}</div>;
}
