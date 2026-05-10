# Implementation Plan: Invitation Catalog Favorites

## Overview

Implementasi fitur katalog undangan dengan static data, dua layout (grid & thumbnail), sistem favorit guest/member, preview modal phone mockup, dan panel favorit di sidebar. Urutan implementasi dimulai dari fondasi data dan skema database, lalu komponen UI, kemudian API routes, dan diakhiri dengan integrasi penuh.

## Tasks

- [-] 1. Skema Database dan Migrasi
  - [x] 1.1 Tambah model `FavoriteTheme` dan field `catalogLayout` di `prisma/schema.prisma`
    - Tambah model `FavoriteTheme` dengan field: `id` (cuid), `memberId`, `themeSlug`, `themeName`, `createdAt`
    - Tambah constraint `@@unique([memberId, themeSlug])` dan `@@index([memberId])`
    - Tambah relasi `favoriteThemes FavoriteTheme[]` di model `Member`
    - Tambah relasi `member Member @relation(...)` di model `FavoriteTheme` dengan `onDelete: Cascade`
    - Tambah field `catalogLayout String @default("grid")` di model `GlobalSetting`
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [x] 1.2 Buat file migrasi Prisma untuk perubahan skema
    - Buat file SQL migration di `prisma/migrations/` untuk menambah tabel `FavoriteTheme` dan kolom `catalogLayout`
    - _Requirements: 10.5_

- [-] 2. Static Theme Data
  - [x] 2.1 Buat file `src/lib/catalogThemes.ts` dengan type `CatalogTheme` dan array `CATALOG_THEMES`
    - Definisikan type `CatalogTheme` dengan field: `slug`, `name`, `category`, `tags`, `imageUrl`, `previewUrl`
    - Isi `CATALOG_THEMES` dengan minimal 80 tema dari `id.akainvitation.com`
    - Setiap `imageUrl` harus mengikuti pola `https://id.akainvitation.com/themes/${slug}/${slug}.webp`
    - Setiap `previewUrl` harus mengikuti pola `https://id.akainvitation.com/preview/${slug}`
    - Ekspor fungsi helper `getCatalogThemeBySlug(slug: string)` dan `getCatalogThemesByCategory(category: string)`
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ]* 2.2 Tulis property test untuk `CATALOG_THEMES` (Property 1)
    - Buat file `src/lib/catalogThemes.test.ts`
    - **Property 1: Theme Data Structural Integrity**
    - **Validates: Requirements 1.2, 1.3, 1.4**
    - Test bahwa setiap tema memiliki `slug`, `name`, `category`, `tags` yang non-empty
    - Test bahwa `imageUrl` dan `previewUrl` mengikuti pola URL yang benar untuk setiap tema

- [-] 3. Custom Hook `useFavorites`
  - [ ] 3.1 Buat file `src/hooks/useFavorites.ts`
    - Definisikan interface `UseFavoritesReturn` dengan `favorites`, `isFavorited`, `toggleFavorite`, `isLoading`
    - Implementasikan logika localStorage untuk guest (key: `guest_favorite_themes`)
    - Implementasikan logika API untuk member (header `x-member-id`)
    - Implementasikan optimistic update dengan rollback saat API gagal
    - Implementasikan fallback ke in-memory state jika localStorage tidak tersedia
    - Implementasikan trigger migrasi saat `memberId` berubah dari null ke ada
    - Gunakan `sonner` untuk toast error/warning
    - _Requirements: 4.2, 4.4, 4.5, 4.6, 5.1, 5.3, 5.4, 5.6, 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 3.2 Tulis property test untuk guest favorite toggle round-trip (Property 4)
    - Buat file `src/hooks/useFavorites.test.ts`
    - **Property 4: Guest Favorite Toggle Round-Trip**
    - **Validates: Requirements 4.2, 4.4**
    - Test bahwa add lalu remove slug menghasilkan slug tidak ada di localStorage

  - [ ]* 3.3 Tulis property test untuk guest favorite state reflection (Property 5)
    - **Property 5: Guest Favorite State Reflection**
    - **Validates: Requirements 4.3**
    - Test bahwa slugs di localStorage tercermin dengan benar di state `favorites`

