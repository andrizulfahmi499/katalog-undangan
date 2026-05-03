# CleanApp Theme - Testing Guide

## 🎯 Testing Checklist

Demo sudah siap! Ikuti checklist ini untuk test semua fitur CleanApp Theme.

### 📱 Access Information

**Landing Page URL:** http://localhost:3000/demo-cleanapp

**Member Login (Optional):**
- URL: http://localhost:3000/login
- Email: demo-cleanapp@example.com
- Password: demo123

---

## 1️⃣ Desktop Testing (Chrome/Edge/Firefox)

### A. Hero Section ✅
- [ ] **Hero title** tampil: "Undangan Digital Terbaik"
- [ ] **Hero subtitle** tampil dengan benar
- [ ] **CTA button** "Mulai Sekarang" terlihat jelas
- [ ] **Hero image** tampil atau fallback placeholder muncul
- [ ] **Klik CTA button** → Login modal muncul
- [ ] **Login modal** bisa di-close dengan tombol X atau klik outside
- [ ] **Animasi entrance** smooth saat page load

### B. Features Section ✅
- [ ] **Section title** "Fitur Unggulan" tampil
- [ ] **4 feature cards** tampil dalam grid
- [ ] Setiap card menampilkan: icon, title, description
- [ ] **Hover effect** pada card (scale up, shadow enhancement)
- [ ] **Staggered animation** saat scroll ke section
- [ ] **Responsive grid**: 3 kolom di desktop

### C. Template Grid Section ✅
- [ ] **Section title** "Pilih Template Favorit" tampil
- [ ] **Category pills** tampil: Semua, Pernikahan, Ultah
- [ ] **Default**: Semua template tampil (8 templates)
- [ ] **Klik "Pernikahan"**: Hanya template pernikahan tampil (6 templates)
- [ ] **Klik "Ultah"**: Hanya template ultah tampil (2 templates)
- [ ] **Active category** highlighted dengan warna primary
- [ ] **Template cards** tampil dengan:
  - Preview image atau placeholder
  - Template title
  - Category badge
  - "Pilih Template" button
- [ ] **Hover effect** pada card
- [ ] **Klik "Pilih Template"**: Scroll ke order form atau alert muncul

### D. Pricing Section ✅
- [ ] **Section title** "Paket Harga Terjangkau" tampil
- [ ] **3 pricing tiers** tampil: Basic, Premium, Ultimate
- [ ] **Premium tier** memiliki "Rekomendasi" badge
- [ ] **Premium tier** memiliki ring/border highlight
- [ ] Setiap tier menampilkan:
  - Tier name
  - Price
  - Features list dengan checkmarks
  - CTA button
- [ ] **Hover effect** pada pricing card (scale up, lift)
- [ ] **Responsive grid**: 3 kolom di desktop

### E. Order Form Section ✅
- [ ] **Section title** "Pesan Sekarang" tampil
- [ ] **Form fields** tampil:
  - Nama Lengkap (required)
  - Email (required)
  - Nomor Telepon (required)
  - Jenis Acara (dropdown: Pernikahan, Ultah, Lainnya)
  - Pesan (optional, textarea)
- [ ] **Submit tanpa isi**: Error messages muncul
- [ ] **Email invalid**: Error message "Format email tidak valid"
- [ ] **Phone invalid**: Error message dengan format yang benar
- [ ] **Submit valid data**:
  - Loading spinner muncul
  - Success message muncul
  - Form di-clear
  - Success message hilang setelah 5 detik
- [ ] **Input types** sesuai (email, tel, textarea)

### F. FAQ Section ✅
- [ ] **Section title** "Pertanyaan Umum" tampil
- [ ] **6 FAQ items** tampil
- [ ] **Klik FAQ item**: Item expand, chevron rotate
- [ ] **Klik FAQ lain**: Item sebelumnya collapse, item baru expand
- [ ] **Klik item yang sudah open**: Item collapse
- [ ] **Smooth animation** saat expand/collapse
- [ ] **Keyboard navigation**: Tab untuk navigate, Enter untuk toggle

### G. Footer Section ✅
- [ ] **Footer text** tampil
- [ ] **Contact email** tampil dengan mailto link
- [ ] **Contact phone** tampil dengan tel link
- [ ] **Social media icons** tampil (Instagram, Facebook, WhatsApp)
- [ ] **Social media links** buka di new tab
- [ ] **Copyright** tampil dengan current year (2026)
- [ ] **Hover effect** pada contact links dan social icons

### H. Bottom Navigation ❌
- [ ] **Bottom nav TIDAK tampil** di desktop (>= 768px)

---

