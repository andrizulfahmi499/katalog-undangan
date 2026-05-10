# Requirements Document

## Introduction

Fitur ini menambahkan tampilan katalog tema undangan yang lebih kaya di landing page, dengan dua pilihan layout yang dapat dikonfigurasi admin, sistem favorit untuk pengunjung (guest) dan member login, serta panel favorit di sidebar. Data tema bersumber dari 80+ tema `id.akainvitation.com` yang disimpan sebagai static JSON di kode, sehingga tidak bergantung pada API eksternal yang bisa gagal.

## Glossary

- **Catalog_Section**: Komponen section di landing page yang menampilkan daftar tema undangan.
- **Theme_Card**: Kartu individual yang merepresentasikan satu tema undangan dalam katalog.
- **Catalog_Layout**: Pilihan tampilan katalog — `grid` (default) atau `thumbnail` (product-detail style).
- **Preview_Modal**: Modal popup berbentuk phone mockup yang menampilkan iframe preview tema.
- **Favorite_System**: Sistem yang memungkinkan pengunjung dan member menyimpan tema favorit.
- **Favorites_Panel**: Panel/drawer di sidebar landing page yang menampilkan daftar tema favorit.
- **Guest**: Pengunjung landing page yang belum login sebagai member.
- **Member**: Pengguna yang sudah login dengan akun member.
- **Static_Theme_Data**: Data 80+ tema undangan yang disimpan sebagai static JSON di `src/lib/invitationTemplates.ts`.
- **GlobalSetting**: Model database yang menyimpan konfigurasi global landing page, termasuk pilihan layout katalog.
- **FavoriteTheme**: Model database yang menyimpan data tema favorit per member.
- **Thumbnail_Layout**: Layout katalog Tema 2 — foto besar di kiri, thumbnail slider di bawah, info tema di kanan.
- **Grid_Layout**: Layout katalog Tema 1 (default) — tampilan grid seperti yang sudah ada.
- **Admin_Dashboard**: Halaman admin di `/admin/dashboard` untuk mengelola pengaturan landing page.

---

## Requirements

### Requirement 1: Static Theme Data

**User Story:** Sebagai developer, saya ingin data tema undangan disimpan sebagai static JSON di kode, sehingga katalog tetap berfungsi tanpa bergantung pada API eksternal.

#### Acceptance Criteria

1. THE `Static_Theme_Data` SHALL menyimpan minimal 80 tema undangan dari `id.akainvitation.com` dalam file `src/lib/invitationTemplates.ts`.
2. THE `Static_Theme_Data` SHALL menyertakan field `slug`, `name`, `category`, dan `tags` untuk setiap tema.
3. THE `Static_Theme_Data` SHALL mengikuti pola URL gambar `https://id.akainvitation.com/themes/{slug}/{slug}.webp` untuk field `imageUrl` setiap tema.
4. THE `Static_Theme_Data` SHALL mengikuti pola URL preview `https://id.akainvitation.com/preview/{slug}` untuk field `previewUrl` setiap tema.
5. THE `Catalog_Section` SHALL menggunakan `Static_Theme_Data` sebagai sumber data utama, menggantikan fetch ke API eksternal.

---

### Requirement 2: Dua Pilihan Layout Katalog

**User Story:** Sebagai admin, saya ingin memilih tampilan layout katalog di landing page, sehingga saya dapat menyesuaikan tampilan sesuai kebutuhan.

#### Acceptance Criteria

1. THE `Catalog_Section` SHALL mendukung dua pilihan `Catalog_Layout`: `grid` dan `thumbnail`.
2. WHEN `Catalog_Layout` bernilai `grid`, THE `Catalog_Section` SHALL menampilkan tema dalam format grid multi-kolom seperti tampilan yang sudah ada.
3. WHEN `Catalog_Layout` bernilai `thumbnail`, THE `Catalog_Section` SHALL menampilkan satu tema aktif dengan foto besar di sisi kiri.
4. WHILE `Catalog_Layout` bernilai `thumbnail`, THE `Catalog_Section` SHALL menampilkan thumbnail slider horizontal yang dapat digeser di bawah foto besar.
5. WHILE `Catalog_Layout` bernilai `thumbnail`, THE `Catalog_Section` SHALL menampilkan nama tema, tombol Preview, dan tombol Favorit di sisi kanan.
6. THE `GlobalSetting` SHALL menyimpan nilai `catalogLayout` dengan nilai default `grid`.
7. WHEN `catalogLayout` tidak ditemukan di `GlobalSetting`, THE `Catalog_Section` SHALL menggunakan layout `grid` sebagai fallback.

---

### Requirement 3: Tombol Preview dengan Phone Mockup Modal

**User Story:** Sebagai pengunjung, saya ingin melihat preview tema dalam popup berbentuk layar HP, sehingga saya dapat melihat tampilan tema tanpa meninggalkan halaman.

#### Acceptance Criteria