- [x] 4. API Routes Favorites
  - [ ] 4.1 Buat `src/app/api/member/favorites/route.ts` (GET dan POST)
    - `GET`: Baca header `x-member-id`, query `FavoriteTheme` by `memberId`, return array
    - `POST`: Baca header `x-member-id` dan body `{ themeSlug, themeName }`, upsert ke DB, return 200 (idempotent)
    - Return HTTP 401 jika header `x-member-id` tidak ada atau kosong
    - _Requirements: 9.1, 9.2, 9.5, 9.6_

  - [ ] 4.2 Buat `src/app/api/member/favorites/[slug]/route.ts` (DELETE)
    - `DELETE`: Baca header `x-member-id` dan param `slug`, hapus record dari DB
    - Return HTTP 404 jika record tidak ditemukan, 401 jika tidak ada `x-member-id`
    - _Requirements: 9.3, 9.5_

  - [ ] 4.3 Buat `src/app/api/member/favorites/migrate/route.ts` (POST)
    - `POST`: Baca header `x-member-id` dan body `{ slugs: string[] }`
    - Upsert semua slugs ke DB, skip duplikat, return `{ migrated, skipped }`
    - Return HTTP 401 jika tidak ada `x-member-id`
    - _Requirements: 9.4, 9.5_

  - [ ]* 4.4 Tulis property test untuk API idempotency (Property 6)
    - Buat file `src/app/api/member/favorites/route.test.ts`
    - **Property 6: Member Favorite API Idempotency**
    - **Validates: Requirements 5.5, 9.6**
    - Test bahwa POST dua kali dengan slug sama menghasilkan tepat satu record dan HTTP 200

  - [ ]* 4.5 Tulis property test untuk CRUD round-trip (Property 7)
    - **Property 7: Member Favorite CRUD Round-Trip**
    - **Validates: Requirements 5.3, 9.1, 9.2, 9.3**
    - Test bahwa POST lalu DELETE lalu GET tidak mengandung slug tersebut

  - [ ]* 4.6 Tulis property test untuk unauthorized rejection (Property 9)
    - **Property 9: Unauthorized API Rejection**
    - **Validates: Requirements 9.5**
    - Test bahwa semua endpoint (GET, POST, DELETE, migrate) return 401 tanpa header `x-member-id`

  - [ ]* 4.7 Tulis property test untuk migration union (Property 8)
    - Buat file `src/app/api/member/favorites/migrate.test.ts`
    - **Property 8: Migration Union Without Duplicates**
    - **Validates: Requirements 6.4, 9.4**
    - Test bahwa hasil migrasi adalah union dari localStorage dan DB tanpa duplikat

- [ ] 5. Checkpoint — Pastikan semua tests pass
  - Pastikan semua tests pass, tanyakan ke user jika ada pertanyaan.

- [ ] 6. Update Admin Settings API
  - [ ] 6.1 Modifikasi `src/app/api/admin/settings/route.ts` untuk handle `catalogLayout`
    - Tambah `catalogLayout` ke `GET` response dari `GlobalSetting`
    - Tambah `catalogLayout` ke `POST` handler — validasi nilai hanya `'grid'` atau `'thumbnail'`
    - Update `upsert` query untuk menyertakan `catalogLayout`
    - _Requirements: 8.3, 8.4_

  - [ ] 6.2 Modifikasi `src/app/api/public/settings/route.ts` untuk return `catalogLayout`
    - Tambah `catalogLayout` ke response global settings (tanpa slug/memberId)
    - Default ke `'grid'` jika field tidak ada di DB
    - _Requirements: 8.5, 2.7_

  - [ ]* 6.3 Tulis property test untuk settings API round-trip (Property 12)
    - Buat file `src/app/api/admin/settings/route.test.ts`
    - **Property 12: Settings API Round-Trip**
    - **Validates: Requirements 8.3, 8.4**
    - Test bahwa POST `catalogLayout` lalu GET mengembalikan nilai yang sama

