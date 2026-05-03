# CleanApp Theme - Quick Start Guide

## 🚀 Quick Start (5 Menit)

### Step 1: Aktifkan Tema CleanApp

Jalankan query SQL berikut untuk mengaktifkan tema CleanApp pada member:

```sql
-- Ganti 'your-slug' dengan slug member Anda
UPDATE "Member" 
SET "landingPageTheme" = 'cleanapp' 
WHERE slug = 'your-slug';
```

### Step 2: Akses Landing Page

Buka browser dan akses:
```
http://localhost:3000/your-slug
```

Tema CleanApp akan otomatis menggunakan konfigurasi default.

### Step 3: Kustomisasi (Optional)

Untuk kustomisasi tema, update `landingPageConfig` di database:

```sql
UPDATE "Member" 
SET "landingPageConfig" = '{
  "hero": {
    "title": "Undangan Digital Terbaik",
    "subtitle": "Buat undangan pernikahan dan ulang tahun yang memorable",
    "ctaText": "Mulai Sekarang",
    "image": "/images/hero-cleanapp.jpg"
  },
  "colors": {
    "primary": "#EC4899",
    "secondary": "#8B5CF6",
    "accent": "#F59E0B",
    "background": "#FFFFFF",
    "backgroundSecondary": "#F9FAFB",
    "textPrimary": "#111827",
    "textSecondary": "#6B7280"
  }
}'::jsonb
WHERE slug = 'your-slug';
```

## 📱 Preview di Mobile

Untuk test di mobile:

1. **Chrome DevTools**: Tekan F12 → Toggle device toolbar (Ctrl+Shift+M)
2. **Pilih device**: iPhone 12 Pro, Samsung Galaxy S20, dll
3. **Test features**:
   - Scroll untuk lihat animasi
   - Klik category pills untuk filter templates
   - Test bottom navigation
   - Test order form

## 🎨 Kustomisasi Warna

Contoh color palettes yang bisa digunakan:

### Soft Pink (Default)
```json
{
  "primary": "#EC4899",
  "secondary": "#8B5CF6",
  "accent": "#F59E0B"
}
```

### Ocean Blue
```json
{
  "primary": "#0EA5E9",
  "secondary": "#06B6D4",
  "accent": "#10B981"
}
```

### Sunset Orange
```json
{
  "primary": "#F97316",
  "secondary": "#FB923C",
  "accent": "#FBBF24"
}
```

### Elegant Purple
```json
{
  "primary": "#9333EA",
  "secondary": "#A855F7",
  "accent": "#EC4899"
}
```

## 📝 Kustomisasi Konten

### Hero Section
```json
{
  "hero": {
    "title": "Judul Hero Anda",
    "subtitle": "Subtitle yang menarik",
    "ctaText": "Text Button CTA",
    "image": "/path/to/image.jpg"
  }
}
```

### Features
```json
{
  "features": {
    "title": "Fitur Unggulan",
    "items": [
      {
        "icon": "Sparkles",
        "title": "Desain Modern",
        "description": "Template dengan desain terkini"
      },
      {
        "icon": "Zap",
        "title": "Cepat & Responsif",
        "description": "Loading cepat di semua device"
      }
    ]
  }
}
```

### Pricing
```json
{
  "pricing": {
    "title": "Paket Harga",
    "tiers": [
      {
        "name": "Basic",
        "price": "Rp 150.000",
        "features": [
          "1 Template",
          "Unlimited Tamu",
          "RSVP Online"
        ],
        "ctaText": "Pilih Paket",
        "recommended": false
      },
      {
        "name": "Premium",
        "price": "Rp 250.000",
        "features": [
          "5 Template",
          "Unlimited Tamu",
          "RSVP Online",
          "Custom Domain"
        ],
        "ctaText": "Pilih Paket",
        "recommended": true
      }
    ]
  }
}
```

