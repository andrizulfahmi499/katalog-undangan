'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Heart, Check, Star, ArrowRight, Loader2 } from 'lucide-react'
import { useV2Auth } from '@/hooks/useV2Auth'

function StepIndicator({ current }: { current: number }) {
  const steps = ['Akun', 'Paket', 'Editor']
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              i + 1 <= current ? 'bg-[#3A5A40] text-white' : 'bg-[#D4C9B8] text-[#8B7E6F]'
            }`}>{i + 1}</div>
            <span className={`text-sm font-medium ${i + 1 <= current ? 'text-[#3A5A40]' : 'text-[#8B7E6F]'}`}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-12 h-[2px] mx-3 ${i + 1 < current ? 'bg-[#3A5A40]' : 'bg-[#D4C9B8]'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

interface Package {
  id: string
  name: string
  description: string
  regularPrice: number
  promoPrice: number
  popular?: boolean
  features: string[]
}

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID').format(n)
}

function PackagesContent() {
  const router = useRouter()
  const { user, loading: authLoading } = useV2Auth()
  const [packages, setPackages] = useState<Package[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const isLoading = authLoading || packages.length === 0

  useEffect(() => {
    if (user) {
      if (user.packageStatus === 'paid') {
        router.push('/v2/dashboard')
      }
      // Load packages
      fetch('/api/v2/packages')
        .then(r => r.json())
        .then(data => setPackages(data.data || []))
        .catch(() => {})
    }
  }, [user])

  const handleSelect = async (pkgId: string) => {
    setSelected(pkgId)
    setIsProcessing(true)
    setError('')

    try {
      const res = await fetch('/api/v2/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageType: pkgId }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal membuat pembayaran')

      // Redirect to checkout
      if (data.data.checkoutUrl) {
        if (data.data.checkoutUrl.startsWith('http')) {
          window.location.href = data.data.checkoutUrl
        } else {
          // Mock checkout - go to dashboard directly (dev mode)
          router.push('/v2/dashboard?payment=pending')
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#3A5A40]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#E8E0D4] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/v2/register" className="flex items-center gap-2 text-[#3A5A40] hover:text-[#2D4732] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Kembali</span>
          </Link>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#3A5A40] fill-[#3A5A40]" />
            <span className="font-bold text-[#3A5A40] text-lg">Editor Undangan</span>
          </div>
          <div className="w-24" />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center px-4 py-12">
        <div className="w-full max-w-3xl">
          <StepIndicator current={2} />

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#2D2D2D] mb-2">Pilih Paket Undangan</h1>
            <p className="text-sm text-[#8B7E6F]">Pilih paket yang sesuai dengan kebutuhanmu</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6">{error}</div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {packages.map(pkg => (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-2xl border-2 transition-all ${
                  selected === pkg.id
                    ? 'border-[#3A5A40] shadow-lg shadow-[#3A5A40]/10'
                    : pkg.popular
                    ? 'border-[#D4A853] hover:border-[#3A5A40]'
                    : 'border-[#E8E0D4] hover:border-[#3A5A40]/50'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D4A853] text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" /> POPULER
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#2D2D2D] mb-2">{pkg.name}</h3>
                  <p className="text-sm text-[#8B7E6F] mb-4">{pkg.description}</p>

                  <div className="mb-6">
                    <span className="text-sm text-[#B0A898] line-through">Rp {formatRupiah(pkg.regularPrice)}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-[#3A5A40]">Rp {formatRupiah(pkg.promoPrice)}</span>
                    </div>
                    <span className="text-xs text-[#8B7E6F]">Sekali bayar, aktif selamanya</span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#3A5A40] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-[#4A4A4A]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelect(pkg.id)}
                    disabled={isProcessing}
                    className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                      selected === pkg.id && isProcessing
                        ? 'bg-[#3A5A40]/60 cursor-not-allowed'
                        : pkg.popular
                        ? 'bg-[#3A5A40] hover:bg-[#2D4732] text-white'
                        : 'bg-[#3A5A40]/10 text-[#3A5A40] hover:bg-[#3A5A40] hover:text-white'
                    }`}
                  >
                    {selected === pkg.id && isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Memproses...
                      </>
                    ) : (
                      <>
                        Pilih Paket <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => router.push('/v2/dashboard')}
              className="text-sm text-[#8B7E6F] hover:text-[#3A5A40] underline transition-colors"
            >
              Lewati dulu, langsung ke dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function PackagesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-[#3A5A40]" /></div>}>
      <PackagesContent />
    </Suspense>
  )
}
