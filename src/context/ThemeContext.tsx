'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type ThemeMode = 'default' | 'light'

interface ThemeContextType {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  isLight: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// In-memory cache so we only fetch once per browser session
let cachedTheme: ThemeMode | null = null
let fetchPromise: Promise<ThemeMode> | null = null

async function fetchGlobalTheme(): Promise<ThemeMode> {
  if (cachedTheme !== null) return cachedTheme
  if (fetchPromise) return fetchPromise

  fetchPromise = new Promise<ThemeMode>(async (resolve) => {
    try {
      // AbortController dengan timeout 3 detik — jika API lambat, langsung pakai default
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)

      const res = await fetch('/api/public/settings', {
        signal: controller.signal,
        cache: 'force-cache',
      })
      clearTimeout(timeoutId)

      const data = await res.json()
      const theme = (data.success && data.data?.landingPageTheme
        ? data.data.landingPageTheme
        : 'default') as ThemeMode
      cachedTheme = theme
      resolve(theme)
    } catch {
      // Timeout, network error, atau API gagal — pakai default
      fetchPromise = null // allow retry on next navigation
      resolve('default')
    }
  })

  return fetchPromise
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('default')
  const [mounted, setMounted] = useState(true) // langsung true, tidak tunggu fetch

  useEffect(() => {
    // Fetch theme di background, update setelah render pertama
    fetchGlobalTheme().then(t => {
      if (t !== theme) setThemeState(t)
    })
  }, [])

  const setTheme = (newTheme: ThemeMode) => {
    cachedTheme = newTheme // update cache when changed manually
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'default' ? 'light' : 'default'
    setTheme(newTheme)
  }

  const isLight = theme === 'light'

  // Langsung render dengan theme default, tidak ada delay
  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isLight }}>
      <div className={`theme-transition ${isLight ? 'theme-light' : 'theme-default'}`}>
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
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    // Return defaults during SSR/static generation
    return defaultThemeContext
  }
  return context
}
