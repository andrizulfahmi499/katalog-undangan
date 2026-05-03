# CleanApp Theme Documentation

## Overview

CleanApp adalah tema landing page modern dengan desain mobile app yang bersih dan elegan. Tema ini terinspirasi dari aplikasi mobile Katalog ID dan menyediakan sistem kustomisasi lengkap untuk teks, gambar, dan warna.

## Features

### ✨ Komponen Utama

1. **Hero Section** (`CleanAppHero`)
   - Hero text dan subtitle yang dapat dikustomisasi
   - Hero image dengan fallback placeholder
   - CTA button dengan modal login
   - Responsive layout (mobile/tablet/desktop)
   - Animasi entrance dengan Framer Motion

2. **Features Section** (`CleanAppFeatures`)
   - Grid layout responsif (1/2/3 kolom)
   - Card-based design dengan icon, title, dan description
   - Staggered entrance animations
   - Hover effects dengan scale dan shadow

3. **Template Grid** (`CleanAppTemplateGrid`)
   - Category filtering dengan pills
   - Template cards dengan lazy loading images
   - Responsive grid layout
   - Empty state handling
   - Smooth animations

4. **Pricing Section** (`CleanAppPricing`)
   - Pricing tiers dalam card layout
   - Recommended tier highlighting
   - Feature list dengan checkmarks
   - Responsive grid (1/2/3 kolom)
   - Hover effects dan animations

5. **Order Form** (`CleanAppOrderForm`)
   - Form validation dengan react-hook-form + Zod
   - Input fields: name, email, phone, event type, message
   - Loading, success, dan error states
   - Mobile-optimized input types
   - Touch-friendly sizing (min 44px)

6. **FAQ Section** (`CleanAppFAQ`)
   - Accordion pattern dengan Radix UI
   - Single-item expansion
   - Smooth expand/collapse animations
   - Keyboard navigation support
   - Accessible ARIA attributes

7. **Footer** (`CleanAppFooter`)
   - Contact information (email, phone)
   - Social media links (Facebook, Instagram, Twitter, WhatsApp)
   - Dynamic copyright dengan current year
   - Responsive multi-column layout

8. **Bottom Navigation** (`CleanAppBottomNav`)
   - Fixed position di bottom pada mobile
   - Hidden pada desktop (>= 768px)
   - Scroll-to-section behavior
   - Active section tracking dengan Intersection Observer
   - Touch-friendly navigation items

## Installation & Usage

### 1. Database Setup

Tema CleanApp sudah terintegrasi dengan database. Pastikan Prisma schema sudah di-migrate:

```bash
npx prisma db push
npx prisma generate
```

### 2. Mengaktifkan Tema CleanApp

Update `landingPageTheme` pada member di database:

```sql
UPDATE "Member" 
SET "landingPageTheme" = 'cleanapp' 
WHERE slug = 'your-member-slug';
```

Atau melalui admin dashboard (jika sudah diimplementasi).

### 3. Kustomisasi Tema

Konfigurasi tema disimpan di `Member.landingPageConfig` sebagai JSON. Struktur konfigurasi:

```typescript
{
  hero: {
    title: string
    subtitle: string
    ctaText: string
    image: string
  },
  features: {
    title: string
    items: Array<{
      icon: string
      title: string
      description: string
    }>
  },
  templates: {
    title: string
    subtitle: string
  },
  pricing: {
    title: string
    tiers: Array<{
      name: string
      price: string
      features: string[]
      ctaText: string
      recommended: boolean
    }>
  },
  faq: {
    title: string
    items: Array<{
      question: string
      answer: string
    }>
  },
  footer: {
    text: string
    contactEmail: string
    contactPhone: string
    socialMedia: {
      facebook?: string
      instagram?: string
      twitter?: string
      whatsapp?: string
    }
  },
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    backgroundSecondary: string
    textPrimary: string
    textSecondary: string
  }
}
```

### 4. Default Configuration

Jika tidak ada konfigurasi custom, sistem akan menggunakan default configuration dari `src/lib/schemas/cleanapp-theme.ts`.

## API Endpoints

### GET `/api/public/settings`

Mengambil konfigurasi tema untuk member tertentu.

**Query Parameters:**
- `slug` (optional): Member slug
- `memberId` (optional): Member ID

**Response:**
```json
{
  "theme": "cleanapp",
  "config": { /* CleanApp configuration */ }
}
```

### POST `/api/admin/theme-config`

Menyimpan konfigurasi tema (admin only).

**Request Body:**
```json
{
  "theme": "cleanapp",
  "config": { /* CleanApp configuration */ }
}
```

### POST `/api/orders`