- [ ] 7. Komponen `PreviewModal`
  - [ ] 7.1 Buat file `src/components/catalog/PreviewModal.tsx`
    - Definisikan interface `PreviewModalProps` dengan `isOpen`, `onClose`, `theme`
    - Implementasikan backdrop blur overlay yang menutup modal saat diklik
    - Implementasikan phone mockup frame sebagai container iframe
    - Implementasikan loading indicator saat iframe sedang dimuat
    - Implementasikan timeout 15 detik — tampilkan error + link "Buka di tab baru" jika iframe gagal load
    - Implementasikan tombol close (X) di pojok kanan atas
    - iframe `src` harus menggunakan `theme.previewUrl`
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

  - [ ]* 7.2 Tulis property test untuk preview modal URL correctness (Property 2)
    - Buat file `src/components/catalog/PreviewModal.test.tsx`
    - **Property 2: Preview Modal URL Correctness**
    - **Validates: Requirements 3.4**
    - Test bahwa iframe `src` selalu sama dengan `theme.previewUrl` untuk setiap tema

- [ ] 8. Komponen `ThemeCard`
  - [ ] 8.1 Buat file `src/components/catalog/ThemeCard.tsx`
    - Definisikan interface `ThemeCardProps` dengan `theme`, `isFavorited`, `onPreview`, `onToggleFavorite`, `isLight`
    - Tampilkan gambar tema, nama tema, tombol Preview, dan tombol Favorit (♡/♥)
    - Tombol Favorit menampilkan ikon filled saat `isFavorited` true, outline saat false
    - Gunakan styling neumorphism/dark sesuai prop `isLight`
    - _Requirements: 3.1, 4.1, 4.3_

  - [ ]* 8.2 Tulis property test untuk favorite button presence (Property 3)
    - Buat file `src/components/catalog/ThemeCard.test.tsx`
    - **Property 3: Favorite Button Presence**
    - **Validates: Requirements 3.1, 4.1**
    - Test bahwa setiap ThemeCard yang dirender mengandung tombol preview dan tombol favorit

- [ ] 9. Komponen `ThumbnailCatalog`
  - [ ] 9.1 Buat file `src/components/catalog/ThumbnailCatalog.tsx`
    - Definisikan interface `ThumbnailCatalogProps` dengan `themes`, `favorites`, `onPreview`, `onToggleFavorite`, `isLight`
    - Implementasikan layout: foto besar tema aktif di kiri, info tema di kanan
    - Implementasikan thumbnail slider horizontal menggunakan `embla-carousel-react`
    - Klik thumbnail mengubah tema aktif yang ditampilkan besar
    - Tampilkan nama tema, tombol Preview, dan tombol Favorit di sisi kanan
    - _Requirements: 2.3, 2.4, 2.5_

- [ ] 10. Komponen `FavoritesPanel`
  - [ ] 10.1 Buat file `src/components/catalog/FavoritesPanel.tsx`
    - Definisikan interface `FavoritesPanelProps` dengan `isOpen`, `onClose`, `favorites`, `onRemoveFavorite`, `onPreview`
    - Ambil data tema dari `CATALOG_THEMES` berdasarkan slugs di `favorites`
    - Tampilkan thumbnail gambar, nama tema, tombol Preview, dan tombol hapus (X) per item
    - Tampilkan pesan "Belum ada tema favorit" dengan ilustrasi saat daftar kosong
    - _Requirements: 7.3, 7.4, 7.5, 7.6, 7.7_

  - [ ]* 10.2 Tulis property test untuk favorites panel completeness (Property 10)
    - Buat file `src/components/catalog/FavoritesPanel.test.tsx`
    - **Property 10: Favorites Panel Completeness**
    - **Validates: Requirements 7.3, 7.4, 7.6**
    - Test bahwa FavoritesPanel merender tepat satu item per slug dengan semua elemen yang diperlukan

