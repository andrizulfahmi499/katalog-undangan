import { z } from 'zod'

/**
 * Zod schemas for CleanApp theme configuration validation
 */

export const ColorSchema = z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
  message: 'Color must be a valid hex color (e.g., #FF5733 or #F57)',
})

export const HeroConfigSchema = z.object({
  title: z.string().min(1, 'Hero title is required').max(200, 'Hero title is too long'),
  subtitle: z.string().max(500, 'Hero subtitle is too long').optional(),
  ctaText: z.string().min(1, 'CTA text is required').max(50, 'CTA text is too long'),
  backgroundImage: z.string().optional().or(z.literal('')),
  heroImage: z.string().optional().or(z.literal('')),
})

export const FeatureItemSchema = z.object({
  icon: z.string().min(1, 'Feature icon is required'),
  title: z.string().min(1, 'Feature title is required').max(100, 'Feature title is too long'),
  description: z.string().min(1, 'Feature description is required').max(300, 'Feature description is too long'),
  iconImage: z.string().optional().or(z.literal('')),
})

export const FeaturesConfigSchema = z.object({
  title: z.string().max(200, 'Features title is too long').optional(),
  items: z.array(FeatureItemSchema).min(3, 'At least 3 features are required').max(6, 'Maximum 6 features allowed'),
})

export const PricingTierSchema = z.object({
  name: z.string().min(1, 'Tier name is required').max(100, 'Tier name is too long'),
  price: z.string().min(1, 'Price is required').max(50, 'Price is too long'),
  features: z.array(z.string().min(1, 'Feature cannot be empty')).min(1, 'At least 1 feature is required'),
  ctaText: z.string().min(1, 'CTA text is required').max(50, 'CTA text is too long'),
  recommended: z.boolean().optional(),
  previewImage: z.string().optional().or(z.literal('')),
})

export const PricingConfigSchema = z.object({
  title: z.string().max(200, 'Pricing title is too long').optional(),
  tiers: z.array(PricingTierSchema).min(1, 'At least 1 pricing tier is required').max(5, 'Maximum 5 pricing tiers allowed'),
})

export const FAQItemSchema = z.object({
  question: z.string().min(1, 'Question is required').max(300, 'Question is too long'),
  answer: z.string().min(1, 'Answer is required').max(1000, 'Answer is too long'),
})

export const FAQConfigSchema = z.object({
  title: z.string().max(200, 'FAQ title is too long').optional(),
  items: z.array(FAQItemSchema).min(3, 'At least 3 FAQ items are required').max(10, 'Maximum 10 FAQ items allowed'),
})

export const SocialMediaSchema = z.object({
  facebook: z.string().url('Facebook URL must be valid').optional().or(z.literal('')),
  instagram: z.string().url('Instagram URL must be valid').optional().or(z.literal('')),
  twitter: z.string().url('Twitter URL must be valid').optional().or(z.literal('')),
  whatsapp: z.string().optional(),
})

export const FooterConfigSchema = z.object({
  text: z.string().max(500, 'Footer text is too long').optional(),
  contactEmail: z.string().email('Contact email must be valid').optional(),
  contactPhone: z.string().max(50, 'Contact phone is too long').optional(),
  socialMedia: SocialMediaSchema.optional(),
})

export const TemplatesConfigSchema = z.object({
  enabled: z.boolean().default(true),
  title: z.string().max(200, 'Templates title is too long').optional(),
  subtitle: z.string().max(500, 'Templates subtitle is too long').optional(),
  useExternalCatalog: z.boolean().default(false),
  // Keep externalUrl for backward compatibility (will be ignored by frontend)
  externalUrl: z.string().optional().or(z.literal('')),
  previewButtonText: z.string().max(50, 'Preview button text is too long').optional(),
  orderButtonText: z.string().max(50, 'Order button text is too long').optional(),
  buttonColor: ColorSchema.optional(),
  buttonTextColor: ColorSchema.optional(),
})

export const ColorPaletteSchema = z.object({
  primary: ColorSchema,
  secondary: ColorSchema,
  accent: ColorSchema,
  background: ColorSchema,
  backgroundSecondary: ColorSchema.optional(),
  textPrimary: ColorSchema,
  textSecondary: ColorSchema,
})

