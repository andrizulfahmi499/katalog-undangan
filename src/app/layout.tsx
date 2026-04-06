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
  title: "Katalog Undanganku - Platform Undangan Pernikahan Digital Terbaik",
  description: "Buat undangan pernikahan digital yang elegan, modern, dan mudah dibagikan. Berbagai tema undangan dengan fitur lengkap untuk momen spesial Anda.",
  keywords: ["Undangan Pernikahan Digital", "Wedding Invitation", "Undangan Online", "Undangan Pernikahan", "Digital Wedding", "Wedding Invitation Indonesia"],
  authors: [{ name: "Katalog Undanganku Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Katalog Undanganku - Undangan Pernikahan Digital",
    description: "Buat undangan pernikahan digital yang elegan dan modern dengan berbagai pilihan tema",
    url: "https://katalog-undangan-beta.vercel.app",
    siteName: "Katalog Undanganku",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Katalog Undanganku - Undangan Pernikahan Digital",
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
