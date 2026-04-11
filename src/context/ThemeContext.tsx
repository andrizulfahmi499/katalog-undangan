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

  // Load theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('katalog-theme') as ThemeMode | null
    if (saved && (saved === 'default' || saved === 'light')) {
      setThemeState(saved)
    }
    setMounted(true)
  }, [])

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme)
    localStorage.setItem('katalog-theme', newTheme)
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
