import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TJKT System",
  description: "Sistem Peminjaman Alat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}