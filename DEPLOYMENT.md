# 📚 DEPLOYMENT GUIDE - Katalog Undangan

Panduan lengkap untuk deploy **Katalog Undangan** ke Vercel dengan Supabase database.

---

## 📋 DAFTAR ISI

1. [Prerequisites](#prerequisites)
2. [Setup Supabase Database](#1-setup-supabase-database)
3. [Setup GitHub Repository](#2-setup-github-repository)
4. [Deploy ke Vercel](#3-deploy-ke-vercel)
5. [Post-Deployment](#4-post-deployment)
6. [Troubleshooting](#5-troubleshooting)

---

## 📋 PREREQUISITES

Sebelum memulai, pastikan Anda sudah punya:

| Tool/Service | Link | Purpose |
|-------------|------|---------|
| GitHub Account | https://github.com | Version control & deployment source |
| Vercel Account | https://vercel.com | Hosting platform |
| Supabase Account | https://supabase.com | Database hosting |
| Git | https://git-scm.com | Version control tool |

---

## 1. SETUP SUPABASE DATABASE

### 1.1 Buat Supabase Project

1. Login ke [Supabase](https://supabase.com)
2. Klik **New Project**
3. Isi form:

| Field | Value | Notes |
|-------|-------|-------|
| **Name** | `katalog-undangan` | Nama project |
| **Database Password** | `[Buat password kuat]` | **Wajib disimpan!** |
| **Region** | `Southeast Asia (Singapore)` | Pilih terdekat |
| **Pricing Plan** | `Free` | Cukup untuk awal |

4. Klik **Create new project**
5. Tunggu 1-2 menit sampai project siap (status: "Active")

### 1.2 Jalankan SQL Script

**Penting:** Jangan skip langkah ini!

1. Di Supabase dashboard, klik **SQL Editor** di sidebar
2. Klik **New Query**
3. Buka file project Anda: `supabase/init.sql`
4. Copy **SELURUH isi file** (Ctrl+A → Ctrl+C)
5. Paste ke SQL Editor Supabase (Ctrl+V)
6. Klik tombol **Run** (▶️) di pojok kanan bawah
7. Tunggu beberapa detik
8. Pastikan muncul pesan **"Success"** di bawah

**Apa yang dilakukan script ini?**
- ✅ Membuat 6 tabel: Admin, Member, Invitations, InvitationMessages, InvitationSends, CreditTransaction
- ✅ Membuat indexes untuk performa database
- ✅ Membuat triggers untuk auto-update `updatedAt`
- ✅ Membuat default admin account
- ✅ Setup Row Level Security (RLS)

### 1.3 Copy Database Connection String

1. Di Supabase dashboard, klik **Settings** → **Database** (sidebar)
2. Scroll ke section **Connection string**
3. Pilih **URI**
4. Klik icon **Copy** 📋 di sebelah connection string

Format string akan seperti ini:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**Catatan:**
- `[YOUR-PASSWORD]` = Password yang Anda buat di step 1.1
- `[PROJECT-REF]` = Project reference ID (random string)

**SIMPAN STRING INI!** Akan digunakan di Vercel.

### 1.4 Verifikasi Database

Opsional tapi recommended untuk verifikasi:

Di SQL Editor Supabase, jalankan query:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Harusnya muncul 6 tabel:
- Admin
- Member
- Invitations
- InvitationMessages
- InvitationSends
- CreditTransaction

✅ Database siap!

---

## 2. SETUP GITHUB REPOSITORY

### 2.1 Buat Repository Baru

1. Buka [GitHub](https://github.com/andrizulfahmi499?tab=repositories)
2. Klik tombol **New** di kanan atas
3. Isi form:

| Field | Value |
|-------|-------|
| **Repository name** | `katalog-undangan` |
| **Description** | `Platform undangan digital dengan fitur member dan admin dashboard` |
| **Public/Private** | Pilih sesuai kebutuhan (Public gratis, Private paid) |
| **Initialize this repository** | ❌ **JANGAN centang** apapun |

4. Klik **Create repository**

### 2.2 Push Project ke GitHub

Buka terminal di project folder Anda, lalu jalankan command berikut satu per satu:

```bash
# Step 1: Inisialisasi git (jika belum)
git init

# Step 2: Cek status
git status

# Step 3: Tambah semua file
git add .

# Step 4: Commit dengan pesan
git commit -m "Initial commit: Katalog Undangan with member and admin dashboard"

# Step 5: Hubungkan ke GitHub repository
git remote add origin https://github.com/andrizulfahmi499/katalog-undangan.git

# Step 6: Set branch utama ke main
git branch -M main

# Step 7: Push ke GitHub
git push -u origin main
```

**Jika diminta login GitHub:**
- Username: Masukkan GitHub username Anda
- Password: Gunakan **Personal Access Token** (bukan password biasa)
  - Cara buat: GitHub Settings → Developer settings → Personal access tokens → Generate new token

### 2.3 Verifikasi Repository

1. Buka: https://github.com/andrizulfahmi499/katalog-undangan
2. Pastikan semua file project ter-upload:
   - `src/`
   - `prisma/`
   - `supabase/`
   - `package.json`
   - Dll.
3. ✅ Repository siap untuk deployment!

---

## 3. DEPLOY KE VERCEL

### 3.1 Import Project ke Vercel

1. Login ke [Vercel](https://vercel.com)
2. Klik **Add New** → **Project**
3. Klik **Import Git Repository**
4. Jika belum connect GitHub:
   - Klik **Connect to GitHub**
   - Authorize Vercel
   - Pilih repository `katalog-undangan`
5. Klik **Import**

### 3.2 Konfigurasi Project

Vercel akan auto-detect konfigurasi Next.js. Pastikan:

| Field | Value |
|-------|-------|
| **Framework Preset** | `Next.js` |
| **Root Directory** | `./` |
| **Build Command** | `bun run build` |
| **Output Directory** | `.next` |
| **Install Command** | `bun install` |

**Tidak perlu mengubah apa pun jika sudah sesuai!**

### 3.3 Setup Environment Variables (SANGAT PENTING!)

Klik **Environment Variables** dan tambahkan variabel berikut:

#### Variable 1: DATABASE_URL

| Setting | Value |
|---------|-------|
| **Name** | `DATABASE_URL` |
| **Value** | `[Paste dari Supabase — lihat catatan di bawah]` |
| **Environments** | ✅ Production, ✅ Preview, ✅ Development |

- Jika memakai **connection pooling** (Supabase **Transaction mode**, biasanya port **6543**), URL harus menyertakan **`?pgbouncer=true`** (atau `&pgbouncer=true` jika sudah ada query). Tanpa ini Prisma bisa error `42P05` (*prepared statement already exists*).
- Jika memakai koneksi **direct** saja (port **5432**), tidak wajib `pgbouncer=true`, tetapi tetap set **Variable 2** `DIRECT_URL`.

Contoh (pooler):
```
postgresql://postgres.xxx:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true
```

Contoh (direct saja):
```
postgresql://postgres:PASSWORD@db.abc123xyz.supabase.co:5432/postgres
```

#### Variable 2: DIRECT_URL

| Setting | Value |
|---------|-------|
| **Name** | `DIRECT_URL` |
| **Value** | Koneksi **Direct** dari Supabase (Settings → Database → *Connection string* → URI, host `db.<ref>.supabase.co`, port **5432**) |
| **Environments** | ✅ Production, ✅ Preview, ✅ Development |

Digunakan Prisma untuk `migrate` / `db push`. Jika `DATABASE_URL` sudah direct (5432), isi `DIRECT_URL` **sama** dengan `DATABASE_URL`.

#### Variable 3: NEXTAUTH_SECRET

| Setting | Value |
|---------|-------|
| **Name** | `NEXTAUTH_SECRET` |
| **Value** | `[Generate random string]` |
| **Environments** | ✅ Production, ✅ Preview, ✅ Development |

**Cara generate:**
1. Buka terminal
2. Jalankan: `openssl rand -base64 32`
3. Copy hasilnya
4. Paste ke value

Contoh hasil:
```
aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890
```

#### Variable 4: NEXTAUTH_URL

| Setting | Value |
|---------|-------|
| **Name** | `NEXTAUTH_URL` |
| **Value** | `https://katalog-undangan.vercel.app` (atau biarkan kosong untuk auto-fill) |
| **Environments** | ✅ Production, ✅ Preview, ✅ Development |

**Catatan:** Vercel biasanya auto-fill ini dengan URL deployment Anda. Biarkan kosong jika Vercel sudah mengisinya.

### 3.4 Deploy

1. Scroll ke bawah
2. Klik tombol **Deploy** (warna hitam)
3. Tunggu proses build (1-3 menit)
4. Lihat progress:
   - ⬜ Installing dependencies
   - ⬜ Building application
   - ⬜ Uploading files

Jika sukses, akan muncul:
✅ **Deployed!**

URL production akan seperti:
```
https://katalog-undangan.vercel.app
```

### 3.5 Update NEXTAUTH_URL (Post-Deploy)

Setelah deploy pertama selesai:

1. Di Vercel dashboard, klik project `katalog-undangan`
2. Klik **Settings** → **Environment Variables**
3. Cari `NEXTAUTH_URL`
4. Edit value: `https://katalog-undangan.vercel.app`
5. Klik **Save**
6. Vercel akan otomatis re-deploy

### 3.6 Verifikasi Deployment

Buka URL production: `https://katalog-undangan.vercel.app`

Cek:
- ✅ Landing page muncul
- ✅ Navigasi berfungsi
- ✅ Tidak ada error di console (F12)

---

## 4. POST-DEPLOYMENT

### 4.1 Test Login Admin

1. Buka: `https://katalog-undangan.vercel.app/login`
2. Pilih **Admin**
3. Login dengan:
   - **Email**: `admin@undanganku.com`
   - **Password**: `admin123`
4. Harusnya redirect ke: `/admin/dashboard`
5. ✅ Dashboard admin muncul

### 4.2 Test Create Member

Di admin dashboard:

1. Klik tab **Members**
2. Klik **Tambah Member**
3. Isi:
   - **Nama**: `Test Member`
   - **Email**: `test@example.com`
   - **WhatsApp**: `081234567890`
   - **Password**: `test123`
   - **Credit Points**: `100`
4. Klik **Simpan**
5. ✅ Member berhasil dibuat!

### 4.3 Test Login Member

1. Logout admin (klik **Logout**)
2. Pilih **Member**
3. Login dengan akun yang baru dibuat:
   - **Email**: `test@example.com`
   - **Password**: `test123`
4. Harusnya redirect ke: `/member/dashboard`
5. ✅ Dashboard member muncul!

### 4.4 Test Create Invitation

Di admin dashboard:

1. Klik tab **Invitations**
2. Klik **Tambah Undangan**
3. Isi form:
   - **Judul**: `Pernikahan Test`
   - **Nama Event**: `Resepsi Pernikahan`
   - **Tanggal Event**: Pilih tanggal
   - **Lokasi**: `Jakarta`
   - **Link Undangan**: `https://satumomen.com/app/kirim/801777`
   - **Cost Points**: `20`
   - **Assign ke Member**: Pilih member yang baru dibuat
4. Klik **Simpan**
5. ✅ Undangan berhasil dibuat dan credit member berkurang 20 coin!

### 4.5 Test Send Invitation

Di member dashboard:

1. Buka undangan yang baru dibuat
2. Klik **Kirim Undangan**
3. Klik **Tambah Tamu**
4. Isi:
   - **Nama Tamu**: `Budi Santoso`
   - **WhatsApp**: `089876543210`
5. Tunggu link ter-generate
6. Klik **Salin** untuk copy link
7. Klik **Kirim ke WhatsApp**
8. ✅ WhatsApp terbuka dengan pesan yang sudah terisi!

---

## 5. TROUBLESHOOTING

### Error: "Database connection failed"

**Solusi:**
1. Cek `DATABASE_URL` di Vercel
2. Pastikan password database benar
3. Cek Supabase project status (harus "Active")
4. Coba re-deploy di Vercel

### Error: "NEXTAUTH_SECRET is missing"

**Solusi:**
1. Generate secret baru: `openssl rand -base64 32`
2. Add environment variable `NEXTAUTH_SECRET` di Vercel
3. Re-deploy

### Error: "Prisma Client is not generated"

**Solusi:**
1. Cek `package.json` ada script `postinstall`
2. Pastikan `prisma` ada di dependencies
3. Re-deploy di Vercel

### Error: "Page 404 Not Found"

**Solusi:**
1. Cek routing di Next.js
2. Pastikan file ada di `src/app/`
3. Cek `next.config.js` untuk konfigurasi

### Error: "Tables not found"

**Solusi:**
1. Pastikan SQL script sudah dijalankan di Supabase
2. Cek di SQL Editor: `SELECT * FROM "Admin";`
3. Jika error, re-run script di `supabase/init.sql`

### Build Failed di Vercel

**Solusi:**
1. Cek deployment logs di Vercel
2. Pastikan semua dependencies di `package.json`
3. Cek TypeScript errors
4. Run `bun run lint` di local untuk cek error

---

## 📝 CHECKLIST DEPLOYMENT

Gunakan checklist ini untuk memastikan semua sudah siap:

### Pre-Deployment
- [ ] GitHub repository sudah dibuat
- [ ] Semua file sudah committed dan pushed
- [ ] Supabase project sudah dibuat
- [ ] SQL script sudah dijalankan di Supabase
- [ ] Database connection string sudah dicopy

### Deployment
- [ ] Project sudah di-import ke Vercel
- [ ] Environment variables sudah di-set:
  - [ ] `DATABASE_URL`
  - [ ] `NEXTAUTH_SECRET`
  - [ ] `NEXTAUTH_URL`
- [ ] Build berhasil tanpa error
- [ ] URL production sudah dapat

### Post-Deployment
- [ ] Website dapat diakses
- [ ] Login admin berhasil
- [ ] Login member berhasil
- [ ] Create member berhasil
- [ ] Create invitation berhasil
- [ ] Send invitation berhasil
- [ ] Database connection berfungsi

---

## 🎉 SELESAI!

Website **Katalog Undangan** Anda sudah live di:
**https://katalog-undangan.vercel.app**

---

## 📞 BANTUAN LEBIH LANJUT

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs

---

**Selamat! Website Anda sudah online! 🎊**
