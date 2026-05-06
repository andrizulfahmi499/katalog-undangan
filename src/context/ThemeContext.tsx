'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type ThemeMode = 'default' | 'light' | 'cleanapp'

interface ThemeContextType {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  isLight: boolean
  isCleanApp: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

async function fetchGlobalTheme(): Promise<ThemeMode> {
  try {
    // AbortController dengan timeout 3 detik — jika API lambat, langsung pakai default
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)

    // Tidak menggunakan force-cache agar selalu mendapat nilai terbaru dari server
    const res = await fetch('/api/public/settings', {
      signal: controller.signal,
      cache: 'no-store',
    })
    clearTimeout(timeoutId)

    const data = await res.json()
    const theme = (data.success && data.data?.landingPageTheme
      ? data.data.landingPageTheme
      : 'default') as ThemeMode
    return theme
  } catch {
    // Timeout, network error, atau API gagal — pakai default
    return 'default'
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('default')

  useEffect(() => {
    // Fetch theme di background, update setelah render pertama
    fetchGlobalTheme().then(t => {
      setThemeState(t)
    })
  }, [])

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'default' ? 'light' : 'default'
    setTheme(newTheme)
  }

  const isLight = theme === 'light'
  const isCleanApp = theme === 'cleanapp'

  // Langsung render dengan theme default, tidak ada delay
  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isLight, isCleanApp }}>
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
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    // Return defaults during SSR/static generation
    return defaultThemeContext
  }
  return context
}

