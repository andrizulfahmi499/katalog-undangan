import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Editor Undangan v2 - Buat Undangan Pernikahan Digital',
  description: 'Buat undangan pernikahan digital yang elegan dengan editor undangan v2',
}

export default function V2Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {children}
    </div>
  )
}