export const CleanAppThemeConfigSchema = z.object({
  hero: HeroConfigSchema,
  features: FeaturesConfigSchema,
  pricing: PricingConfigSchema,
  faq: FAQConfigSchema,
  templates: TemplatesConfigSchema,
  footer: FooterConfigSchema,
  colors: ColorPaletteSchema,
})

export type CleanAppThemeConfig = z.infer<typeof CleanAppThemeConfigSchema>
export type HeroConfig = z.infer<typeof HeroConfigSchema>
export type FeatureItem = z.infer<typeof FeatureItemSchema>
export type FeaturesConfig = z.infer<typeof FeaturesConfigSchema>
export type PricingTier = z.infer<typeof PricingTierSchema>
export type PricingConfig = z.infer<typeof PricingConfigSchema>
export type FAQItem = z.infer<typeof FAQItemSchema>
export type FAQConfig = z.infer<typeof FAQConfigSchema>
export type FooterConfig = z.infer<typeof FooterConfigSchema>
export type SocialMedia = z.infer<typeof SocialMediaSchema>
export type ColorPalette = z.infer<typeof ColorPaletteSchema>
export type TemplatesConfig = z.infer<typeof TemplatesConfigSchema>

export const DEFAULT_CLEANAPP_CONFIG: CleanAppThemeConfig = {
  hero: {
    title: 'Undangan Digital Terbaik untuk Momen Spesial Anda',
    subtitle: 'Buat undangan pernikahan yang indah dan mudah dibagikan dengan desain modern dan elegan',
    ctaText: 'Mulai Sekarang',
    backgroundImage: '',
    heroImage: '',
  },
  features: {
    title: 'Fitur Unggulan',
    items: [
      {
        icon: '✨',
        title: 'Desain Modern',
        description: 'Template undangan dengan desain modern dan elegan yang dapat disesuaikan dengan tema acara Anda',
      },
      {
        icon: '📱',
        title: 'Mobile Friendly',
        description: 'Tampilan sempurna di semua perangkat, dari smartphone hingga desktop',
      },
      {
        icon: '🎨',
        title: 'Kustomisasi Penuh',
        description: 'Sesuaikan warna, teks, dan gambar sesuai keinginan Anda',
      },
    ],
  },
  pricing: {
    title: 'Paket Harga',
    tiers: [
      {
        name: 'Basic',
        price: 'Rp 150.000',
        features: ['1 Template Undangan', 'Unlimited Tamu', 'Galeri Foto (10 foto)', 'Musik Latar'],
        ctaText: 'Pilih Paket',
        recommended: false,
      },
      {
        name: 'Premium',
        price: 'Rp 250.000',
        features: ['3 Template Undangan', 'Unlimited Tamu', 'Galeri Foto (30 foto)', 'Musik Latar', 'Custom Domain'],
        ctaText: 'Pilih Paket',
        recommended: true,
      },
    ],
  },
  faq: {
    title: 'Pertanyaan Umum',
    items: [
      {
        question: 'Bagaimana cara memesan undangan digital?',
        answer: 'Anda dapat memesan dengan mengklik tombol "Mulai Sekarang" dan mengisi formulir pemesanan. Tim kami akan segera menghubungi Anda.',
      },
      {
        question: 'Berapa lama proses pembuatan undangan?',
        answer: 'Proses pembuatan undangan biasanya memakan waktu 1-3 hari kerja setelah semua data dan materi diterima.',
      },
      {
        question: 'Apakah bisa revisi desain?',
        answer: 'Ya, kami menyediakan revisi gratis hingga desain sesuai dengan keinginan Anda.',
      },
    ],
  },
  templates: {
    enabled: true,
    title: 'Pilih Template Favorit',
    subtitle: 'Berbagai pilihan template untuk berbagai acara yang dapat disesuaikan dengan keinginan Anda',
    useExternalCatalog: true,
    previewButtonText: 'Lihat Katalog',
    orderButtonText: 'Pesan Sekarang',
    buttonColor: '#d4af37',
    buttonTextColor: '#172a26',
  },
  footer: {
    text: 'Buat momen spesial Anda lebih berkesan dengan undangan digital kami',
    contactEmail: 'info@example.com',
    contactPhone: '+62 812-3456-7890',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      whatsapp: '',
    },
  },
  colors: {
    primary: '#FF6B9D',
    secondary: '#C8E6F5',
    accent: '#FFD700',
    background: '#FFF8F0',
    backgroundSecondary: '#FFFFFF',
    textPrimary: '#2D3748',
    textSecondary: '#718096',
  },
}
