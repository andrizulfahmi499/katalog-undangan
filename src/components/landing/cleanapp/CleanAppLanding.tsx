'use client'

import dynamic from 'next/dynamic'
import { CleanAppConfigProvider, useCleanAppConfig } from '@/context/CleanAppConfigContext'
import { Loader2, AlertCircle } from 'lucide-react'
import { CleanAppHero } from './CleanAppHero'
import { CleanAppFeatures } from './CleanAppFeatures'

// Dynamic imports for below-the-fold components
const CleanAppTemplateGrid = dynamic(() => import('./CleanAppTemplateGrid').then(mod => ({ default: mod.CleanAppTemplateGrid })), {
  loading: () => (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="h-12 w-64 bg-gray-200 rounded-lg mx-auto mb-12 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl overflow-hidden shadow-md bg-white">
              <div className="w-full aspect-[3/4] bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  ssr: true,
})

const CleanAppPricing = dynamic(() => import('./CleanAppPricing').then(mod => ({ default: mod.CleanAppPricing })), {
  loading: () => (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="h-12 w-64 bg-gray-200 rounded-lg mx-auto mb-12 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl p-8 shadow-lg bg-white">
              <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse" />
              <div className="h-12 bg-gray-200 rounded mb-6 animate-pulse" />
              <div className="h-12 bg-gray-200 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  ssr: true,
})

const CleanAppOrderForm = dynamic(() => import('./CleanAppOrderForm').then(mod => ({ default: mod.CleanAppOrderForm })), {
  loading: () => (
    <div className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="h-12 w-64 bg-gray-200 rounded-lg mx-auto mb-12 animate-pulse" />
        <div className="rounded-2xl p-8 shadow-lg bg-white space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          ))}
          <div className="h-14 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  ),
  ssr: true,
})

const CleanAppFAQ = dynamic(() => import('./CleanAppFAQ').then(mod => ({ default: mod.CleanAppFAQ })), {
  loading: () => (
    <div className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="h-12 w-64 bg-gray-200 rounded-lg mx-auto mb-12 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl p-8 shadow-md bg-white">
              <div className="h-6 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  ssr: true,
})

const CleanAppFooter = dynamic(() => import('./CleanAppFooter').then(mod => ({ default: mod.CleanAppFooter })), {
  loading: () => <div className="py-16 bg-gray-800" />,
  ssr: true,
})

const CleanAppBottomNav = dynamic(() => import('./CleanAppBottomNav').then(mod => ({ default: mod.CleanAppBottomNav })), {
  ssr: false,
})

const CleanAppExternalCatalog = dynamic(() => import('./CleanAppExternalCatalog'), {
  loading: () => <div className="py-20 h-96 animate-pulse bg-gray-50" />,
  ssr: true,
})

interface CleanAppLandingProps {
  slug?: string
  memberId?: string
  initialConfig?: any
}

function CleanAppLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-gray-400" />
        <p className="text-gray-600">Memuat...</p>
      </div>
    </div>
  )
}

function CleanAppError({ error }: { error: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center space-y-4">
        <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
        <h2 className="text-xl font-bold text-gray-900">Gagal Memuat Tema</h2>
        <p className="text-gray-600 text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  )
}

function CleanAppMainContent() {
  const { config, isLoading, error } = useCleanAppConfig()

  if (isLoading) return <CleanAppLoading />
  if (error) return <CleanAppError error={error} />

  const showTemplates = config.templates?.enabled !== false

  return (
    <main className="relative min-h-screen">
      <CleanAppHero />
      <CleanAppFeatures />
      {showTemplates && (
        config.templates?.useExternalCatalog
          ? <CleanAppExternalCatalog />
          : <CleanAppTemplateGrid />
      )}
      <CleanAppPricing />
      <CleanAppOrderForm />
      <CleanAppFAQ />
      <CleanAppFooter />
      <CleanAppBottomNav />
    </main>
  )
}

export function CleanAppLanding({ slug, memberId, initialConfig }: CleanAppLandingProps) {
  return (
    <CleanAppConfigProvider
      slug={slug}
      memberId={memberId}
      initialConfig={initialConfig}
    >
      <CleanAppMainContent />
    </CleanAppConfigProvider>
  )
}