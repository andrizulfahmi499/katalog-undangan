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

  fetchPromise = fetch('/api/public/settings', {
    // Cache for 5 minutes at the HTTP level
    next: { revalidate: 300 },
  } as RequestInit)
    .then(res => res.json())
    .then(data => {
      const theme = (data.success && data.data?.landingPageTheme
        ? data.data.landingPageTheme
        : 'default') as ThemeMode
      cachedTheme = theme
      return theme
    })
    .catch(() => {
      fetchPromise = null // allow retry on error
      return 'default' as ThemeMode
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
