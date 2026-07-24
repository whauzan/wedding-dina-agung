import type { Metadata } from "next";
import { Cormorant_Garamond, Prata } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const prata = Prata({
  variable: "--font-prata",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Agung & Yudia — Undangan Pernikahan",
  description: "Undangan digital pernikahan Agung Nugroho & Yudia Putri M.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${cormorant.variable} ${prata.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-cream text-text-primary">{children}</body>
    </html>
  );
}
