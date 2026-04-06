import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Portal Input Tamu',
  description: 'Masuk ke portal input tamu untuk mengisi atau melihat undangan digital Anda.',
  openGraph: {
    title: 'Portal Input Tamu',
    description: 'Masuk ke portal input tamu untuk mengisi atau melihat undangan digital Anda.',
    url: 'https://katalog-undangan-beta.vercel.app/login',
    siteName: 'Portal Input Tamu',
    type: 'website',
    images: [
      {
        url: '/login-share.svg',
        width: 1200,
        height: 630,
        alt: 'Portal Input Tamu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portal Input Tamu',
    description: 'Masuk ke portal input tamu untuk mengisi atau melihat undangan digital Anda.',
    images: ['/login-share.svg'],
  },
}

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