1. THE `Catalog_Section` SHALL menampilkan tombol "Preview" pada setiap `Theme_Card` di kedua layout.
2. WHEN tombol Preview diklik, THE `Preview_Modal` SHALL muncul sebagai overlay di atas halaman tanpa membuka tab baru.
3. THE `Preview_Modal` SHALL menampilkan frame berbentuk phone mockup (layar HP) sebagai container iframe.
4. THE `Preview_Modal` SHALL memuat iframe dari URL `https://id.akainvitation.com/preview/{slug}` sesuai tema yang dipilih.
5. WHEN `Preview_Modal` sedang memuat iframe, THE `Preview_Modal` SHALL menampilkan loading indicator di dalam phone mockup.
6. WHEN area di luar `Preview_Modal` diklik, THE `Preview_Modal` SHALL menutup diri.
7. THE `Preview_Modal` SHALL menampilkan tombol close (X) yang dapat diklik untuk menutup modal.
8. IF iframe gagal dimuat dalam 15 detik, THEN THE `Preview_Modal` SHALL menampilkan pesan error dengan opsi untuk membuka preview di tab baru.

---

### Requirement 4: Sistem Favorit untuk Guest

**User Story:** Sebagai pengunjung yang belum login, saya ingin menyimpan tema favorit saya, sehingga saya dapat mengingat tema yang saya sukai.

#### Acceptance Criteria

1. THE `Catalog_Section` SHALL menampilkan tombol Favorit (ikon ♡) pada setiap `Theme_Card` di kedua layout.
2. WHEN tombol Favorit diklik oleh `Guest`, THE `Favorite_System` SHALL menyimpan `slug` tema ke `localStorage` dengan key `guest_favorite_themes`.
3. WHEN tema sudah ada di favorit `Guest`, THE `Favorite_System` SHALL menampilkan ikon ♡ dalam keadaan terisi (filled) pada `Theme_Card` yang bersangkutan.
4. WHEN tombol Favorit pada tema yang sudah difavoritkan diklik oleh `Guest`, THE `Favorite_System` SHALL menghapus tema tersebut dari `localStorage`.
5. THE `Favorite_System` SHALL memuat data favorit dari `localStorage` saat halaman pertama kali dimuat oleh `Guest`.
6. IF `localStorage` tidak tersedia (misalnya mode private browser tertentu), THEN THE `Favorite_System` SHALL menyimpan favorit di memory state sementara selama sesi berlangsung.

---

### Requirement 5: Sistem Favorit untuk Member Login

**User Story:** Sebagai member yang sudah login, saya ingin menyimpan tema favorit saya di database, sehingga favorit saya tersimpan permanen dan dapat diakses dari perangkat manapun.

#### Acceptance Criteria

1. WHEN `Member` yang sudah login mengklik tombol Favorit, THE `Favorite_System` SHALL menyimpan data favorit ke tabel `FavoriteTheme` di database melalui API route.
2. THE `FavoriteTheme` SHALL menyimpan field `memberId`, `themeSlug`, `themeName`, dan `createdAt`.
3. WHEN `Member` yang sudah login mengklik tombol Favorit pada tema yang sudah difavoritkan, THE `Favorite_System` SHALL menghapus entri dari tabel `FavoriteTheme`.
4. WHEN halaman dimuat oleh `Member` yang sudah login, THE `Favorite_System` SHALL mengambil daftar favorit dari API dan menampilkan ikon ♡ terisi pada tema yang sudah difavoritkan.
5. THE `FavoriteTheme` SHALL memiliki constraint unique pada kombinasi `memberId` dan `themeSlug` untuk mencegah duplikasi.
6. IF request API favorit gagal, THEN THE `Favorite_System` SHALL menampilkan notifikasi error dan mempertahankan state UI sebelumnya.

---

### Requirement 6: Migrasi Favorit Guest ke Member

**User Story:** Sebagai pengunjung yang telah menyimpan favorit lalu login, saya ingin favorit saya otomatis tersimpan ke akun saya, sehingga saya tidak kehilangan data favorit yang sudah saya simpan.

#### Acceptance Criteria

1. WHEN `Guest` berhasil login sebagai `Member`, THE `Favorite_System` SHALL memeriksa apakah ada data favorit di `localStorage`.
2. WHEN data favorit ditemukan di `localStorage` setelah login, THE `Favorite_System` SHALL mengirim request migrasi ke API untuk menyimpan semua favorit tersebut ke database.
3. WHEN migrasi berhasil, THE `Favorite_System` SHALL menghapus data favorit dari `localStorage`.
4. WHEN migrasi berhasil, THE `Favorite_System` SHALL menggabungkan favorit dari `localStorage` dengan favorit yang sudah ada di database (tanpa duplikasi).
5. IF migrasi gagal, THEN THE `Favorite_System` SHALL mempertahankan data di `localStorage` dan mencoba migrasi ulang pada sesi berikutnya.

---