Menangani form submission dari order form.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "eventType": "Pernikahan" | "Ultah" | "Lainnya",
  "message": "string (optional)"
}
```

## Design Principles

### 🎨 Mobile-First Design

Semua komponen dioptimalkan untuk mobile sebagai viewport utama:
- Mobile: < 768px (1 kolom)
- Tablet: 768px - 1024px (2 kolom)
- Desktop: > 1024px (3 kolom)

### 🎯 Touch-Friendly

Semua elemen interaktif memiliki ukuran minimum 44x44px untuk kemudahan touch interaction.

### 🎭 Animations

Menggunakan Framer Motion untuk smooth animations:
- Entrance animations dengan stagger effect
- Hover effects dengan scale dan shadow
- Scroll-triggered animations
- Accordion expand/collapse animations

### ♿ Accessibility

- Semantic HTML (header, nav, main, section, footer)
- ARIA labels untuk semua elemen interaktif
- Keyboard navigation support
- Focus indicators yang jelas
- Color contrast compliance (WCAG AA)

### 🎨 Customizable Colors

Soft pastel color palette yang dapat dikustomisasi:
- Primary: Warna utama untuk CTA dan highlights
- Secondary: Warna sekunder untuk accents
- Accent: Warna untuk badges dan special elements
- Background: Warna background utama
- Background Secondary: Warna background alternatif
- Text Primary: Warna teks utama
- Text Secondary: Warna teks sekunder

## Component Architecture

```
CleanAppLanding (Root)
├── CleanAppConfigProvider (Context)
│   └── CleanAppContent
│       ├── CleanAppHero
│       │   └── CleanAppLoginModal
│       ├── CleanAppFeatures
│       ├── CleanAppTemplateGrid
│       │   ├── CleanAppCategoryPills
│       │   └── CleanAppTemplateCard (multiple)
│       ├── CleanAppPricing
│       ├── CleanAppOrderForm
│       ├── CleanAppFAQ
│       ├── CleanAppFooter
│       └── CleanAppBottomNav
```

## File Structure

```
src/
├── components/landing/cleanapp/
│   ├── CleanAppLanding.tsx          # Root component
│   ├── CleanAppHero.tsx             # Hero section
│   ├── CleanAppLoginModal.tsx       # Login modal
│   ├── CleanAppFeatures.tsx         # Features section
│   ├── CleanAppTemplateGrid.tsx     # Template grid
│   ├── CleanAppCategoryPills.tsx    # Category filters
│   ├── CleanAppTemplateCard.tsx     # Template card
│   ├── CleanAppPricing.tsx          # Pricing section
│   ├── CleanAppOrderForm.tsx        # Order form
│   ├── CleanAppFAQ.tsx              # FAQ accordion
│   ├── CleanAppFooter.tsx           # Footer
│   ├── CleanAppBottomNav.tsx        # Bottom navigation
│   └── index.ts                     # Exports
├── context/
│   └── CleanAppConfigContext.tsx    # Theme configuration context
├── lib/schemas/
│   ├── cleanapp-theme.ts            # Zod schemas & default config
│   └── cleanapp-theme.example.ts    # Usage examples
└── app/api/
    ├── public/settings/route.ts     # Public config endpoint
    ├── admin/theme-config/route.ts  # Admin config endpoint
    └── orders/route.ts              # Order form endpoint
```

## Development

### Adding New Components

1. Create component file in `src/components/landing/cleanapp/`
2. Use `useCleanAppConfig` hook untuk akses konfigurasi
3. Follow existing patterns untuk styling dan animations
4. Add TypeScript types dan JSDoc comments
5. Export dari `index.ts`

### Styling Guidelines

- Use Tailwind CSS untuk styling
- Apply theme colors dari `config.colors`
- Use responsive classes: `sm:`, `md:`, `lg:`
- Ensure min-height 44px untuk interactive elements
- Add hover dan focus states

### Animation Guidelines

- Use Framer Motion untuk animations
- Add `viewport={{ once: true }}` untuk scroll animations
- Use stagger effects untuk lists
- Keep animations subtle dan smooth
- Respect `prefers-reduced-motion`

## Testing

### Manual Testing Checklist

- [ ] Test pada mobile viewport (< 768px)
- [ ] Test pada tablet viewport (768px - 1024px)
- [ ] Test pada desktop viewport (> 1024px)
- [ ] Test form validation
- [ ] Test form submission
- [ ] Test category filtering
- [ ] Test accordion expand/collapse
- [ ] Test bottom navigation scroll
- [ ] Test active section tracking
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility

### Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

### Optimizations Implemented

- ✅ Lazy loading untuk images (Next.js Image)
- ✅ Code splitting (dynamic imports untuk modal)
- ✅ Framer Motion animations dengan GPU acceleration
- ✅ Intersection Observer untuk scroll tracking
- ✅ Responsive images dengan srcset
- ✅ Minimal re-renders dengan React context

### Performance Targets

- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100ms

## Troubleshooting

### Tema tidak muncul

1. Cek `landingPageTheme` di database: harus `'cleanapp'`
2. Cek routing di `DynamicLandingClient.tsx`
3. Cek console untuk errors

### Konfigurasi tidak apply

1. Cek `landingPageConfig` di database
2. Cek API endpoint `/api/public/settings`
3. Cek CleanAppConfigContext initialization

### Images tidak muncul

1. Cek image path di configuration
2. Cek Next.js Image configuration
3. Fallback placeholder akan muncul jika image error

### Form submission gagal

1. Cek `/api/orders` endpoint
2. Cek validation schema
3. Cek network tab untuk error details

## Future Enhancements

### Planned Features

- [ ] Admin dashboard untuk kustomisasi tema
- [ ] Image upload functionality
- [ ] Color picker dengan contrast validation
- [ ] Live preview
- [ ] Template preview modal
- [ ] WhatsApp integration untuk order form
- [ ] Email notifications
- [ ] Analytics integration

### Potential Improvements

- [ ] Dark mode support
- [ ] More animation options
- [ ] Custom font support
- [ ] More layout variations
- [ ] A/B testing support
- [ ] SEO optimization
- [ ] PWA support

## Support

Untuk pertanyaan atau issues, silakan hubungi tim development atau buat issue di repository.

## License

Copyright © 2025. All rights reserved.
