'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { CleanAppThemeConfig, DEFAULT_CLEANAPP_CONFIG } from '@/lib/schemas/cleanapp-theme'

interface CleanAppConfigContextType {
  config: CleanAppThemeConfig
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const CleanAppConfigContext = createContext<CleanAppConfigContextType | undefined>(undefined)

interface CleanAppConfigProviderProps {
  children: ReactNode
  slug?: string
  memberId?: string
  initialConfig?: CleanAppThemeConfig
}

export function CleanAppConfigProvider({
  children,
  slug,
  memberId,
  initialConfig,
}: CleanAppConfigProviderProps) {
  // Use initialConfig if provided (for faster SSR)
  const [config, setConfig] = useState<CleanAppThemeConfig>(
    initialConfig || DEFAULT_CLEANAPP_CONFIG
  )
  const [isLoading, setIsLoading] = useState(!!initialConfig)
  const [error, setError] = useState<string | null>(null)

  const fetchConfig = useCallback(async () => {
    // Don't fetch if we have initial config and this is initial mount
    if (initialConfig && !slug && !memberId) {
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (slug) params.append('slug', slug)
      if (memberId) params.append('memberId', memberId)

      const url = `/api/public/settings${params.toString() ? `?${params.toString()}` : ''}`
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch configuration')
      }

      const fetchedConfig = data.data?.config || DEFAULT_CLEANAPP_CONFIG
      setConfig(fetchedConfig)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      // Keep existing config on error instead of resetting
    } finally {
      setIsLoading(false)
    }
  }, [slug, memberId, initialConfig])

  // Initial fetch
  useEffect(() => {
    // Skip fetch if we already have valid config from initialConfig
    if (initialConfig && !slug && !memberId) {
      setConfig(initialConfig)
      setIsLoading(false)
      return
    }
    fetchConfig()
  }, [fetchConfig, initialConfig, slug, memberId])

  // Listen for preview config updates
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      if (event.data?.type === 'PREVIEW_CONFIG' && event.data?.config) {
        setConfig(event.data.config)
        setIsLoading(false)
        setError(null)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const refetch = useCallback(async () => {
    await fetchConfig()
  }, [fetchConfig])

  const value = {
    config,
    isLoading,
    error,
    refetch,
  }

  return (
    <CleanAppConfigContext.Provider value={value}>
      {children}
    </CleanAppConfigContext.Provider>
  )
}

export function useCleanAppConfig(): CleanAppConfigContextType {
  const context = useContext(CleanAppConfigContext)

  if (context === undefined) {
    return {
      config: DEFAULT_CLEANAPP_CONFIG,
      isLoading: true,
      error: null,
      refetch: async () => {},
    }
  }

  return context
}