## 2️⃣ Mobile Testing (Chrome DevTools)

### Setup Mobile View
1. Buka Chrome DevTools (F12)
2. Klik "Toggle device toolbar" (Ctrl+Shift+M)
3. Pilih device: **iPhone 12 Pro** atau **Samsung Galaxy S20**
4. Refresh page

### A. Hero Section (Mobile) ✅
- [ ] **Layout** berubah ke 1 kolom
- [ ] **Text** readable di mobile
- [ ] **CTA button** min 44px height (touch-friendly)
- [ ] **Hero image** responsive

### B. Features Section (Mobile) ✅
- [ ] **Grid** berubah ke 1 kolom
- [ ] **Cards** full width
- [ ] **Spacing** appropriate
- [ ] **Touch-friendly** card interactions

### C. Template Grid (Mobile) ✅
- [ ] **Category pills** scrollable horizontal
- [ ] **Template grid** 1 kolom
- [ ] **Cards** full width
- [ ] **Touch-friendly** buttons

### D. Pricing Section (Mobile) ✅
- [ ] **Pricing grid** 1 kolom
- [ ] **Cards** stacked vertically
- [ ] **Recommended badge** visible
- [ ] **Touch-friendly** CTA buttons

### E. Order Form (Mobile) ✅
- [ ] **Form** full width
- [ ] **Input fields** min 44px height
- [ ] **Keyboard** muncul dengan type yang sesuai:
  - Email field → email keyboard
  - Phone field → number keyboard
  - Message field → text keyboard
- [ ] **Submit button** min 56px height
- [ ] **Error messages** readable

### F. FAQ Section (Mobile) ✅
- [ ] **Accordion** full width
- [ ] **Touch-friendly** tap area
- [ ] **Text** readable saat expanded

### G. Footer (Mobile) ✅
- [ ] **Layout** stacked (1 kolom)
- [ ] **Contact info** centered
- [ ] **Social icons** touch-friendly (44x44px)

### H. Bottom Navigation (Mobile) ✅
- [ ] **Bottom nav TAMPIL** di mobile (< 768px)
- [ ] **Fixed** di bottom viewport
- [ ] **4 nav items** tampil: Home, Templates, Pricing, Contact
- [ ] **Klik "Home"**: Scroll smooth ke hero section
- [ ] **Klik "Templates"**: Scroll smooth ke template grid
- [ ] **Klik "Pricing"**: Scroll smooth ke pricing section
- [ ] **Klik "Contact"**: Scroll smooth ke footer
- [ ] **Active section** highlighted saat scroll
- [ ] **Icons** dan labels jelas
- [ ] **Touch-friendly** (min 44px height)

---

## 3️⃣ Tablet Testing (iPad View)

### Setup Tablet View
1. Chrome DevTools → Toggle device toolbar
2. Pilih device: **iPad Air** atau **iPad Pro**
3. Refresh page

### Checklist
- [ ] **Features grid**: 2 kolom
- [ ] **Template grid**: 2 kolom
- [ ] **Pricing grid**: 2 kolom
- [ ] **Footer**: 2-3 kolom
- [ ] **Bottom nav**: TIDAK tampil (>= 768px)
- [ ] **All sections** readable dan usable

---

## 4️⃣ Animation Testing

### Scroll Animations ✅
- [ ] **Hero section**: Fade in saat page load
- [ ] **Features**: Staggered entrance saat scroll
- [ ] **Template grid**: Staggered entrance saat scroll
- [ ] **Pricing**: Staggered entrance saat scroll
- [ ] **FAQ**: Staggered entrance saat scroll

### Hover Animations (Desktop) ✅
- [ ] **Feature cards**: Scale up + shadow
- [ ] **Template cards**: Scale up + shadow + accent line
- [ ] **Pricing cards**: Scale up + lift + shadow
- [ ] **Buttons**: Scale up + shadow
- [ ] **Social icons**: Scale up

### Interaction Animations ✅
- [ ] **Category pills**: Scale on click
- [ ] **FAQ accordion**: Smooth expand/collapse
- [ ] **Bottom nav**: Icon scale saat active
- [ ] **Form submit**: Loading spinner

---

## 5️⃣ Accessibility Testing

### Keyboard Navigation ✅
- [ ] **Tab** untuk navigate antar elements
- [ ] **Enter/Space** untuk activate buttons
- [ ] **Arrow keys** untuk navigate accordion (Radix UI)
- [ ] **Focus indicators** visible
- [ ] **Skip to content** (jika ada)

