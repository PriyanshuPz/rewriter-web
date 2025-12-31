import type { Metadata } from "next";
import { Fira_Sans } from "next/font/google";
import "./globals.css";
import ModalsProvider from "@/providers/modals";
import QueryProvider from "@/providers/query";

const fonts = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "700", "900", "800"],
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
      <body className={`${fonts.className} antialiased`}>
        <QueryProvider>
          {children}
          <ModalsProvider />
        </QueryProvider>
      </body>
    </html>
  );
}
