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

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('default')
  const [mounted, setMounted] = useState(false)

  // Load global theme on mount
  useEffect(() => {
    // We fetch global theme config from db/api
    const fetchGlobalTheme = async () => {
      try {
        const res = await fetch('/api/public/settings')
        const data = await res.json()
        if (data.success && data.data?.landingPageTheme) {
          setThemeState(data.data.landingPageTheme as ThemeMode)
        }
      } catch (err) {
        console.error('Failed to fetch global theme', err)
      } finally {
        setMounted(true)
      }
    }

    fetchGlobalTheme()
  }, [])

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'default' ? 'light' : 'default'
    setTheme(newTheme)
  }

  const isLight = theme === 'light'

  // Prevent flash of wrong theme
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>
  }

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
