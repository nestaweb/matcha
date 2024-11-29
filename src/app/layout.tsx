import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "42Matcha",
  description: "Next Generation dating app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`scroll-smooth`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
