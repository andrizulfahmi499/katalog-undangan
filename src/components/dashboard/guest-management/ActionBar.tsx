'use client'

import React from 'react'
import { Sparkles, Settings2, QrCode } from 'lucide-react'
import { motion } from 'framer-motion'

interface Props {
  onOpenAI: () => void
  onOpenSessions: () => void
  onOpenQRIS: () => void
}

export default function ActionBar({ onOpenAI, onOpenSessions, onOpenQRIS }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <motion.button 
        onClick={onOpenAI}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm hover:border-pink-300 hover:text-pink-600 transition-colors"
      >
        <Sparkles className="w-4 h-4 text-pink-500" />
        AI Greeting Generator
      </motion.button>
      
      <motion.button 
        onClick={onOpenSessions}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm hover:border-blue-300 hover:text-blue-600 transition-colors"
      >
        <Settings2 className="w-4 h-4 text-blue-500" />
        Pengaturan Sesi & Kuota
      </motion.button>
      
      <motion.button 
        onClick={onOpenQRIS}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm hover:border-emerald-300 hover:text-emerald-600 transition-colors"
      >
        <QrCode className="w-4 h-4 text-emerald-500" />
        QRIS & Gift Registry
      </motion.button>
    </div>
  )
}
