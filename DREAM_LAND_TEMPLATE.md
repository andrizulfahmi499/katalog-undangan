# 🎉 Panduan Template Dream Land

## Deskripsi Template
Template **Dream Land** adalah template premium untuk undangan pernikahan yang terinspirasi dari `dearmylove.org/template/dream-land`. Template ini menampilkan desain elegan dengan dekorasi floral dan layout yang komprehensif.

## Fitur-Fitur Utama

### ✅ Fitur Yang Tersedia

1. **Hero Section** 
   - Tampilan hero dengan nama pasangan dan deskripsi
   - Background dekoratif dengan ornamen geometri
   - Call-to-action buttons

2. **Profil Pasangan** 
   - Foto placeholder untuk mempelai pria dan wanita
   - Informasi keluarga
   - Layout responsif dengan grid 2 kolom

3. **Acara Pernikahan Multiple Events** 
   - 3 event cards: Holy Matrimony, Resepsi, Tea Ceremony
   - Setiap event menampilkan: hari, tanggal, waktu, lokasi
   - Button "Lihat Maps" untuk setiap acara
   - Styling yang berbeda per event dengan aksen warna yang unik

4. **Countdown Timer** 
   - Hitung mundur hingga hari pernikahan
   - Menampilkan: Hari, Jam, Menit, Detik
   - Button "Tambah ke Kalender"

5. **Galeri Foto** 
   - Grid 3 kolom untuk 6 foto
   - Layout responsif 
   - Hover effect pada setiap foto
   - Placeholder untuk foto yang belum diupload

6. **Video Section**
   - Pre-Wedding Video dengan play button
   - Live Streaming dengan indikator "LIVE" merah
   - Deskripsi untuk setiap video

7. **RSVP Form**
   - Input nama lengkap
   - Radio button untuk "Akankah hadir?"
   - Checkbox untuk memilih acara yang dihadiri
   - Textarea untuk ucapan dan doa
   - Submit button dengan styling modern

8. **Wishing Well (Kolom Ucapan)**
   - Menampilkan list ucapan dari tamu/keluarga
   - Setiap ucapan menampilkan: nama, tanggal, pesan
   - Emoji heart di setiap ucapan
   - Design card yang elegan

9. **Wedding Gift / Digital Envelope**
   - Informasi rekening bank untuk hadiah
   - Menampilkan: Bank, Account Number, Account Name
   - Button copy nomor rekening
   - Styling gradient pink-rose

10. **Thank You Section**
    - Pesan terima kasih
    - Motivasi untuk hadir
    - Share buttons (copy link & social media)

## Warna & Styling

