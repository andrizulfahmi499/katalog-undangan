/**
 * Example usage of CleanApp theme types
 * 
 * This file demonstrates how to use the CleanApp theme configuration types
 * in your components and API endpoints.
 * 
 * @see src/lib/schemas/cleanapp-theme.ts for type definitions
 */

import type {
  CleanAppThemeConfig,
  HeroConfig,
  FeatureItem,
  FeaturesConfig,
  PricingTier,
  PricingConfig,
  FAQItem,
  FAQConfig,
  FooterConfig,
  SocialMedia,
  ColorPalette,
} from './cleanapp-theme'

// Example 1: Using HeroConfig type
const exampleHero: HeroConfig = {
  title: 'Welcome to Our Service',
  subtitle: 'Create beautiful digital invitations',
  ctaText: 'Get Started',
  backgroundImage: 'https://example.com/bg.jpg',
  heroImage: 'https://example.com/hero.jpg',
}

// Example 2: Using FeatureItem and FeaturesConfig types
const exampleFeature: FeatureItem = {
  icon: '🎨',
  title: 'Customizable Design',
  description: 'Fully customize colors, text, and images to match your brand',
}

const exampleFeatures: FeaturesConfig = {
  title: 'Our Features',
  items: [
    exampleFeature,
    {
      icon: '📱',
      title: 'Mobile Optimized',
      description: 'Perfect display on all devices',
    },
    {
      icon: '⚡',
      title: 'Fast Performance',
      description: 'Lightning-fast loading times',
    },
  ],
}

// Example 3: Using PricingTier and PricingConfig types
const examplePricingTier: PricingTier = {
  name: 'Professional',
  price: '$29/month',
  features: [
    'Unlimited templates',
    'Custom domain',
    'Priority support',
    'Advanced analytics',
  ],
  ctaText: 'Choose Plan',
  recommended: true,
}

const examplePricing: PricingConfig = {
  title: 'Pricing Plans',
  tiers: [
    {
      name: 'Basic',
      price: '$9/month',
      features: ['5 templates', 'Basic support'],
      ctaText: 'Choose Plan',
      recommended: false,
    },
    examplePricingTier,
  ],
}

// Example 4: Using FAQItem and FAQConfig types
const exampleFAQItem: FAQItem = {
  question: 'How do I get started?',
  answer: 'Simply click the "Get Started" button and follow the setup wizard.',
}

const exampleFAQ: FAQConfig = {
  title: 'Frequently Asked Questions',
  items: [
    exampleFAQItem,
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards and PayPal.',
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, you can cancel your subscription at any time.',
    },
  ],
}

// Example 5: Using SocialMedia and FooterConfig types
const exampleSocialMedia: SocialMedia = {
  facebook: 'https://facebook.com/example',
  instagram: 'https://instagram.com/example',
  twitter: 'https://twitter.com/example',
  whatsapp: '+1234567890',
}

const exampleFooter: FooterConfig = {
  text: 'Make your special moments more memorable with our digital invitations',
  contactEmail: 'contact@example.com',
  contactPhone: '+1 (555) 123-4567',
  socialMedia: exampleSocialMedia,
}

// Example 6: Using ColorPalette type
const exampleColors: ColorPalette = {
  primary: '#FF6B9D',
  secondary: '#C8E6F5',
  accent: '#FFD700',
  background: '#FFF8F0',
  backgroundSecondary: '#FFFFFF',
  textPrimary: '#2D3748',
  textSecondary: '#718096',
}

// Example 7: Complete CleanAppThemeConfig
const exampleCompleteConfig: CleanAppThemeConfig = {
  hero: exampleHero,
  features: exampleFeatures,
  pricing: examplePricing,
  faq: exampleFAQ,
  footer: exampleFooter,
  colors: exampleColors,
}

// Example 8: Using types in React components
/**
 * Example React component using HeroConfig type
 */
export function HeroComponent({ config }: { config: HeroConfig }) {
  return (
    <section>
      <h1>{config.title}</h1>
      {config.subtitle && <p>{config.subtitle}</p>}
      <button>{config.ctaText}</button>
    </section>
  )
}

/**
 * Example React component using FeaturesConfig type
 */
export function FeaturesComponent({ config }: { config: FeaturesConfig }) {
  return (
    <section>
      {config.title && <h2>{config.title}</h2>}
      <div>
        {config.items.map((item, index) => (
          <div key={index}>
            <span>{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/**
 * Example API handler using CleanAppThemeConfig type
 */
export async function saveThemeConfig(
  memberId: string,
  config: CleanAppThemeConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate and save config
    // Implementation would go here
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to save configuration' }
  }
}

// Example 9: Type guards and validation helpers
/**
 * Check if a configuration has a recommended pricing tier
 */
export function hasRecommendedTier(config: PricingConfig): boolean {
  return config.tiers.some((tier) => tier.recommended === true)
}

/**
 * Get the recommended pricing tier if it exists
 */
export function getRecommendedTier(
  config: PricingConfig
): PricingTier | undefined {
  return config.tiers.find((tier) => tier.recommended === true)
}

/**
 * Count total features across all pricing tiers
 */
export function countTotalFeatures(config: PricingConfig): number {
  return config.tiers.reduce((total, tier) => total + tier.features.length, 0)
}

// Example 10: Partial configuration updates
/**
 * Update only the hero section of a configuration
 */
export function updateHeroConfig(
  config: CleanAppThemeConfig,
  heroUpdates: Partial<HeroConfig>
): CleanAppThemeConfig {
  return {
    ...config,
    hero: {
      ...config.hero,
      ...heroUpdates,
    },
  }
}

/**
 * Update only the color palette
 */
export function updateColorPalette(
  config: CleanAppThemeConfig,
  colorUpdates: Partial<ColorPalette>
): CleanAppThemeConfig {
  return {
    ...config,
    colors: {
      ...config.colors,
      ...colorUpdates,
    },
  }
}
