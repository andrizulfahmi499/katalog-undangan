'use client'

import { useCleanAppConfig } from '@/context/CleanAppConfigContext'
import { Home, Grid3x3, DollarSign, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'

/**
 * CleanAppBottomNav Component
 * 
 * Mobile-only bottom navigation bar for the CleanApp theme featuring:
 * - Fixed position at bottom of viewport on mobile devices
 * - Navigation items for Home, Templates, Pricing, and Contact sections
 * - Smooth scroll-to-section behavior
 * - Active section highlighting based on scroll position
 * - Touch-friendly sizing (minimum 44px height)
 * - Hidden on desktop (>= 768px)
 * - Customized color palette
 * 
 * Requirements: 15.1, 15.2, 15.3, 15.4, 15.5
 * 
 * Design Features:
 * - Mobile-first responsive design (Requirement 6.1)
 * - Touch-friendly interactive elements (Requirement 6.5)
 * - Fixed positioning on mobile (Requirement 15.1)
 * - Scroll-to-section navigation (Requirement 15.3)
 * - Active section tracking with Intersection Observer (Requirement 15.4)
 * - Hidden on desktop viewports (Requirement 15.5)
 * - Accessibility with ARIA labels (Requirement 19.1)
 */

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  sectionId: string
  ariaLabel: string
}

export function CleanAppBottomNav() {
  const { config } = useCleanAppConfig()
  const [activeSection, setActiveSection] = useState<string>('home')

  // Navigation items configuration
  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      sectionId: 'home',
      ariaLabel: 'Navigate to home section',
    },
    ...(config.templates?.enabled !== false ? [
      {
        id: 'templates',
        label: 'Templates',
        icon: Grid3x3,
        sectionId: 'templates',
        ariaLabel: 'Navigate to templates section',
      }
    ] : []),
    {
      id: 'pricing',
      label: 'Pricing',
      icon: DollarSign,
      sectionId: 'pricing',
      ariaLabel: 'Navigate to pricing section',
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: Mail,
      sectionId: 'contact',
      ariaLabel: 'Navigate to contact section',
    },
  ]

  // Set up Intersection Observer to track active section
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Trigger when section is in the middle of viewport
      threshold: 0,
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observe all sections
    const sections = navItems.map((item) => document.getElementById(item.sectionId)).filter(Boolean)
    sections.forEach((section) => {
      if (section) observer.observe(section)
    })

    // Cleanup
    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section)
      })
    }
  }, [])

  /**
   * Handle navigation item click
   * Smoothly scrolls to the target section
   */
  const handleNavClick = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 md:hidden z-50 shadow-lg border-t"
      style={{
        backgroundColor: config.colors.backgroundSecondary || config.colors.background,
        borderTopColor: config.colors.secondary,
      }}
      role="navigation"
      aria-label="Mobile bottom navigation"
    >
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.sectionId

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.sectionId)}
              className="flex flex-col items-center justify-center gap-1 px-3 py-2 transition-all duration-200 flex-1"
              style={{
                minHeight: '44px',
                minWidth: '44px',
                color: isActive ? config.colors.primary : config.colors.textSecondary,
              }}
              aria-label={item.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-200 ${
                  isActive ? 'scale-110' : 'scale-100'
                }`}
                aria-hidden={true}
              />
              <span
                className={`text-xs font-medium transition-all duration-200 ${
                  isActive ? 'font-semibold' : 'font-normal'
                }`}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
