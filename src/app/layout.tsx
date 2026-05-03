import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: 'swap',
});

import { db } from '@/lib/db'

// Cache favicon in memory — only re-fetched when server restarts
let cachedFavicon: string | null = null

async function getFavicon(): Promise<string> {
  if (cachedFavicon !== null) return cachedFavicon
  try {
    const setting = await db.globalSetting.findUnique({
      where: { id: 'global' },
      select: { landingPageFavicon: true },
    })
    cachedFavicon = setting?.landingPageFavicon || '/favicon-rose.svg'
  } catch {
    cachedFavicon = '/favicon-rose.svg'
  }
  return cachedFavicon
}

export async function generateMetadata(): Promise<Metadata> {
  const favicon = await getFavicon()

  return {
    metadataBase: new URL('https://katalog-id.vercel.app'),
    title: "Katalog Undanganku - Platform Undangan Pernikahan Digital Terbaik",
    description: "Buat undangan pernikahan digital yang elegan, modern, dan mudah dibagikan. Berbagai tema undangan dengan fitur lengkap untuk momen spesial Anda.",
    keywords: ["Undangan Pernikahan Digital", "Wedding Invitation", "Undangan Online", "Undangan Pernikahan", "Digital Wedding", "Wedding Invitation Indonesia"],
    authors: [{ name: "Katalog Undanganku Team" }],
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
    openGraph: {
      title: "Katalog Undanganku - Undangan Pernikahan Digital",
      description: "Buat undangan pernikahan digital yang elegan dan modern dengan berbagai pilihan tema",
      url: "/",
      siteName: "Katalog Undanganku",
      type: "website",
      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
          alt: "Katalog Undanganku - Undangan Pernikahan Digital",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Katalog Undanganku - Undangan Pernikahan Digital",
      description: "Platform undangan pernikahan digital terbaik di Indonesia",
      images: ["/logo.png"],
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* Defer heavy external scripts until after page load to avoid blocking render */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', function() {
                var s1 = document.createElement('script');
                s1.src = 'https://cdn.lordicon.com/lordicon.js';
                s1.async = true;
                document.head.appendChild(s1);

                var s2 = document.createElement('script');
                s2.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
                s2.type = 'module';
                s2.async = true;
                document.head.appendChild(s2);
              });
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
