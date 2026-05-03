# Landing Page Design Reference for Figma

## 📋 Overview
Dokumen ini berisi struktur lengkap landing page yang dapat Anda gunakan sebagai referensi untuk mendesain di Figma.

---

## 🎨 Color Palette

### Primary Colors (Dark Theme - Default)
| Name | Hex Code | Usage |
|------|---------|-------|
| Dark Green Primary | `#172a26` | Background utama |
| Dark Green Secondary | `#1a2f2a` | Background section |
| Dark Green Tertiary | `#1c352e` | Background gradient |
| White | `#ffffff` | Text utama |
| White 70% | `rgba(255,255,255,0.7)` | Text sekunder |
| White 45% | `rgba(255,255,255,0.45)` | Text sub-title |

### Accent Colors
| Name | Hex Code | Usage |
|------|---------|-------|
| Purple Light | `#A5B4FC` | Accent 1 |
| Purple Medium | `#C4B5FD` | Accent 2 |
| Pink Light | `#FBCFE8` | Accent 3 |
| Populer Badge | `#172a26` | Badge highlight |

### Light Theme
| Name | Hex Code | Usage |
|------|---------|-------|
| Background | `#d1d9e6` | Main bg |
| Surface | `#b8bec7` | Border/shadow |
| Text Primary | `#2d3748` | Text utama |
| Text Secondary | `#6b7280` | Text sekunder |
| Text Muted | `#8b8fa3` | Text muted |
| Text Light | `#9ca3af` | Text sangat muted |

---

## 🏷️ Typography

### Font Families
| Name | Font Family | Usage |
|------|------------|-------|
| Display | `'Josefin Sans', sans-serif` | Heading, judul |
| Body | `'Arapey', Georgia, serif` | Body text |
| UI | `'Lato', sans-serif` | UI elements, label |

### Font Sizes (Responsive)
| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Hero Title | 1.875rem (3xl) | 2.25rem (4xl) | 3rem (5xl) |
| Section Title | 1.25rem (xl) | 1.5rem (2xl) | 2rem (3xl) |
| Card Title | 1rem (lg) | 1.125rem | 1.25rem |
| Body | 0.875rem (sm) | 1rem | 1.125rem |
| Button | 0.75rem (xs) | 0.875rem | 1rem |

### Letter Spacing
- **Uppercase**: `0.15em` - `0.35em` (tracking-widest)
- **Normal**: Default

---

## 📱 Layout Structure

### Halaman Lengkap (Semua Section)

```
┌─────────────────────────────────────────┐
│  SPLASH SCREEN (Preloader)              │
│  - Rose SVG Animation                  │
│  - Loading 3.2 detik                │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  FIXED NAV BAR (Bottom Floating)         │
│  [Home] [Katalog] [Pricing] [Kontak] │
│  - Fixed position bottom             │
│  - Glassmorphism effect            │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  SIDEBAR (Left Fixed)                 │
│  - Logo (atas kiri)                   │
│  - Menu items                       │
│  - Collapse on mobile               │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  HERO SECTION                         │
│  - Parallax Background (Floral SVG) │
│  - Title: "YOUR ONE STOP..."          │
│  - Subtitle                         │
│  - CTA Buttons                      │
│  - 3D Phone Mockup                 │
│  - Scroll indicator               │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  INTRO SECTION (Image + Text)          │
│  - Left: Image placeholder           │
│  - Right: Value proposition       │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  FEATURE ROWS (3x)                   │
│  1. All-in-One Solution             │
│  2. Mudah Digunakan                 │
│  3. Layanan Bantuan                │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  SMART DASHBOARD SECTION             │
│  - Left: Image                     │
│  - Right: Description + Tags      │
│  Tags: Guest Management, WA Blast  │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  E-INVITATION SECTION               │
│  - Left: Description + Tags       │
│  - Right: Phone mockup             │
│  Tags: Secure, Animated, Custom    │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  CATALOG SECTION                    │
│  - Template cards grid            │
│  - Navigation tabs              │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  PRICING SECTION                    │
│  - 3 Pricing cards              │
│  - Highlighted middle card     │
│  - Features list              │
│  - CTA buttons               │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  ORDER FORM SECTION                 │
│  - Contact form                │
│  - Input fields              │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  FAQ SECTION                       │
│  - Accordion items             │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  FOOTER                          │
│  - Logo + Description          │
│  - Product Links             │
│  - Company Links             │
│  - Contact Info             ��
│  - Social Media             │
│  - Copyright                │
└─────────────────────────────────────────┘
```

---

## 🔧 Component Specifications

### 1. Splash Screen (Preloader)
- **Duration**: 3.2 detik
- **Elements**:
  - Rose SVG path (large, centered)
  - Fade out animation
- **Color**: White on dark green background

### 2. Floating Nav Bar (Bottom)
- **Position**: Fixed bottom, center
- **Style**: Glassmorphism (backdrop-blur, translucent)
- **Items**: Home | Katalog | Pricing | FAQ
- **Behavior**: Auto-highlight based scroll position
- **Mobile**: Expandable from icon

### 3. Sidebar (Left)
- **Position**: Fixed left (hidden on mobile < md)
- **Width**:
  - Mobile: Hidden
  - Tablet: `100px` (labels visible)
  - Desktop: `40px` (icon only, expand on hover)
- **Background**: `transparent` or `#172a26`