- [ ] 11. Komponen `CatalogSection` (Refactor)
  - [ ] 11.1 Refactor `src/components/landing/CatalogSection.tsx` untuk menggunakan static data dan layout baru
    - Ganti fetch ke `/api/themes` dan `/api/categories` dengan import `CATALOG_THEMES` dari `src/lib/catalogThemes.ts`
    - Tambah state `catalogLayout` yang diambil dari `/api/public/settings`
    - Tambah state `selectedCategory` untuk filter kategori dari data static
    - Integrasikan hook `useFavorites` untuk mengelola state favorit
    - Render `GridLayout` (existing grid) atau `ThumbnailCatalog` berdasarkan `catalogLayout`
    - Integrasikan `PreviewModal` — kelola state `previewTheme` dan `isPreviewOpen`
    - Teruskan `favorites` dan `onToggleFavorite` ke child components
    - Fallback ke layout `grid` jika `catalogLayout` tidak ada di settings
    - _Requirements: 1.5, 2.1, 2.2, 2.6, 2.7, 8.5, 8.6_

- [ ] 12. Update Sidebar dengan Menu Favorit
  - [ ] 12.1 Modifikasi `src/components/landing/Sidebar.tsx` untuk menambah menu Favorit
    - Tambah menu item "Favorit" dengan ikon hati (Heart dari lucide-react)
    - Tambah badge yang menampilkan jumlah total tema favorit
    - Integrasikan `FavoritesPanel` sebagai panel/drawer di dalam sidebar
    - Kelola state `isFavoritePanelOpen` untuk toggle panel
    - Teruskan `favorites`, `onRemoveFavorite`, dan `onPreview` ke `FavoritesPanel`
    - Integrasikan `PreviewModal` di level Sidebar untuk preview dari panel favorit
    - _Requirements: 7.1, 7.2, 7.8_

  - [ ]* 12.2 Tulis property test untuk favorites badge count (Property 11)
    - Buat file `src/components/catalog/FavoritesPanel.test.tsx` (tambahkan ke file yang sudah ada)
    - **Property 11: Favorites Badge Count**
    - **Validates: Requirements 7.8**
    - Test bahwa badge menampilkan angka yang tepat sesuai jumlah favorit

- [ ] 13. Update Admin Dashboard Settings
  - [ ] 13.1 Modifikasi `src/app/admin/dashboard/page.tsx` untuk menambah opsi catalog layout
    - Tambah state `catalogLayout` dengan nilai `'grid'` atau `'thumbnail'`
    - Tambah UI pilihan layout di tab "Settings": "Tema Katalog 1 (Grid/Default)" dan "Tema Katalog 2 (Thumbnail)"
    - Sertakan `catalogLayout` saat menyimpan settings ke `/api/admin/settings`
    - Load nilai `catalogLayout` saat fetch settings awal
    - _Requirements: 8.1, 8.2, 8.3_

- [ ] 14. Checkpoint Final — Pastikan semua tests pass
  - Pastikan semua tests pass, tanyakan ke user jika ada pertanyaan.

## Notes

- Tasks bertanda `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap task mereferensikan requirements spesifik untuk traceability
- Checkpoint memastikan validasi inkremental di setiap tahap
- Property tests memvalidasi invariant universal menggunakan `fast-check` (sudah ada di devDependencies)
- Unit tests memvalidasi behavior spesifik dan edge cases menggunakan Vitest
- Optimistic update dengan rollback diimplementasikan di `useFavorites` hook
- `memberId` dibaca dari localStorage key `memberId` (sudah ada di sistem) dan dikirim sebagai header `x-member-id`
