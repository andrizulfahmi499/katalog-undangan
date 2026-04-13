'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Shield, User, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react'

type LoginType = null | 'admin' | 'member'

export default function LoginPage() {
  const [loginType, setLoginType] = useState<LoginType>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

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
        headers: {
          'Content-Type': 'application/json',
        },
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-[#e0e5ec] text-gray-700">
      <div className="w-full max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 tracking-tight">
            Selamat Datang
          </h1>
          <p className="text-gray-500 font-medium">
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
              className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto px-4"
            >
              {/* Admin Card */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLoginType('admin')}
                className="bg-[#e0e5ec] rounded-3xl p-8 transition-all duration-300 text-left group shadow-[10px_10px_20px_#a3b1c6,-10px_-10px_20px_#ffffff] hover:shadow-[inset_10px_10px_20px_#a3b1c6,inset_-10px_-10px_20px_#ffffff]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#e0e5ec] flex items-center justify-center shadow-[5px_5px_10px_#a3b1c6,-5px_-5px_10px_#ffffff]">
                    <Shield className="w-7 h-7 text-indigo-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-700">Admin</h2>
                    <p className="text-sm text-indigo-500 font-medium">Portal Pengelola</p>
                  </div>
                </div>
                <p className="text-gray-500 mb-5 text-sm leading-relaxed">
                  Kelola member, undangan, dan transaksi credit point
                </p>
                <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:translate-x-2 transition-all">
                  Login sebagai Admin <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </motion.button>

              {/* Member Card */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLoginType('member')}
                className="bg-[#e0e5ec] rounded-3xl p-8 transition-all duration-300 text-left group shadow-[10px_10px_20px_#a3b1c6,-10px_-10px_20px_#ffffff] hover:shadow-[inset_10px_10px_20px_#a3b1c6,inset_-10px_-10px_20px_#ffffff]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#e0e5ec] flex items-center justify-center shadow-[5px_5px_10px_#a3b1c6,-5px_-5px_10px_#ffffff]">
                    <User className="w-7 h-7 text-pink-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-700">Member</h2>
                    <p className="text-sm text-pink-500 font-medium">Portal Pengguna</p>
                  </div>
                </div>
                <p className="text-gray-500 mb-5 text-sm leading-relaxed">
                  Kirim undangan digital dengan personalisasi pesan
                </p>
                <div className="flex items-center text-pink-600 font-semibold text-sm group-hover:translate-x-2 transition-all">
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
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-[#e0e5ec] text-gray-500 shadow-[5px_5px_10px_#a3b1c6,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#a3b1c6,inset_-5px_-5px_10px_#ffffff] transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Login Neumorphism Card */}
              <div className="bg-[#e0e5ec] rounded-[2rem] p-8 shadow-[10px_10px_20px_#a3b1c6,-10px_-10px_20px_#ffffff]">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center bg-[#e0e5ec] shadow-[5px_5px_10px_#a3b1c6,-5px_-5px_10px_#ffffff]">
                    {loginType === 'admin' ? (
                      <Shield className="w-8 h-8 text-indigo-500" />
                    ) : (
                      <User className="w-8 h-8 text-pink-500" />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Login {loginType === 'admin' ? 'Admin' : 'Member'}
                  </h2>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-3 px-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukkan email..."
                        required
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#e0e5ec] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 shadow-[inset_6px_6px_10px_#a3b1c6,inset_-6px_-6px_10px_#ffffff] transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-3 px-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#e0e5ec] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 shadow-[inset_6px_6px_10px_#a3b1c6,inset_-6px_-6px_10px_#ffffff] transition-all"
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#e0e5ec] text-red-500 px-4 py-3 rounded-xl text-sm shadow-[inset_4px_4px_8px_#a3b1c6,inset_-4px_-4px_8px_#ffffff]"
                    >
                      {error}
                    </motion.div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className={`mt-8 w-full py-4 rounded-2xl font-bold bg-[#e0e5ec] flex items-center justify-center gap-2 shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] hover:shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] transition-all ${
                      loginType === 'admin' ? 'text-indigo-600' : 'text-pink-600'
                    } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? 'Memproses...' : 'Login Sekarang'}
                    {!isLoading && <ArrowRight className="w-5 h-5" />}
                  </motion.button>
                </form>

                {loginType === 'member' && (
                  <div className="mt-8 flex items-start gap-3 p-4 rounded-2xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#a3b1c6,inset_-4px_-4px_8px_#ffffff]">
                    <CheckCircle className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-600">
                      <p className="font-semibold text-gray-700">Info Akun Member</p>
                      <p className="mt-1">Akun member harus dibuat terlebih dahulu oleh admin aplikasi.</p>
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
