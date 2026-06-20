'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface CollapsibleSectionProps {
  icon: React.ReactNode
  title: string
  subtitle?: string
  defaultOpen?: boolean
  children: React.ReactNode
  badge?: string
}

export default function CollapsibleSection({
  icon,
  title,
  subtitle,
  defaultOpen = false,
  children,
  badge,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="bg-white rounded-xl border border-[#E8E0D4] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#FAFAF8] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#3A5A40]/10 flex items-center justify-center text-[#3A5A40]">
            {icon}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#2D2D2D] text-sm">{title}</span>
              {badge && (
                <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full">{badge}</span>
              )}
            </div>
            {subtitle && <span className="text-xs text-[#8B7E6F]">{subtitle}</span>}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-[#8B7E6F] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="px-5 pb-5 border-t border-[#F0EBE3]">
          <div className="pt-4">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
