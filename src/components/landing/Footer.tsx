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
    <footer id="contact" className="backdrop-blur-xl bg-white/60 text-gray-900 border-t border-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="backdrop-blur-xl bg-gray-900 p-2.5 rounded-full shadow-lg shadow-gray-200/30">
                  <Heart className="w-6 h-6 text-white" fill="white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  UndanganSamawa
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
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
              className="flex items-center gap-4"
            >
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center w-10 h-10 backdrop-blur-xl bg-white/70 border-2 border-white/60 rounded-full hover:bg-white/80 transition-all shadow-md shadow-gray-200/30"
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
            <h3 className="text-lg font-bold mb-4 text-gray-900">Produk</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-700 hover:text-gray-900 transition-colors inline-block"
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
            <h3 className="text-lg font-bold mb-4 text-gray-900">Perusahaan</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-700 hover:text-gray-900 transition-colors inline-block"
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
            <h3 className="text-lg font-bold mb-4 text-gray-900">Hubungi Kami</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-800" />
                <span className="text-gray-700">
                  Jl. Nusantara 2, Palupi, Palu
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 text-gray-800" />
                <a
                  href="mailto:hello@undangansamawa.com"
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  hello@undangansamawa.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0 text-gray-800" />
                <a
                  href="tel:+6281234567890"
                  className="text-gray-700 hover:text-gray-900 transition-colors"
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
          className="pt-8 border-t border-white/60"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm text-center md:text-left">
              © {currentYear} UndanganSamawa. All rights reserved.
            </p>
            <p className="text-gray-600 text-sm flex items-center gap-2">
              Made with{' '}
              <Heart className="w-4 h-4 text-gray-800 fill-gray-800 animate-pulse" />
              for your special moments
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
