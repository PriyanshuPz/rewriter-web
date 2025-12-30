import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const fonts = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rewriter",
  description: "NOT, Another platform for writer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fonts.variable} antialiased`}>{children}</body>
    </html>
  );
}
