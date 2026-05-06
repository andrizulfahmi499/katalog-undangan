'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type ThemeMode = 'default' | 'light' | 'cleanapp'

interface ThemeContextType {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  isLight: boolean
  isCleanApp: boolean
  favicon: string
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface GlobalSettings {
  theme: ThemeMode
  favicon: string
}

async function fetchGlobalSettings(): Promise<GlobalSettings> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)

    const res = await fetch('/api/public/settings', {
      signal: controller.signal,
      cache: 'no-store',
    })
    clearTimeout(timeoutId)

    const data = await res.json()
    if (data.success && data.data) {
      return {
        theme: (data.data.landingPageTheme || 'default') as ThemeMode,
        favicon: data.data.landingPageFavicon || '/favicon-rose.svg',
      }
    }
    return { theme: 'default', favicon: '/favicon-rose.svg' }
  } catch {
    return { theme: 'default', favicon: '/favicon-rose.svg' }
  }
}

/** Update semua <link rel="icon"> di <head> secara dinamis */
function applyFavicon(faviconUrl: string) {
  if (typeof document === 'undefined') return

  const selectors = [
    'link[rel="icon"]',
    'link[rel="shortcut icon"]',
    'link[rel="apple-touch-icon"]',
  ]

  selectors.forEach((selector) => {
    let link = document.querySelector(selector) as HTMLLinkElement | null
    if (link) {
      link.href = faviconUrl
    } else {
      link = document.createElement('link')
      const rel = selector.match(/rel="([^"]+)"/)?.[1] || 'icon'
      link.rel = rel
      link.href = faviconUrl
      document.head.appendChild(link)
    }
  })
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('default')
  const [favicon, setFavicon] = useState<string>('/favicon-rose.svg')

  useEffect(() => {
    fetchGlobalSettings().then(({ theme: t, favicon: f }) => {
      setThemeState(t)
      setFavicon(f)
    })
  }, [])

  // Terapkan favicon ke DOM setiap kali berubah
  useEffect(() => {
    applyFavicon(favicon)
  }, [favicon])

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'default' ? 'light' : 'default'
    setTheme(newTheme)
  }

  const isLight = theme === 'light'
  const isCleanApp = theme === 'cleanapp'

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isLight, isCleanApp, favicon }}>
      <div className={`theme-transition ${isLight ? 'theme-light' : isCleanApp ? 'theme-cleanapp' : 'theme-default'}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

const defaultThemeContext: ThemeContextType = {
  theme: 'default',
  setTheme: () => {},
  toggleTheme: () => {},
  isLight: false,
  isCleanApp: false,
  favicon: '/favicon-rose.svg',
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    return defaultThemeContext
  }
  return context
}

