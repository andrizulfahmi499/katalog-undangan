'use client'

import { useCleanAppConfig } from '@/context/CleanAppConfigContext'
import { Facebook, Instagram, Twitter, MessageCircle, Mail, Phone } from 'lucide-react'

/**
 * CleanAppFooter Component
 * 
 * Footer section for the CleanApp theme featuring:
 * - Customizable footer text/tagline
 * - Contact information (email and phone)
 * - Social media links with icons
 * - Dynamic copyright with current year
 * - Responsive layout (stacked on mobile, multi-column on desktop)
 * - Customized color palette
 * 
 * Requirements: 14.1, 14.2, 14.3, 14.4, 14.5
 * 
 * Design Features:
 * - Mobile-first responsive design (Requirement 6.1)
 * - Touch-friendly interactive elements (Requirement 6.5)
 * - Customized color palette application (Requirement 14.5)
 * - Dynamic year display (Requirement 14.3)
 * - Social media links with customizable URLs (Requirement 14.2)
 * - Responsive layout adaptation (Requirement 14.4)
 */

export function CleanAppFooter() {
  const { config } = useCleanAppConfig()
  const currentYear = new Date().getFullYear()

  // Social media configuration with icons
  const socialMediaLinks = [
    {
      name: 'Facebook',
      url: config.footer.socialMedia?.facebook,
      icon: Facebook,
      ariaLabel: 'Visit our Facebook page',
    },
    {
      name: 'Instagram',
      url: config.footer.socialMedia?.instagram,
      icon: Instagram,
      ariaLabel: 'Visit our Instagram profile',
    },
    {
      name: 'Twitter',
      url: config.footer.socialMedia?.twitter,
      icon: Twitter,
      ariaLabel: 'Visit our Twitter profile',
    },
    {
      name: 'WhatsApp',
      url: config.footer.socialMedia?.whatsapp,
      icon: MessageCircle,
      ariaLabel: 'Contact us on WhatsApp',
    },
  ].filter((link) => link.url && link.url.trim() !== '') // Only show links that have URLs

  return (
    <footer
      id="contact"
      className="py-12 sm:py-16 md:py-20 px-4"
      style={{ backgroundColor: config.colors.primary }}
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto">
        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Column 1: Footer Text/Tagline */}
          {config.footer.text && (
            <div className="text-center md:text-left">
              <p className="text-white text-base sm:text-lg leading-relaxed">
                {config.footer.text}
              </p>
            </div>
          )}

          {/* Column 2: Contact Information */}
          {(config.footer.contactEmail || config.footer.contactPhone) && (
            <div className="text-center md:text-left">
              <h3 className="text-white font-semibold text-lg sm:text-xl mb-4">
                Hubungi Kami
              </h3>
              <div className="space-y-3">
                {config.footer.contactEmail && (
                  <a
                    href={`mailto:${config.footer.contactEmail}`}
                    className="flex items-center justify-center md:justify-start gap-2 text-white/90 hover:text-white transition-colors duration-200 group min-h-[44px]"
                    aria-label={`Email us at ${config.footer.contactEmail}`}
                  >
                    <Mail
                      className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
                      aria-hidden="true"
                    />
                    <span className="text-sm sm:text-base break-all">
                      {config.footer.contactEmail}
                    </span>
                  </a>
                )}
                {config.footer.contactPhone && (
                  <a
                    href={`tel:${config.footer.contactPhone.replace(/\s/g, '')}`}
                    className="flex items-center justify-center md:justify-start gap-2 text-white/90 hover:text-white transition-colors duration-200 group min-h-[44px]"
                    aria-label={`Call us at ${config.footer.contactPhone}`}
                  >
                    <Phone
                      className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
                      aria-hidden="true"
                    />
                    <span className="text-sm sm:text-base">
                      {config.footer.contactPhone}
                    </span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Column 3: Social Media Links */}
          {socialMediaLinks.length > 0 && (
            <div className="text-center md:text-left">
              <h3 className="text-white font-semibold text-lg sm:text-xl mb-4">
                Ikuti Kami
              </h3>
              <div className="flex items-center justify-center md:justify-start gap-4">
                {socialMediaLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-110"
                      aria-label={social.ariaLabel}
                      style={{
                        minWidth: '44px',
                        minHeight: '44px',
                      }}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div
          className="h-px w-full mb-6 md:mb-8"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          aria-hidden="true"
        />

        {/* Copyright */}
        <div className="text-center">
          <p className="text-white/80 text-sm sm:text-base">
            © {currentYear} All rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}