### Requirement 7: Panel Favorit di Sidebar

**User Story:** Sebagai pengunjung atau member, saya ingin melihat daftar tema favorit saya di sidebar, sehingga saya dapat dengan mudah mengakses kembali tema yang saya sukai.

#### Acceptance Criteria

1. THE `Sidebar` SHALL menampilkan menu item "Favorit" dengan ikon hati (♥) yang dapat diklik.
2. WHEN menu "Favorit" di `Sidebar` diklik, THE `Favorites_Panel` SHALL muncul sebagai panel/drawer di dalam sidebar.
3. THE `Favorites_Panel` SHALL menampilkan daftar tema yang telah difavoritkan oleh pengunjung atau member.
4. THE `Favorites_Panel` SHALL menampilkan thumbnail gambar, nama tema, dan tombol Preview untuk setiap tema favorit.
5. WHEN tombol Preview di `Favorites_Panel` diklik, THE `Preview_Modal` SHALL terbuka dengan tema yang dipilih.
6. THE `Favorites_Panel` SHALL menampilkan tombol hapus (X) pada setiap item untuk menghapus tema dari daftar favorit.
7. WHEN daftar favorit kosong, THE `Favorites_Panel` SHALL menampilkan pesan "Belum ada tema favorit" dengan ilustrasi yang sesuai.
8. THE `Favorites_Panel` SHALL menampilkan jumlah total tema favorit sebagai badge pada menu item "Favorit" di sidebar.

---

### Requirement 8: Admin Settings untuk Layout Katalog

**User Story:** Sebagai admin, saya ingin mengatur pilihan layout katalog di admin dashboard, sehingga saya dapat mengubah tampilan katalog tanpa perlu mengubah kode.

#### Acceptance Criteria

1. THE `Admin_Dashboard` SHALL menampilkan opsi pilihan layout katalog di tab "Settings".
2. THE `Admin_Dashboard` SHALL menyediakan dua pilihan: "Tema Katalog 1 (Grid/Default)" dan "Tema Katalog 2 (Thumbnail)".
3. WHEN admin memilih layout dan menyimpan, THE `Admin_Dashboard` SHALL mengirim nilai `catalogLayout` ke API `/api/admin/settings`.
4. THE `/api/admin/settings` SHALL menyimpan nilai `catalogLayout` ke field `catalogLayout` di model `GlobalSetting`.
5. THE `Catalog_Section` SHALL membaca nilai `catalogLayout` dari API `/api/public/settings` saat halaman dimuat.
6. WHEN nilai `catalogLayout` berubah di database, THE `Catalog_Section` SHALL menampilkan layout yang sesuai pada kunjungan berikutnya.

---

### Requirement 9: API Routes untuk Sistem Favorit

**User Story:** Sebagai sistem, saya ingin API routes yang mengelola data favorit member, sehingga data favorit dapat disimpan dan diambil dengan aman.

#### Acceptance Criteria

1. THE System SHALL menyediakan endpoint `GET /api/member/favorites` yang mengembalikan daftar tema favorit member yang sedang login.
2. THE System SHALL menyediakan endpoint `POST /api/member/favorites` yang menerima `themeSlug` dan `themeName` untuk menambah favorit.
3. THE System SHALL menyediakan endpoint `DELETE /api/member/favorites/{themeSlug}` yang menghapus satu tema dari favorit member.
4. THE System SHALL menyediakan endpoint `POST /api/member/favorites/migrate` yang menerima array `slugs` untuk migrasi favorit dari localStorage ke database.
5. WHEN request ke endpoint favorit diterima tanpa autentikasi member yang valid, THE System SHALL mengembalikan HTTP 401.
6. WHEN `themeSlug` yang dikirim ke `POST /api/member/favorites` sudah ada di favorit member, THE System SHALL mengembalikan HTTP 200 tanpa membuat duplikasi.
7. THE System SHALL mengidentifikasi member yang sedang login melalui `memberId` yang disimpan di `localStorage` pada sisi client, dikirim sebagai header atau body request.

---

### Requirement 10: Skema Database FavoriteTheme

**User Story:** Sebagai sistem, saya ingin tabel database untuk menyimpan data favorit member, sehingga data favorit tersimpan secara persisten.

#### Acceptance Criteria

1. THE `prisma/schema.prisma` SHALL mendefinisikan model `FavoriteTheme` dengan field: `id` (cuid), `memberId` (String), `themeSlug` (String), `themeName` (String), `createdAt` (DateTime).
2. THE `FavoriteTheme` SHALL memiliki relasi ke model `Member` melalui field `memberId`.
3. THE `FavoriteTheme` SHALL memiliki constraint `@@unique([memberId, themeSlug])` untuk mencegah duplikasi favorit.
4. THE `GlobalSetting` SHALL ditambahkan field `catalogLayout` bertipe `String` dengan nilai default `"grid"`.
5. THE System SHALL menyediakan migration Prisma untuk perubahan skema ini.
