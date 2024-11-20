import type { Metadata } from "next";
import "./globals.css";

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
      </body>
    </html>
  );
}
