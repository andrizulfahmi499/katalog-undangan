# CleanApp Theme - Admin User Guide

Panduan lengkap untuk mengkonfigurasi CleanApp theme melalui admin dashboard.

## Daftar Isi

1. [Pengenalan](#pengenalan)
2. [Mengaktifkan CleanApp Theme](#mengaktifkan-cleanapp-theme)
3. [Konfigurasi Text](#konfigurasi-text)
4. [Konfigurasi Images](#konfigurasi-images)
5. [Konfigurasi Colors](#konfigurasi-colors)
6. [Live Preview](#live-preview)
7. [Menyimpan dan Reset](#menyimpan-dan-reset)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Pengenalan

CleanApp theme adalah landing page modern dengan desain mobile-first yang dapat dikustomisasi sepenuhnya. Theme ini cocok untuk:
- Katalog undangan digital
- Landing page produk
- Portfolio bisnis
- Showcase template

### Fitur Utama
- ✅ Mobile-first responsive design
- ✅ Customizable hero section dengan CTA
- ✅ Feature showcase dengan icons
- ✅ Template grid dengan category filtering
- ✅ Pricing tiers dengan recommended highlighting
- ✅ Order form dengan validation
- ✅ FAQ accordion
- ✅ Footer dengan social media links
- ✅ Full color palette customization
- ✅ Live preview

---

## Mengaktifkan CleanApp Theme

### Langkah 1: Akses Admin Dashboard
1. Login ke admin dashboard di `/admin/dashboard`
2. Scroll ke bagian **"Theme Configuration"**

### Langkah 2: Pilih Member
1. Klik dropdown **"Select Member"**
2. Pilih member yang ingin dikonfigurasi theme-nya

### Langkah 3: Pilih Theme
1. Klik dropdown **"Landing Page Theme"**
2. Pilih **"CleanApp"** dari list
3. Theme akan otomatis berubah dan menampilkan tab konfigurasi

---

## Konfigurasi Text

Tab **Text** berisi semua konten teks yang dapat dikustomisasi.

### Hero Section

**Title** (Wajib)
- Judul utama landing page
- Maksimal 200 karakter
- Contoh: "Undangan Digital Terbaik untuk Momen Spesial Anda"
- Tips: Gunakan kalimat yang menarik dan jelas

**Subtitle** (Opsional)
- Deskripsi pendukung di bawah title
- Maksimal 500 karakter
- Contoh: "Buat undangan pernikahan yang indah dan mudah dibagikan"

**CTA Text** (Wajib)
- Teks tombol call-to-action
- Maksimal 50 karakter
- Contoh: "Mulai Sekarang", "Pesan Sekarang", "Lihat Template"

### Features Section

**Section Title** (Opsional)
- Judul untuk bagian features
- Contoh: "Fitur Unggulan", "Mengapa Memilih Kami"

**Feature Items** (3-6 items)
Setiap feature memiliki:
- **Icon**: Emoji atau karakter (contoh: ✨, 📱, 🎨)
- **Title**: Judul feature (maks 100 karakter)
- **Description**: Deskripsi feature (maks 300 karakter)

Tips:
- Gunakan 3-4 features untuk tampilan optimal
- Pilih icon yang relevan dengan feature
- Deskripsi singkat dan jelas

### Pricing Section

**Section Title** (Opsional)
- Judul untuk bagian pricing
- Contoh: "Paket Harga", "Pilih Paket Anda"

**Pricing Tiers** (1-5 tiers)
Setiap tier memiliki:
- **Name**: Nama paket (contoh: Basic, Premium, Enterprise)
- **Price**: Harga (contoh: Rp 150.000, $99/month)
- **Features**: List fitur (minimal 1, pisahkan dengan enter)
- **CTA Text**: Teks tombol (contoh: "Pilih Paket")
- **Recommended**: Centang untuk highlight tier ini

Tips:
- Tandai 1 tier sebagai "Recommended" untuk highlight
- Urutkan dari harga terendah ke tertinggi
- Gunakan 2-3 tiers untuk tampilan optimal

### FAQ Section

**Section Title** (Opsional)
- Judul untuk bagian FAQ
- Contoh: "Pertanyaan Umum", "FAQ"

**FAQ Items** (3-10 items)
Setiap item memiliki:
- **Question**: Pertanyaan (maks 300 karakter)
- **Answer**: Jawaban (maks 1000 karakter)

Tips:
- Gunakan 5-7 FAQ untuk tampilan optimal
- Jawab pertanyaan yang sering ditanyakan
- Gunakan bahasa yang mudah dipahami

### Footer Section

**Footer Text** (Opsional)
- Tagline atau deskripsi singkat
- Maksimal 500 karakter
- Contoh: "Buat momen spesial Anda lebih berkesan"

**Contact Email** (Opsional)
- Email kontak
- Format: email@example.com

**Contact Phone** (Opsional)
- Nomor telepon kontak
- Format: +62 812-3456-7890

**Social Media** (Opsional)
- Facebook URL
- Instagram URL
- Twitter URL
- WhatsApp number

---

## Konfigurasi Images

Tab **Images** untuk upload gambar.

### Hero Image

**Upload Hero Image**
- Gambar utama di hero section
- Format: JPG, PNG, WebP
- Ukuran rekomendasi: 800x800px (square)
- Maksimal: 5MB
- Tips: Gunakan gambar berkualitas tinggi dengan aspect ratio 1:1

**Background Image** (Opsional)
- Background di belakang hero section
- Format: JPG, PNG, WebP
- Ukuran rekomendasi: 1920x1080px
- Maksimal: 5MB
- Tips: Gunakan gambar dengan opacity rendah agar tidak mengganggu teks

### Feature Icons (Opsional)

**Upload Icon untuk setiap Feature**
- Format: PNG, SVG (dengan background transparan)
- Ukuran rekomendasi: 200x200px
- Maksimal: 2MB per icon
- Tips: Gunakan icon sederhana dan jelas

### Template Preview Images (Opsional)

**Upload Preview untuk setiap Pricing Tier**
- Format: JPG, PNG, WebP
- Ukuran rekomendasi: 600x800px (portrait)
- Maksimal: 5MB per image
- Tips: Screenshot template atau mockup undangan

---

## Konfigurasi Colors

Tab **Colors** untuk customisasi warna.

### Color Palette

**Primary Color**
- Warna utama untuk buttons, links, accents
- Default: #FF6B9D (Pink)
- Tips: Pilih warna yang eye-catching tapi tidak terlalu terang

**Secondary Color**
- Warna pendukung untuk highlights
- Default: #C8E6F5 (Light Blue)
- Tips: Pilih warna yang complement dengan primary

**Accent Color**
- Warna untuk badges, tags, highlights
- Default: #FFD700 (Gold)
- Tips: Gunakan warna yang kontras dengan background

**Background**
- Warna background utama
- Default: #FFF8F0 (Cream)
- Tips: Gunakan warna terang untuk readability

**Background Secondary**
- Warna background untuk cards, modals
- Default: #FFFFFF (White)
- Tips: Sedikit berbeda dari background utama

**Text Primary**
- Warna teks utama (headings, body)
- Default: #2D3748 (Dark Gray)
- Tips: Harus kontras dengan background (min 4.5:1)

**Text Secondary**
- Warna teks sekunder (descriptions, captions)
- Default: #718096 (Medium Gray)
- Tips: Lebih terang dari text primary tapi tetap readable

### Color Contrast Checker

Setelah memilih warna, pastikan:
- ✅ Text Primary on Background: Minimal 4.5:1 (WCAG AA)
- ✅ Text Secondary on Background: Minimal 4.5:1 (WCAG AA)
- ✅ White on Primary: Minimal 3:1 untuk large text (WCAG AA)

Gunakan tool online untuk check contrast:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Coolors Contrast Checker](https://coolors.co/contrast-checker)

### Color Scheme Ideas

**Elegant Pink** (Default)
```
Primary: #FF6B9D
Secondary: #C8E6F5
Accent: #FFD700
Background: #FFF8F0
Text Primary: #2D3748
```

**Professional Blue**
```
Primary: #3B82F6
Secondary: #93C5FD
Accent: #FBBF24
Background: #F8FAFC
Text Primary: #1E293B
```

**Modern Purple**
```
Primary: #8B5CF6
Secondary: #C4B5FD
Accent: #F59E0B
Background: #FAF5FF
Text Primary: #1F2937
```

**Fresh Green**
```
Primary: #10B981
Secondary: #6EE7B7
Accent: #F59E0B
Background: #F0FDF4
Text Primary: #064E3B
```

---

## Live Preview

### Mengaktifkan Preview

1. Klik tombol **"Show Preview"** di kanan atas
2. Preview akan muncul di sebelah kanan form konfigurasi
3. Preview menampilkan landing page dengan konfigurasi real-time

### Fitur Preview

**Real-time Updates**
- Setiap perubahan langsung terlihat di preview
- Tidak perlu save untuk melihat perubahan

**Refresh Preview**
- Klik icon refresh untuk reload preview
- Berguna jika preview tidak update

**Open in New Tab**
- Klik icon external link untuk buka di tab baru
- Berguna untuk test di mobile atau share dengan tim

**Preview Badge**
- Badge "PREVIEW" menandakan ini bukan halaman live
- Konfigurasi belum disimpan ke database

### Tips Menggunakan Preview

1. **Test Responsiveness**: Resize browser untuk test di berbagai ukuran
2. **Check Colors**: Pastikan warna kontras dan readable
3. **Test Interactions**: Klik buttons, accordion, navigation
4. **Verify Content**: Pastikan semua teks dan gambar sesuai

---

## Menyimpan dan Reset

### Menyimpan Konfigurasi

**Tombol Save** (Warna Rose, kanan bawah)
1. Klik tombol **"Save"** di setiap tab
2. Tunggu notifikasi "Configuration saved successfully"
3. Konfigurasi tersimpan ke database
4. Landing page live akan update otomatis

**Kapan Harus Save?**
- Setelah selesai edit di setiap tab
- Sebelum pindah ke member lain
- Sebelum logout dari admin dashboard

### Reset ke Default

**Tombol Reset** (Warna Amber, kiri bawah)
1. Klik tombol **"Reset to Default"** di setiap tab
2. Konfirmasi dialog akan muncul
3. Klik **"Yes, reset"** untuk konfirmasi
4. Konfigurasi akan kembali ke default values

**Warning**: Reset tidak bisa di-undo! Pastikan backup konfigurasi jika perlu.

---

## Best Practices

### Content Writing

**Hero Section**
- ✅ Gunakan value proposition yang jelas
- ✅ CTA yang action-oriented ("Mulai", "Pesan", "Lihat")
- ❌ Jangan terlalu panjang (max 2 baris)

**Features**
- ✅ Fokus pada benefit, bukan fitur teknis
- ✅ Gunakan icon yang relevan
- ✅ Deskripsi singkat (1-2 kalimat)
- ❌ Jangan lebih dari 6 features

**Pricing**
- ✅ Highlight 1 tier sebagai "Recommended"
- ✅ Urutkan dari murah ke mahal
- ✅ Gunakan bullet points untuk features
- ❌ Jangan terlalu banyak tiers (max 3-4)

**FAQ**
- ✅ Jawab pertanyaan yang sering ditanyakan
- ✅ Gunakan bahasa yang mudah dipahami
- ✅ Berikan jawaban lengkap tapi ringkas
- ❌ Jangan terlalu teknis

### Image Guidelines

**Hero Image**
- ✅ High quality (min 800x800px)
- ✅ Square aspect ratio (1:1)
- ✅ Relevant dengan produk/service
- ✅ Compress untuk web (< 500KB)
- ❌ Jangan gunakan gambar blur atau pixelated

**Feature Icons**
- ✅ Simple dan recognizable
- ✅ Consistent style (semua flat atau semua 3D)
- ✅ Transparent background (PNG/SVG)
- ❌ Jangan terlalu detail atau kompleks

**Template Previews**
- ✅ Clear dan readable
- ✅ Portrait orientation (3:4 ratio)
- ✅ Show actual template design
- ❌ Jangan gunakan placeholder atau mockup generic

### Color Selection

**Do's**
- ✅ Test contrast ratio (min 4.5:1)
- ✅ Gunakan color scheme yang consistent
- ✅ Consider brand colors
- ✅ Test di mobile dan desktop

**Don'ts**
- ❌ Jangan gunakan warna terlalu terang untuk text
- ❌ Jangan gunakan warna yang terlalu mirip
- ❌ Jangan abaikan accessibility guidelines
- ❌ Jangan gunakan terlalu banyak warna (max 3-4)

---

## Troubleshooting

### Preview Tidak Muncul

**Problem**: Preview tidak load atau blank
**Solution**:
1. Refresh browser (Ctrl+R atau Cmd+R)
2. Clear browser cache
3. Check console untuk error messages
4. Pastikan member sudah dipilih

### Gambar Tidak Terupload

**Problem**: Upload gambar gagal
**Solution**:
1. Check ukuran file (max 5MB)
2. Check format file (JPG, PNG, WebP)
3. Compress gambar jika terlalu besar
4. Try upload ulang

### Warna Tidak Berubah

**Problem**: Perubahan warna tidak terlihat
**Solution**:
1. Pastikan format hex color benar (#RRGGBB)
2. Click "Save" untuk apply changes
3. Refresh preview
4. Check browser cache

### Konfigurasi Tidak Tersimpan

**Problem**: Setelah save, konfigurasi hilang
**Solution**:
1. Check koneksi internet
2. Check console untuk error messages
3. Pastikan semua field required terisi
4. Try save ulang
5. Contact developer jika masih error

### Landing Page Tidak Update

**Problem**: Landing page live tidak update setelah save
**Solution**:
1. Hard refresh landing page (Ctrl+Shift+R)
2. Clear browser cache
3. Check apakah save berhasil (lihat notifikasi)
4. Wait 1-2 menit untuk cache clear
5. Open di incognito/private window

---

## Support

Jika mengalami masalah atau butuh bantuan:

1. **Check Documentation**
   - [CLEANAPP_THEME.md](./CLEANAPP_THEME.md) - Overview
   - [CLEANAPP_QUICK_START.md](./CLEANAPP_QUICK_START.md) - Quick start
   - [CLEANAPP_COLOR_CONTRAST.md](./CLEANAPP_COLOR_CONTRAST.md) - Color guidelines

2. **Contact Developer**
   - Email: support@example.com
   - WhatsApp: +62 812-3456-7890

3. **Report Bug**
   - GitHub Issues: [katalog-undangan/issues](https://github.com/andrizulfahmi499/katalog-undangan/issues)

---

*Last Updated: 2026-05-03*
*Version: 1.0.0*
