'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

const GUEST_KEY = 'guest_favorite_themes'

export interface UseFavoritesReturn {
  favorites: string[]
  isFavorited: (slug: string) => boolean
  toggleFavorite: (slug: string, themeName: string) => Promise<void>
  isLoading: boolean
}

function readGuestFavorites(): string[] {
  try {
    const raw = localStorage.getItem(GUEST_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeGuestFavorites(slugs: string[]) {
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify(slugs))
  } catch {
    // localStorage not available
  }
}

export function useFavorites(memberId: string | null): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [migrated, setMigrated] = useState(false)

  // Load favorites on mount / memberId change
  useEffect(() => {
    if (memberId) {
      // Member: fetch from API
      setIsLoading(true)
      fetch('/api/member/favorites', {
        headers: { 'x-member-id': memberId },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            setFavorites(data.data.map((f: any) => f.themeSlug))
          }
        })
        .catch(() => {
          // Fallback to localStorage
          setFavorites(readGuestFavorites())
          toast.warning('Gagal memuat favorit dari server, menggunakan data lokal')
        })
        .finally(() => setIsLoading(false))
    } else {
      // Guest: read from localStorage
      setFavorites(readGuestFavorites())
    }
  }, [memberId])

  // Migrate guest favorites when member logs in
  useEffect(() => {
    if (!memberId || migrated) return
    const guestSlugs = readGuestFavorites()
    if (guestSlugs.length === 0) return

    setMigrated(true)
    fetch('/api/member/favorites/migrate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-member-id': memberId },
      body: JSON.stringify({ slugs: guestSlugs }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          writeGuestFavorites([])
          // Refresh favorites from API
          return fetch('/api/member/favorites', {
            headers: { 'x-member-id': memberId },
          })
            .then((r) => r.json())
            .then((d) => {
              if (d.success) setFavorites(d.data.map((f: any) => f.themeSlug))
            })
        }
      })
      .catch(() => {
        setMigrated(false) // retry next session
      })
  }, [memberId, migrated])

  const isFavorited = useCallback(
    (slug: string) => favorites.includes(slug),
    [favorites]
  )

  const toggleFavorite = useCallback(
    async (slug: string, themeName: string) => {
      const wasIn = favorites.includes(slug)

      // Optimistic update
      setFavorites((prev) =>
        wasIn ? prev.filter((s) => s !== slug) : [...prev, slug]
      )

      try {
        if (memberId) {
          if (wasIn) {
            const res = await fetch(`/api/member/favorites/${encodeURIComponent(slug)}`, {
              method: 'DELETE',
              headers: { 'x-member-id': memberId },
            })
            if (!res.ok) throw new Error('Delete failed')
          } else {
            const res = await fetch('/api/member/favorites', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'x-member-id': memberId },
              body: JSON.stringify({ themeSlug: slug, themeName }),
            })
            if (!res.ok) throw new Error('Add failed')
          }
        } else {
          // Guest: update localStorage
          const current = readGuestFavorites()
          const updated = wasIn
            ? current.filter((s) => s !== slug)
            : [...current, slug]
          writeGuestFavorites(updated)
        }
      } catch {
        // Rollback
        setFavorites((prev) =>
          wasIn ? [...prev, slug] : prev.filter((s) => s !== slug)
        )
        toast.error('Gagal mengubah favorit')
      }
    },
    [favorites, memberId]
  )

  return { favorites, isFavorited, toggleFavorite, isLoading }
}
