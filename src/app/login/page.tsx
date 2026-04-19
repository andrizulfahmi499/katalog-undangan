'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Shield, User, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

type LoginType = null | 'admin' | 'member'

// ─── Matching Botanical Floral (same as DearMyLoveClone) ─────────────────────
const FloralBotanical = ({ className = '', mirrored = false }: { className?: string; mirrored?: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 800 900"
    stroke="white"
    strokeWidth="1.2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={mirrored ? { transform: 'scaleX(-1)' } : {}}
  >
    <ellipse cx="320" cy="280" rx="60" ry="70" strokeWidth="1.5"/>
    <ellipse cx="320" cy="280" rx="30" ry="35"/>
    <path d="M320 210 Q280 150 250 100 Q310 130 320 210z"/>
    <path d="M320 210 Q360 150 390 100 Q330 130 320 210z"/>
    <path d="M260 300 Q190 280 150 250 Q200 300 260 300z"/>
    <path d="M380 300 Q450 280 490 250 Q440 300 380 300z"/>
    <path d="M290 360 Q260 420 240 480 Q300 420 290 360z"/>
    <path d="M350 360 Q380 420 400 480 Q340 420 350 360z"/>
    <line x1="320" y1="270" x2="300" y2="240"/>
    <line x1="320" y1="270" x2="330" y2="238"/>
    <line x1="320" y1="270" x2="340" y2="242"/>
    <circle cx="300" cy="238" r="4" fill="white" fillOpacity="0.6"/>
    <circle cx="330" cy="236" r="4" fill="white" fillOpacity="0.6"/>
    <circle cx="341" cy="240" r="4" fill="white" fillOpacity="0.6"/>
    <path d="M230 450 Q140 500 80 580 Q120 520 200 480"/>
    <path d="M230 450 Q190 480 100 500"/>
    <path d="M200 500 Q130 560 90 630"/>
    <path d="M200 500 Q150 530 80 540"/>
    <path d="M80 200 Q30 160 10 80 Q60 140 100 180 Q130 130 180 100 Q150 160 120 200 Q110 240 80 200z"/>
    <path d="M80 200 Q95 170 100 140"/>
    <path d="M160 60 Q220 20 300 10"/>
    <path d="M180 55 Q190 30 200 15"/>
    <path d="M220 40 Q230 20 245 10"/>
    <path d="M50 700 Q150 650 250 680 Q350 700 400 750"/>
    <path d="M150 660 Q160 620 200 600"/>
    <path d="M200 600 Q240 580 260 550"/>
    <path d="M260 550 Q280 530 270 500"/>
    <path d="M100 750 Q60 780 20 800"/>
    <path d="M80 760 Q50 790 10 820"/>
    <path d="M100 750 Q120 780 130 820"/>
    <circle cx="400" cy="750" r="5" fill="white" fillOpacity="0.5"/>
    <circle cx="420" cy="730" r="3" fill="white" fillOpacity="0.4"/>
    <circle cx="440" cy="760" r="4" fill="white" fillOpacity="0.5"/>
    <path d="M400 400 Q450 380 500 400 Q480 430 440 430 Q400 420 400 400z"/>
    <path d="M480 300 Q530 260 560 220 Q520 270 480 300z"/>
    <path d="M500 350 Q560 330 600 350 Q560 380 500 350z"/>
    <path d="M320 380 Q340 450 320 520 Q300 590 320 650 Q340 710 320 750 Q310 780 320 820"/>
  </svg>
)

function LoginForm() {
  const searchParams = useSearchParams()
  const [loginType, setLoginType] = useState<LoginType>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const role = searchParams.get('role')
    if (role === 'admin' || role === 'member') {
      setLoginType(role as LoginType)
    }
  }, [searchParams])

  const handleBack = () => {
    setLoginType(null)
    setEmail('')
    setPassword('')
    setError('')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const endpoint = loginType === 'admin' ? '/api/auth/admin/login' : '/api/auth/member/login'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login gagal')
      }

      if (data.success && data.data) {
        localStorage.setItem(loginType === 'admin' ? 'adminId' : 'memberId', data.data.id)
        localStorage.setItem(loginType === 'admin' ? 'adminName' : 'memberName', data.data.name)
        localStorage.setItem(loginType === 'admin' ? 'adminEmail' : 'memberEmail', data.data.email)
      }

      if (loginType === 'admin') {
        window.location.href = '/admin/dashboard'
      } else {
        window.location.href = '/member/dashboard'
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-b from-[#172a26] to-[#1e3630]">

      {/* ── Background Botanical Florals ─────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{ rotate: [-1.5, 1.5, -1.5], y: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut' }}
          className="absolute -left-16 -top-8 opacity-[0.15] w-[380px] h-[480px]"
        >
          <FloralBotanical className="w-full h-full" />
        </motion.div>
        <motion.div
          animate={{ rotate: [1.5, -1.5, 1.5], y: [5, -5, 5] }}
          transition={{ repeat: Infinity, duration: 13, ease: 'easeInOut' }}
          className="absolute -right-16 -top-8 opacity-[0.15] w-[380px] h-[480px]"
        >
          <FloralBotanical className="w-full h-full" mirrored />
        </motion.div>
        <motion.div
          animate={{ rotate: [-2, 2, -2], y: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 16, ease: 'easeInOut' }}
          className="absolute -left-10 bottom-10 opacity-[0.10] w-[260px] h-[340px]"
        >
          <FloralBotanical className="w-full h-full" />
        </motion.div>
        <motion.div
          animate={{ rotate: [2, -2, 2], y: [4, -4, 4] }}
          transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}
          className="absolute -right-10 bottom-10 opacity-[0.10] w-[260px] h-[340px]"
        >
          <FloralBotanical className="w-full h-full" mirrored />
        </motion.div>
      </div>

      {/* ── Top Logo ─────────────────────────────────────────────── */}
      <a href="/" className="absolute top-5 left-1/2 -translate-x-1/2 pointer-events-auto z-20">
        <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" viewBox="0 0 5000 650" className="w-[130px] fill-white opacity-90 hover:opacity-100 transition-opacity">
          <path d="M157.66 639.12c-7.75,-0.59 -17.29,-1.19 -28.47,-1.63 -11.33,-0.6 -23.84,-0.75 -37.7,-0.75l-54.55 0.75c-9.99,0.59 -23.7,0.74 -41.43,0.74 -1.05,0 -1.64,-1.64 -1.64,-4.91 0,-3.28 0.59,-4.91 1.64,-4.91 21.46,0 37.4,-1.34 47.54,-4.17 10.13,-2.68 17.29,-8.04 21.01,-16.08 3.73,-8.04 5.82,-20.24 5.82,-36.76l0 -382.52c0,-16.52 -1.79,-28.58 -5.37,-36.32 -3.58,-7.74 -10.43,-13.09 -20.72,-16.07 -10.28,-2.98 -26.08,-4.62 -47.54,-4.62 -1.19,0 -1.64,-1.63 -1.64,-4.91 0,-3.27 0.6,-4.91 1.64,-4.91l40.54 0.74c23.1,1.2 41.28,1.64 54.55,1.64 19.22,0 38.9,-0.89 58.72,-2.53 24.3,-1.19 40.84,-1.64 49.63,-1.64 57.98,0 109.25,11.02 153.81,33.05 44.72,22.03 79.29,52.09 103.88,90.04 24.59,37.96 36.81,80.67 36.81,128.01 0,53.43 -12.82,100.61 -38.45,141.69 -25.64,41.08 -59.91,72.63 -102.99,94.95 -43.07,22.33 -90.16,33.49 -141.44,33.49 -15.94,0 -33.98,-0.89 -53.8,-2.53l0.15 0.16z"/>
        </svg>
      </a>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <div className="w-full max-w-4xl relative z-10 mt-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-[0.05em]">
            Selamat Datang
          </h1>
          <p className="text-white/50 text-sm tracking-widest uppercase">
            Pilih jenis akun untuk melanjutkan
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {loginType === null && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto px-4"
            >
              {/* Admin Card */}
              <motion.button
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLoginType('admin')}
                className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-8 transition-all duration-300 text-left group hover:bg-white/15 hover:border-white/25"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20">
                    <Shield className="w-7 h-7 text-[#ededed]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Admin</h2>
                    <p className="text-sm text-[#ededed]/60 font-medium">Portal Pengelola</p>
                  </div>
                </div>
                <p className="text-white/50 mb-5 text-sm leading-relaxed">
                  Kelola member, undangan, dan transaksi credit point
                </p>
                <div className="flex items-center text-[#ededed]/80 font-semibold text-sm group-hover:translate-x-2 transition-all">
                  Login sebagai Admin <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </motion.button>

              {/* Member Card */}
              <motion.button
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLoginType('member')}
                className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-8 transition-all duration-300 text-left group hover:bg-white/15 hover:border-white/25"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20">
                    <User className="w-7 h-7 text-[#ededed]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Member</h2>
                    <p className="text-sm text-[#ededed]/60 font-medium">Portal Pengguna</p>
                  </div>
                </div>
                <p className="text-white/50 mb-5 text-sm leading-relaxed">
                  Kirim undangan digital dengan personalisasi pesan
                </p>
                <div className="flex items-center text-[#ededed]/80 font-semibold text-sm group-hover:translate-x-2 transition-all">
                  Login sebagai Member <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </motion.button>
            </motion.div>
          )}

          {loginType && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-md mx-auto relative px-4"
            >
              <div className="flex justify-start mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBack}
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 border border-white/15 text-white/70 hover:bg-white/20 hover:text-white transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Login Card — DearMyLove style */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[2rem] p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-white/15 border border-white/25">
                    {loginType === 'admin' ? (
                      <Shield className="w-7 h-7 text-[#ededed]" />
                    ) : (
                      <User className="w-7 h-7 text-[#ededed]" />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1 tracking-wide">
                    Login {loginType === 'admin' ? 'Admin' : 'Member'}
                  </h2>
                  <p className="text-white/40 text-xs tracking-widest uppercase">Masukkan kredensial Anda</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2 px-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukkan email..."
                        required
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2 px-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all text-sm"
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/15 border border-red-400/30 text-red-300 px-4 py-3 rounded-xl text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className={`mt-4 w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                      isLoading ? 'opacity-60 cursor-not-allowed' : ''
                    } bg-[#ededed] text-[#172a26] hover:bg-white`}
                  >
                    {isLoading ? 'Memproses...' : 'Login Sekarang'}
                    {!isLoading && <ArrowRight className="w-5 h-5" />}
                  </motion.button>
                </form>

                {loginType === 'member' && (
                  <div className="mt-6 flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <CheckCircle className="w-4 h-4 text-[#ededed]/60 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-white/40">
                      <p className="font-semibold text-white/60 mb-0.5">Info Akun Member</p>
                      <p>Akun member harus dibuat terlebih dahulu oleh admin aplikasi.</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#172a26] flex items-center justify-center text-white">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
