import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import font from "../utils/fonts";
import { clsx } from "clsx";

export const metadata: Metadata = {
  title: "Pomelo",
  description: "View your transactions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(font.Fuscat)}>{children}</body>
    </html>
  );
}