### Color Scheme
- **Primary**: Pink (#FFB6C1 / #FFC0CB)
- **Secondary**: Rose (#F4A0B9 / #E6A8D7)
- **Accent**: Gold / Yellow
- **Background**: Soft cream (#FAF8F3 / #F5F0EB / #F9F5F1)
- **Text**: Slate gray (#1F2937 / #374151)

### Design Features
- Border radius yang rounded (20px - 48px)
- Shadow yang subtle
- Backdrop blur pada beberapa elemen
- Gradient backgrounds pada buttons
- Responsive grid layouts

## Cara Menggunakan Template

### 1. Di Admin Editor

1. Buka halaman **Admin Editor** (`/admin/editor`)
2. Pada bagian **"Isi Data Undangan"**, pilih template **"Dream Land"**
3. Template card akan menampilkan:
   - Judul: "Dream Land"
   - Kategori: "Pernikahan"
   - Deskripsi: "Tema elegan dengan dekorasi floral, countdown, gallery, video, RSVP, dan wishing well."
   - Aksen warna: Pink ke Yellow gradient

### 2. Isi Data Undangan

```
- Nama Undangan: "Akbar & Madia"
- Jenis Acara: "Pernikahan"
- Judul Acara: "Resepsi Pernikahan"
- Tanggal: Pilih tanggal pernikahan
- Lokasi: Alamat venue pernikahan
- Pesan Undangan: (Akan otomatis terisi dengan default message Dream Land)
- Pilih Member: Pilih member yang akan mengelola undangan
```

### 3. Simpan Undangan

Setelah mengisi semua data, klik **"Simpan Undangan"**. Sistem akan:
- Membuat undangan di database
- Membuat preview link otomatis dari Vercel domain
- Menampilkan success message dengan link undangan

### 4. Lihat Preview

Klik **"Lihat Preview"** atau buka link undangan untuk melihat template Dream Land yang sudah dibuat.

## Struktur Data

Template Dream Land memerlukan data berikut dari database `Invitations`:

```typescript
{
  id: string
  title: string              // "Akbar & Madia"
  eventName: string          // "Resepsi Pernikahan"
  eventDate: Date            // Tanggal pernikahan
  location: string           // Lokasi acara
  invitationLink: string     // URL undangan
  templateMessage: string    // Pesan default
  templateId: "dream-land"   // Template identifier
  assignedMember?: {
    name: string
    email: string
  }
}
```

## Informasi Teknis

### Files Yang Ditambahkan

1. **`src/components/DreamLandTemplate.tsx`** (522 lines)
   - Client component untuk render template Dream Land
   - Props: `invitation`, `formattedDate`
   - Dependencies: `CopyLinkButton`, `CountdownTimer`, lucide-react icons

2. **`src/lib/invitationTemplates.ts`** (Updates)
   - Tambahan entry template di `TEMPLATE_OPTIONS`
   - ID: `dream-land`
   - Category: `Pernikahan`

3. **`src/app/admin/editor/page.tsx`** (Updates)
   - Tambahan template option di local `TEMPLATE_OPTIONS`
   - Tersedia untuk dipilih saat membuat undangan

4. **`src/app/invitation/[id]/page.tsx`** (Updates)
   - Import `DreamLandTemplate`
   - Conditional rendering: jika `templateId === 'dream-land'`, render `DreamLandTemplate`
   - Fallback ke default template untuk template lain

5. **`public/vectors/ornaments.svg`** (New)
   - SVG assets untuk dekorasi ornamen
   - Berisi symbols: butterfly, flowers, trees, doves
   - Bisa digunakan untuk future enhancements

### Component Dependencies

```
DreamLandTemplate
├── CopyLinkButton ✅
├── CountdownTimer ✅
├── lucide-react icons ✅
└── Tailwind CSS ✅
```

## Customization Guide

### Mengubah Event Details

Edit hardcoded events di `DreamLandTemplate.tsx` (sekitar line 60-120):

```tsx
// Event 1: Holy Matrimony
<h3>Holy Matrimony</h3>
<p>Kamis, 27 Juli 2023</p>
<p>11:00 WIB</p>
```

**Future Enhancement**: Database integration untuk store multiple events per invitation

### Mengubah Warna

Ubah color classes di `DreamLandTemplate.tsx`:

```tsx
// Primary color
className="from-pink-400 to-rose-500"
className="text-pink-600"

// Background
className="bg-gradient-to-b from-[#faf8f3] via-[#f5f0eb] to-[#f9f5f1]"
```

### Menambah Foto Gallery

Edit section gallery (sekitar line 240-255):

```tsx
{[1, 2, 3, 4, 5, 6].map((i) => (
  // Ganti dari placeholder ke real images
  <img src={`/gallery/${i}.jpg`} ... />
))}
```

### Mengaktifkan RSVP Form

RSVP form saat ini adalah UI mockup. Untuk mengaktifkan:

1. Tambahkan API endpoint `/api/rsvp` untuk submit form
2. Connect form ke database table `RSVP` atau `InvitationResponses`
3. Integrasikan validasi dan error handling

## Kebutuhan Untuk Deployment

### Assets Yang Diperlukan (Optional)

Untuk tampilan yang lebih sempurna, siapkan:

1. **Couple Photos**
   - Foto mempelai pria: 400x400px minimum
   - Foto mempelai wanita: 400x400px minimum
   - Upload ke private CDN atau folder `/public/uploads/`

2. **Gallery Photos**
   - 6-12 foto couple: 600x600px
   - Format: jpg, png, atau webp
   - Upload ke folder `/public/gallery/`

3. **SVG Ornaments** (Optional)
   - Custom butterfly, flower, tree SVGs
   - Place di `public/vectors/`
   - Update DreamLandTemplate untuk import

### Environment Variables

```env
# Sudah tercakup di deployment
DATABASE_URL=...
NEXT_PUBLIC_API_URL=...
```

## Testing Checklist

- [ ] Template muncul di admin editor
- [ ] Dapat membuat undangan dengan template Dream Land
- [ ] Preview loading tanpa error
- [ ] Countdown timer berfungsi
- [ ] Copy link button berfungsi
- [ ] Responsive di mobile (iPhone 12, etc)
- [ ] Responsive di tablet (iPad, etc)
- [ ] Responsive di desktop
- [ ] Semua buttons clickable
- [ ] Styling matches soft pastels theme

## Known Limitations

1. **Hardcoded Events**: Event details masih di-hardcode, bukan dari database
2. **RSVP Form**: Belum terintegrasi dengan database
3. **Gallery & Photos**: Menggunakan placeholder emoji, bukan foto asli
4. **Wishing Well**: Data masih di-hardcode di component state
5. **Video Section**: Placeholder, bukan video asli
6. **Maps Integration**: Button "Lihat Maps" tidak terintegrasi

## Future Enhancements

### Phase 1 (High Priority)
- [ ] Database schema untuk multiple events per invitation
- [ ] File upload untuk couple photos dan gallery
- [ ] RSVP form database integration
- [ ] Dynamic wishing well dari database

### Phase 2 (Medium Priority)
- [ ] YouTube/Vimeo video integration
- [ ] Google Maps embed untuk location
- [ ] Custom color picker untuk theme personalization
- [ ] Animated backgrounds dan transitions

### Phase 3 (Nice to Have)
- [ ] Music/background audio support
- [ ] 3D model decorations
- [ ] AR filter untuk pre-wedding experience
- [ ] Blockchain-based invitation digital certificate

## Support & Questions

Untuk pertanyaan atau bug reports tentang template Dream Land:
1. Check file `/src/components/DreamLandTemplate.tsx`
2. Review TROUBLESHOOTING.md di project root
3. Check Vercel logs untuk server-side errors

---

**Last Updated**: April 11, 2026
**Status**: ✅ Live on Production
**Version**: 1.0.0
