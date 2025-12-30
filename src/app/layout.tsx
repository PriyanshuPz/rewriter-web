import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";

const fonts = Noto_Sans({
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
      <body className={`${fonts.className} antialiased`}>{children}</body>
    </html>
  );
}