### 4. Hero Section
- **Height**: `min-h-screen` - padding `pt-20`
- **Background**: Gradient `linear-gradient(160deg, #172a26 0%, #1a2f2a 60%, #1c352e 100%)`
- **Title**: 
  - Font: Josefin Sans, Bold
  - Letter-spacing: `0.15em`
  - Text: "YOUR ONE STOP WEDDING KIT"
- **Buttons**:
  - Primary: White background
  - Secondary: Border white/30
- **Parallax**: Floral SVG di kiri-kanan dengan opacity 0.2

### 5. Product3DModel (Phone Mockup)
- **Size**: `max-w-xs` (mobile), `max-w-sm` (desktop)
- **Height**: `320px`
- **Style**: 3D phone frame dengan screen content

### 6. Feature Cards
- **Grid**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- **Layout**: 
  - Icon centered (gradient background)
  - Title centered
  - Description centered
  - Decorative sparkle di corner
- **Hover Effect**: 
  - `scale: 1.03`
  - `y: -12`
  - `rotate: ±2deg`

### 7. Pricing Cards
- **Grid**: `grid-cols-1 sm:grid-cols-3`
- **Highlight Card** (middle):
  - Background: `#ededed`
  - Shadow: `shadow-2xl shadow-black/40`
  - Badge: "✦ Populer" (top center)
- **Normal Cards**:
  - Background: `white/10 backdrop-blur-md`
  - Border: `white/15`
- **Content**:
  - Icon + Name
  - Price (Arapey font)
  - Features list with Check icon
  - CTA button

### 8. Catalog Section
- **Tabs**: Categories (Undangan Pernikahan, Ultah, dll)
- **Grid**: Template cards
- **Navigation**: Arrow buttons

### 9. Order Form
- **Fields**:
  - Nama lengkap
  - Nomor WhatsApp
  - Tanggal pernikahan
  - Pilihan paket
  - Pesan tambahan
- **Style**: Glassmorphism inputs

### 10. Footer
- **Background**: `white/5 backdrop-blur-xl`
- **Layout**: 4 columns
- **Social Icons**: Facebook, Instagram, Twitter, Youtube
- **Links**: Product, Company, Support, Contact

---

## 🎯 Animation Specifications

### Scroll Reveal
```javascript
// Initial state
{ opacity: 0, y: 60 }

// Animate to
{ opacity: 1, y: 0 }

// Transition
{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: staggered }
```

### Parallax Effect
```javascript
// Scroll transform
const floralLeftY = useTransform(scrollY, [0, 1200], [0, -80])
const floralRightY = useTransform(scrollY, [0, 1200], [0, -55])
```

### Hover Effects
```javascript
// Cards
whileHover={{ y: -12, scale: 1.03, transition: { duration: 0.3 } }}

// Buttons
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

### Breathing Animation (Floral SVG)
```javascript
// Duration varies per element
{ duration: 4-6, repeat: Infinity, ease: 'easeInOut' }

// Opacity: 0.8 - 1.0
// Scale: 0.98 - 1.02
// Y offset: 0 - 8px
```

---

## 📐 Responsive Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|---------|
| Mobile | `< 640px` | Single column, bottom nav |
| Tablet | `640px - 1024px` | 2 columns, expanded sidebar |
| Desktop | `> 1024px` | Full layout, floating nav |
| Wide | `> 1280px` | Max width `5xl` (64rem) |

---

## 🖼️ Asset References

### SVG Files (Floral)
- `/public/svg/dearmylove.org-0.svg` sampai `-16.svg`
- Usage: Paralax background decorations

### Images
- `/public/templates/landing page/dreamylove/` - Template previews
- `/public/phone-mockup.png` - Phone frame
- `/public/logo.png` - Logo

### Fonts (Google Fonts)
```
<link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;700&family=Arapey&family=Lato:wght@400;700&display=swap" rel="stylesheet">
```

---

## 📝 Design Checklists untuk Figma

### Hero Section
- [ ] Background gradient
- [ ] Parallax floral elements (left & right)
- [ ] Title with Josefin Sans font
- [ ] Subtitle with Arapey font
- [ ] Primary & secondary CTA buttons
- [ ] Phone 3D mockup
- [ ] Scroll indicator

### Navigation
- [ ] Floating bottom nav bar
- [ ] Glassmorphism effect
- [ ] Auto-highlight active section
- [ ] Mobile icon-only mode
- [ ] Tablet expanded labels

### Features Section
- [ ] 3-column grid layout
- [ ] Icon containers with gradient
- [ ] Centered text
- [ ] Sparkle decorations
- [ ] Hover scale effects

### Pricing Section
- [ ] 3 cards with different styles
- [ ] Highlighted middle card
- [ ] "Populer" badge animation
- [ ] Feature check lists
- [ ] CTA buttons

### Footer
- [ ] 4-column layout
- [ ] Social media icons
- [ ] Contact information
- [ ] Copyright text

---

## 🔗 Usage Notes

1. **Export untuk Figma**: Screenshoot setiap section sebagai referensi
2. **Komponen**: Buat komponen terpisah untuk reuse
3. **Variant**: Gunakan variants untuk light/dark theme
4. **Auto Layout**: Enable auto layout untuk responsive design
5. **Constraints**: Gunakan constraints untuk element positioning

---

## 📞 Support

Jika ada pertanyaan tentang struktur atau komponen tertentu, hubungi tim developer.
