'use client'

import { motion } from 'framer-motion'
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: '#', label: 'Facebook' },
    { icon: <Instagram className="w-5 h-5" />, href: '#', label: 'Instagram' },
    { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
    { icon: <Youtube className="w-5 h-5" />, href: '#', label: 'Youtube' },
  ]

  const footerLinks = {
    product: [
      { name: 'Semua Template', href: '#' },
      { name: 'Fitur', href: '#features' },
      { name: 'Harga', href: '#pricing' },
      { name: 'Demo', href: '#' },
    ],
    company: [
      { name: 'Tentang Kami', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Karir', href: '#' },
      { name: 'Kontak', href: '#' },
    ],
    support: [
      { name: 'Bantuan', href: '#' },
      { name: 'FAQ', href: '#' },
      { name: 'Syarat & Ketentuan', href: '#' },
      { name: 'Kebijakan Privasi', href: '#' },
    ],
  }

  return (
    <footer id="contact" className="bg-white/5 backdrop-blur-xl text-white border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(165,180,252,0.3)] overflow-hidden bg-white/15 backdrop-blur-sm border border-white/20">
                  <img
                    src="/logo.png"
                    alt="Katalog Undanganku"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <span className="text-2xl font-bold text-white">
                  Katalog Undanganku
                </span>
              </div>
              <p className="text-purple-200/70 leading-relaxed mb-8">
                Platform pembuatan undangan pernikahan digital terbaik di Indonesia.
                Buat momen spesial Anda lebih berkesan.
              </p>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-3"
            >
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center w-12 h-12 bg-white/10 border border-white/15 rounded-2xl hover:bg-gradient-to-br hover:from-[#A5B4FC] hover:to-[#C4B5FD] hover:text-white hover:border-transparent transition-all shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-lg hover:shadow-[#A5B4FC]/30 text-purple-200/70"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Product Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-bold mb-6 text-white">Produk</h3>
            <ul className="space-y-4">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-purple-200/70 hover:text-white transition-colors inline-block font-medium"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-bold mb-6 text-white">Perusahaan</h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-purple-200/70 hover:text-white transition-colors inline-block font-medium"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-bold mb-6 text-white">Hubungi Kami</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#A5B4FC]" />
                <span className="text-purple-200/70">
                  Jl. Nusantara 2, Palupi, Palu
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 text-[#C4B5FD]" />
                <a
                  href="mailto:hello@katalogundanganku.com"
                  className="text-purple-200/70 hover:text-white transition-colors font-medium"
                >
                  hello@katalogundanganku.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0 text-[#FBCFE8]" />
                <a
                  href="tel:+6281234567890"
                  className="text-purple-200/70 hover:text-white transition-colors font-medium"
                >
                  +62 812-3456-7890
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-10 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-purple-300/50 text-sm text-center md:text-left">
              © {currentYear} Katalog Undanganku. All rights reserved.
            </p>
            <p className="text-purple-300/50 text-sm flex items-center gap-2">
              Made with{' '}
              <Heart className="w-4 h-4 text-[#FBCFE8] fill-[#FBCFE8] animate-pulse" />
              for your special moments
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
