import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LexiCore",
  description: "Thai law practice prototype for issue spotting and IRAC-style answer drafting."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