### Screen Reader (Optional)
- [ ] **ARIA labels** pada interactive elements
- [ ] **Semantic HTML** (header, nav, main, section, footer)
- [ ] **Alt text** pada images
- [ ] **Form labels** associated dengan inputs

### Color Contrast
- [ ] **Text** readable pada background
- [ ] **Buttons** memiliki sufficient contrast
- [ ] **Links** distinguishable

---

## 6️⃣ Performance Testing

### Page Load
- [ ] **Initial load** < 3 seconds
- [ ] **Images** lazy load saat scroll
- [ ] **No layout shifts** (CLS)
- [ ] **Smooth scrolling**

### Interactions
- [ ] **Category filtering** instant
- [ ] **Accordion** smooth animation
- [ ] **Form validation** real-time
- [ ] **Bottom nav scroll** smooth

---

## 7️⃣ Browser Compatibility

Test di berbagai browser:

### Chrome/Edge ✅
- [ ] All features work
- [ ] Animations smooth
- [ ] No console errors

### Firefox
- [ ] All features work
- [ ] Animations smooth
- [ ] No console errors

### Safari (Mac/iOS)
- [ ] All features work
- [ ] Animations smooth
- [ ] No console errors

---

## 8️⃣ Form Validation Testing

### Valid Submissions ✅
```
Name: John Doe
Email: john@example.com
Phone: 081234567890
Event Type: Pernikahan
Message: Saya ingin pesan undangan
```
**Expected**: Success message, form cleared

### Invalid Email
```
Email: invalid-email
```
**Expected**: "Format email tidak valid"

### Invalid Phone
```
Phone: 123
```
**Expected**: "Nomor telepon tidak valid (contoh: 081234567890 atau +6281234567890)"

### Empty Required Fields
**Expected**: Error messages untuk semua required fields

---

## 9️⃣ Edge Cases Testing

### Empty States
- [ ] **No templates** untuk kategori tertentu: Empty state muncul
- [ ] **No FAQ items**: Section tidak crash
- [ ] **No social media links**: Icons tidak tampil

### Long Content
- [ ] **Long hero title**: Text wrap dengan benar
- [ ] **Long feature description**: Card height adjust
- [ ] **Long FAQ answer**: Accordion height adjust
- [ ] **Long pricing features**: List scrollable atau truncated

### Network Issues
- [ ] **Slow connection**: Loading states tampil
- [ ] **API error**: Error messages user-friendly
- [ ] **Image load fail**: Fallback placeholder muncul

---

## 🐛 Bug Report Template

Jika menemukan bug, catat dengan format:

```
**Bug Title**: [Deskripsi singkat]

**Steps to Reproduce**:
1. Buka http://localhost:3000/demo-cleanapp
2. Klik ...
3. ...

**Expected Behavior**:
[Apa yang seharusnya terjadi]

**Actual Behavior**:
[Apa yang terjadi]

**Environment**:
- Browser: Chrome 120
- Device: Desktop / Mobile (iPhone 12 Pro)
- Viewport: 1920x1080 / 390x844

**Screenshots**:
[Attach screenshot jika ada]

**Console Errors**:
[Copy error dari console jika ada]
```

---

## ✅ Testing Summary

Setelah selesai testing, isi summary:

**Date**: _____________
**Tester**: _____________

**Desktop Testing**: ☐ Pass ☐ Fail
**Mobile Testing**: ☐ Pass ☐ Fail
**Tablet Testing**: ☐ Pass ☐ Fail
**Animation Testing**: ☐ Pass ☐ Fail
**Accessibility Testing**: ☐ Pass ☐ Fail
**Performance Testing**: ☐ Pass ☐ Fail
**Form Validation**: ☐ Pass ☐ Fail

**Total Bugs Found**: _____
**Critical Bugs**: _____
**Minor Bugs**: _____

**Overall Status**: ☐ Ready for Production ☐ Needs Fixes

**Notes**:
_____________________________________________
_____________________________________________
_____________________________________________

---

## 🚀 Next Steps After Testing

1. **Fix Bugs**: Prioritize critical bugs
2. **Optimize Performance**: Jika ada issues
3. **Add Missing Features**: Jika ada yang kurang
4. **Deploy to Staging**: Test di real environment
5. **User Acceptance Testing**: Test dengan real users
6. **Production Deployment**: Deploy ke production

---

## 📞 Support

Jika ada pertanyaan atau menemukan issues:
- Check console untuk error messages
- Check network tab untuk API issues
- Refer to [CLEANAPP_THEME.md](./CLEANAPP_THEME.md) untuk dokumentasi
- Refer to [CLEANAPP_QUICK_START.md](./CLEANAPP_QUICK_START.md) untuk troubleshooting
