'use client'

import { useState } from 'react'
import { Copy } from 'lucide-react'

type CopyLinkButtonProps = {
  link: string
}

export default function CopyLinkButton({ link }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Gagal menyalin link:', error)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
    >
      <Copy className="w-4 h-4" />
      {copied ? 'Disalin!' : 'Salin Link'}
    </button>
  )
}
