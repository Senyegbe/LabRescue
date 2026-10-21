import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LabRescue — Every lesson deserves a chance",
  description:
    "Safe classroom equipment checks, no-equipment lesson activities, and clear technician handoffs.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
