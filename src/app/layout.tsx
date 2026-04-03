import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UndanganSamawa - Platform Undangan Pernikahan Digital Terbaik",
  description: "Buat undangan pernikahan digital yang elegan, modern, dan mudah dibagikan. Berbagai tema undangan dengan fitur lengkap untuk momen spesial Anda.",
  keywords: ["Undangan Pernikahan Digital", "Wedding Invitation", "Undangan Online", "Undangan Pernikahan", "Digital Wedding", "Wedding Invitation Indonesia"],
  authors: [{ name: "UndanganSamawa Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "UndanganSamawa - Undangan Pernikahan Digital",
    description: "Buat undangan pernikahan digital yang elegan dan modern dengan berbagai pilihan tema",
    url: "https://undangansamawa.com",
    siteName: "UndanganSamawa",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UndanganSamawa - Undangan Pernikahan Digital",
    description: "Platform undangan pernikahan digital terbaik di Indonesia",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
