'use client'

import { useTheme } from '@/context/ThemeContext'
import NewCatalogSection from '@/components/catalog/CatalogSection'

export function CatalogSection() {
  const { isLight } = useTheme()
  return <NewCatalogSection isLight={isLight} />
}
