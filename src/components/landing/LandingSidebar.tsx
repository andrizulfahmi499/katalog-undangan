'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight, Grid3X3, HelpCircle, Home, Layers3, Menu, ShoppingBag, Sparkles, UserRound } from 'lucide-react'
import { LordIcon } from './LordIcon'

interface SidebarItem {
  id: string
  label: string
  href?: string
  icon: React.ReactNode
  children?: Array<{
    label: string
    href: string
    type: 'link'
    icon: React.ReactNode
  }>
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'login',
    label: 'Login',
    icon: <UserRound className="h-5 w-5" />,
    children: [
      {
        label: 'Admin',
        href: '/login?role=admin',
        type: 'link',
        icon: (
          <LordIcon
            src="https://cdn.lordicon.com/hroklero.json"
            trigger="hover"
            state="hover-looking-around"
            size={26}
          />
        ),
      },
      {
        label: 'Member',
        href: '/login?role=member',
        type: 'link',
        icon: (
          <LordIcon
            src="https://cdn.lordicon.com/hroklero.json"
            trigger="morph"
            state="morph-group"
            size={26}
          />
        ),
      },
    ],
  },
  { id: 'home', label: 'Home', href: '#home', icon: <Home className="h-5 w-5" /> },
  { id: 'order-form', label: 'Order', href: '#order-form', icon: <ShoppingBag className="h-5 w-5" /> },
  { id: 'features', label: 'Fitur', href: '#features', icon: <Sparkles className="h-5 w-5" /> },
  { id: 'catalog', label: 'Katalog', href: '#catalog', icon: <Grid3X3 className="h-5 w-5" /> },
  { id: 'pricing', label: 'Harga', href: '#pricing', icon: <Layers3 className="h-5 w-5" /> },
  { id: 'faq', label: 'FAQ', href: '#faq', icon: <HelpCircle className="h-5 w-5" /> },
]

export function LandingSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(true)

  const handleSectionClick = (href?: string) => {
    if (!href?.startsWith('#')) return

    const section = document.getElementById(href.slice(1))
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <aside
      className={`fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 xl:flex flex-col rounded-[28px] border border-white/70 bg-[#dfe5ec]/95 p-3 text-[#4b5563] shadow-[14px_14px_28px_#bec6d1,-14px_-14px_28px_#ffffff] backdrop-blur-md transition-all duration-300 ${
        isCollapsed ? 'w-[92px]' : 'w-[284px]'
      }`}
    >
      <div className="mb-3 flex items-center justify-between rounded-[22px] bg-[#e8edf3] px-4 py-4 shadow-[inset_4px_4px_10px_#c8d0db,inset_-4px_-4px_10px_#ffffff]">
        {!isCollapsed && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8b8fa3]">
              Navigasi
            </p>
            <h3 className="text-lg font-bold text-[#2d3748]">Landing Page</h3>
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e0e5ec] text-[#64748b] shadow-[5px_5px_12px_#bec6d1,-5px_-5px_12px_#ffffff] transition hover:text-[#2d3748]"
          aria-label={isCollapsed ? 'Buka sidebar' : 'Tutup sidebar'}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex flex-col gap-2">
        {sidebarItems.map((item) => {
          if (item.children) {
            return (
              <div key={item.id} className="rounded-[22px] bg-[#e0e5ec] p-2 shadow-[6px_6px_14px_#c4ccd7,-6px_-6px_14px_#ffffff]">
                <button
                  type="button"
                  onClick={() => setIsLoginOpen((prev) => !prev)}
                  className="flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left text-[#526071] transition hover:bg-white/60"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e7ecf2] text-[#8b8fa3] shadow-[inset_3px_3px_8px_#c5ced8,inset_-3px_-3px_8px_#ffffff]">
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-sm font-semibold tracking-wide">{item.label}</span>
                      {isLoginOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </>
                  )}
                </button>

                {!isCollapsed && isLoginOpen && (
                  <div className="mt-2 space-y-2 pl-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="flex items-center gap-3 rounded-[18px] px-3 py-3 text-sm font-medium text-[#4b5563] transition hover:bg-white/70"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/70 shadow-[3px_3px_8px_#cfd7e2,-3px_-3px_8px_#ffffff]">
                          {child.icon}
                        </span>
                        <span>{child.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSectionClick(item.href)}
              className="group flex items-center gap-3 rounded-[22px] bg-[#e0e5ec] px-3 py-3 text-left text-[#526071] shadow-[6px_6px_14px_#c4ccd7,-6px_-6px_14px_#ffffff] transition hover:bg-[#eef2f7] hover:text-[#2d3748]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e7ecf2] text-[#8b8fa3] shadow-[inset_3px_3px_8px_#c5ced8,inset_-3px_-3px_8px_#ffffff] transition group-hover:text-[#7c8298]">
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="text-sm font-semibold tracking-wide">{item.label}</span>
              )}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