### FAQ
```json
{
  "faq": {
    "title": "Pertanyaan Umum",
    "items": [
      {
        "question": "Bagaimana cara memesan?",
        "answer": "Anda bisa memesan melalui form di bawah atau hubungi kami via WhatsApp."
      },
      {
        "question": "Berapa lama proses pembuatan?",
        "answer": "Proses pembuatan undangan memakan waktu 1-2 hari kerja."
      }
    ]
  }
}
```

### Footer
```json
{
  "footer": {
    "text": "Undangan Digital Terbaik untuk Momen Spesial Anda",
    "contactEmail": "hello@example.com",
    "contactPhone": "+62 812-3456-7890",
    "socialMedia": {
      "instagram": "https://instagram.com/yourhandle",
      "facebook": "https://facebook.com/yourpage",
      "whatsapp": "https://wa.me/6281234567890"
    }
  }
}
```

## 🧪 Testing Checklist

Setelah setup, test fitur-fitur berikut:

- [ ] Hero section tampil dengan benar
- [ ] Features section tampil dalam grid
- [ ] Template grid bisa difilter by category
- [ ] Pricing tiers tampil dengan recommended badge
- [ ] Order form bisa submit (cek console log)
- [ ] FAQ accordion bisa expand/collapse
- [ ] Footer tampil dengan social media links
- [ ] Bottom nav muncul di mobile
- [ ] Bottom nav scroll ke section yang benar
- [ ] Active section highlighted di bottom nav

## 🐛 Troubleshooting

### Tema tidak muncul
```sql
-- Cek theme setting
SELECT slug, "landingPageTheme" 
FROM "Member" 
WHERE slug = 'your-slug';

-- Harusnya return: cleanapp
```

### Konfigurasi tidak apply
```sql
-- Cek config
SELECT slug, "landingPageConfig" 
FROM "Member" 
WHERE slug = 'your-slug';

-- Jika NULL, akan pakai default config
```

### Form tidak bisa submit
1. Cek console browser untuk error
2. Cek network tab untuk API call
3. Pastikan `/api/orders` endpoint berjalan

## 📚 Next Steps

1. **Kustomisasi Lengkap**: Lihat [CLEANAPP_THEME.md](./CLEANAPP_THEME.md) untuk dokumentasi lengkap
2. **Admin Dashboard**: Tunggu implementasi admin UI untuk kustomisasi via dashboard
3. **Production Deploy**: Deploy ke production setelah testing lengkap

## 💡 Tips

1. **Test di Real Device**: Gunakan ngrok atau deploy ke staging untuk test di real mobile device
2. **Optimize Images**: Compress images sebelum upload untuk performa lebih baik
3. **Color Contrast**: Pastikan contrast ratio text dan background memenuhi WCAG AA (4.5:1)
4. **Content Length**: Jaga agar text tidak terlalu panjang untuk readability di mobile

## 🎯 Best Practices

### Hero Section
- Title: Max 60 karakter
- Subtitle: Max 120 karakter
- Image: Landscape, min 1920x1080px

### Features
- Jumlah: 3-6 items (optimal: 4)
- Title: Max 30 karakter
- Description: Max 100 karakter

### Pricing
- Jumlah tiers: 2-4 (optimal: 3)
- Features per tier: 3-7 items
- Highlight 1 tier sebagai recommended

### FAQ
- Jumlah items: 5-10 (optimal: 6-8)
- Question: Max 100 karakter
- Answer: Max 300 karakter

## 🚀 Performance Tips

1. **Lazy Load Images**: Sudah implemented dengan Next.js Image
2. **Minimize Config Size**: Jangan simpan data yang tidak perlu di config
3. **Cache API Responses**: Consider caching `/api/public/settings`
4. **Optimize Animations**: Sudah optimized dengan Framer Motion

## 📞 Support

Butuh bantuan? Hubungi:
- Email: support@example.com
- WhatsApp: +62 812-3456-7890
- Documentation: [CLEANAPP_THEME.md](./CLEANAPP_THEME.md)
