'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check, MessageCircle, ExternalLink, QrCode } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'

type SendInvitationModalProps = {
  isOpen: boolean
  onClose: () => void
  invitationLink: string
  invitationTitle?: string
  templateMessage?: string
}

export default function SendInvitationModal({
  isOpen,
  onClose,
  invitationLink,
  invitationTitle = 'Undangan Digital',
  templateMessage = 'Kepada Yth.\n*{nama_tamu}*\n\nDengan hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara kami.\n\nSilakan buka undangan digital Anda di tautan berikut:\n{link_undangan}\n\nMerupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir. Terima kasih.',
}: SendInvitationModalProps) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'link' | 'whatsapp' | 'qr'>('link')

  if (!isOpen) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(invitationLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  const whatsappText = encodeURIComponent(
    templateMessage
      .replace('{nama_tamu}', 'Tamu Undangan')
      .replace('{link_undangan}', invitationLink)
  )
  const whatsappUrl = `https://wa.me/?text=${whatsappText}`

  const TABS = [
    { id: 'link', label: 'Salin Link', icon: Copy },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
    { id: 'qr', label: 'QR Code', icon: QrCode },
  ] as const

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-lg flex flex-col overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Kirim Undangan</h2>
              <p className="text-sm text-slate-500 mt-1 truncate max-w-xs">{invitationTitle}</p>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-100 px-6">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Tab: Salin Link */}
            {activeTab === 'link' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Link Undangan</label>
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="flex-1 text-sm text-slate-600 truncate font-mono">{invitationLink || 'Link belum tersedia'}</p>
                    <button
                      onClick={handleCopy}
                      disabled={!invitationLink}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        copied
                          ? 'bg-emerald-500 text-white'
                          : 'bg-pink-500 hover:bg-pink-600 text-white'
                      } disabled:opacity-50`}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Tersalin!' : 'Salin'}
                    </button>
                  </div>
                </div>

                <a
                  href={invitationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 border border-slate-200 rounded-2xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Buka di Tab Baru
                </a>
              </motion.div>
            )}

            {/* Tab: WhatsApp */}
            {activeTab === 'whatsapp' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Preview Pesan WhatsApp</label>
                  <div className="p-4 bg-[#e1f5c4] rounded-2xl border border-[#c5e8a0] text-sm text-slate-700 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                    {templateMessage
                      .replace('{nama_tamu}', 'Tamu Undangan')
                      .replace('{link_undangan}', invitationLink)}
                  </div>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl text-sm font-semibold transition-colors shadow-lg shadow-green-500/20"
                >
                  <MessageCircle className="w-5 h-5" />
                  Buka WhatsApp & Kirim
                </a>
              </motion.div>
            )}

            {/* Tab: QR Code */}
            {activeTab === 'qr' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
                {invitationLink ? (
                  <>
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                      <QRCodeCanvas
                        value={invitationLink}
                        size={200}
                        level="H"
                        includeMargin
                      />
                    </div>
                    <p className="text-sm text-slate-500 text-center">Scan QR Code ini untuk membuka undangan digital</p>
                    <button
                      onClick={() => {
                        const canvas = document.querySelector('canvas')
                        if (canvas) {
                          const link = document.createElement('a')
                          link.download = `qr-${invitationTitle}.png`
                          link.href = canvas.toDataURL()
                          link.click()
                        }
                      }}
                      className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors"
                    >
                      Download QR Code
                    </button>
                  </>
                ) : (
                  <div className="py-10 text-center text-slate-500">
                    <QrCode className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Simpan undangan terlebih dahulu untuk membuat QR Code.</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
