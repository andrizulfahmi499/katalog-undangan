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

      // Store user data in localStorage
      if (data.success && data.data) {
        localStorage.setItem(loginType === 'admin' ? 'adminId' : 'memberId', data.data.id)
        localStorage.setItem(loginType === 'admin' ? 'adminName' : 'memberName', data.data.name)
        localStorage.setItem(loginType === 'admin' ? 'adminEmail' : 'memberEmail', data.data.email)
      }

      // Redirect to respective dashboard
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            Selamat Datang
          </h1>
          <p className="text-gray-600 text-lg">
            Pilih jenis akun untuk melanjutkan
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Selection Screen */}
          {loginType === null && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {/* Admin Card */}
              <motion.button
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLoginType('admin')}
                className="bg-white rounded-3xl p-8 shadow-2xl shadow-purple-200/50 hover:shadow-purple-300/60 transition-all duration-300 text-left group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Admin</h2>
                    <p className="text-sm text-gray-500">Portal Pengelola</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Kelola member, undangan, dan transaksi credit point
                </p>
                <div className="flex items-center text-purple-600 font-medium group-hover:translate-x-2 transition-transform">
                  Login sebagai Admin <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </motion.button>

              {/* Member Card */}
              <motion.button
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLoginType('member')}
                className="bg-white rounded-3xl p-8 shadow-2xl shadow-pink-200/50 hover:shadow-pink-300/60 transition-all duration-300 text-left group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Member</h2>
                    <p className="text-sm text-gray-500">Portal Pengguna</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Kirim undangan digital dengan personalisasi pesan
                </p>
                <div className="flex items-center text-pink-600 font-medium group-hover:translate-x-2 transition-transform">
                  Login sebagai Member <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </motion.button>
            </motion.div>
          )}

          {/* Login Form */}
          {loginType && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-md mx-auto"
            >
              {/* Back Button */}
              <motion.button
                whileHover={{ x: -3 }}
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Kembali
              </motion.button>

              {/* Form Card */}
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg ${
                    loginType === 'admin'
                      ? 'bg-gradient-to-br from-purple-400 to-indigo-500'
                      : 'bg-gradient-to-br from-pink-400 to-rose-500'
                  }`}>
                    {loginType === 'admin' ? (
                      <Shield className="w-8 h-8 text-white" />
                    ) : (
                      <User className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Login {loginType === 'admin' ? 'Admin' : 'Member'}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {loginType === 'admin'
                      ? 'Masuk ke dashboard pengelolaan'
                      : 'Masuk ke dashboard pengiriman undangan'}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukkan email anda"
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan password anda"
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className={`w-full py-4 rounded-xl font-semibold text-white shadow-lg transition-all ${
                      loginType === 'admin'
                        ? 'bg-gradient-to-r from-purple-400 to-indigo-500 hover:shadow-purple-300/60'
                        : 'bg-gradient-to-r from-pink-400 to-rose-500 hover:shadow-pink-300/60'
                    } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Memproses...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Login <ArrowRight className="w-5 h-5 ml-2" />
                      </span>
                    )}
                  </motion.button>
                </form>

                {/* Info */}
                {loginType === 'member' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-700">
                        <p className="font-medium mb-1">Akun Member</p>
                        <p>Akun member harus dibuat terlebih dahulu oleh admin. Hubungi admin untuk pendaftaran akun.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
