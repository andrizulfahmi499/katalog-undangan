# 🚀 QUICK START - Katalog Undangan Deployment

Panduan cepat untuk deploy **Katalog Undangan** ke Vercel dengan Supabase database.

**Estimasi Waktu: 15-20 menit**

---

## 📋 Prerequisites

Sebelum memulai, pastikan Anda sudah punya:
- ✅ Akun GitHub: https://github.com/andrizulfahmi499
- ✅ Akun Vercel: https://vercel.com (gratis)
- ✅ Akun Supabase: https://supabase.com (gratis)
- ✅ Git terinstall di komputer

---

## 🎯 3 LANGKAH UTAMA

### **STEP 1: Setup Database di Supabase (5-10 menit)**

1. **Buat Project Supabase**
   - Buka https://supabase.com
   - Klik **New Project**
   - Isi:
     - **Name**: `katalog-undangan`
     - **Database Password**: Buat password yang kuat dan **SIMPAN!**
     - **Region**: Pilih terdekat (Singapore/Jakarta)
   - Klik **Create new project**
   - Tunggu 1-2 menit sampai project siap

2. **Jalankan SQL Script**
   - Di Supabase dashboard, klik **SQL Editor** (ikon database di sidebar)
   - Buka file: `supabase/init.sql`
   - **Copy SELURUH isi file** dan paste ke SQL Editor
   - Klik **Run** di pojok kanan bawah
   - Tunggu sampai muncul pesan "Success"
   - ✅ Database siap!

3. **Copy Database Connection String**
   - Klik **Settings** → **Database** (sidebar)
   - Scroll ke **Connection string**
   - Pilih **URI**
   - Klik **Copy** icon
   - **Simpan string ini!** Formatnya:
     ```
     postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
     ```

---

### **STEP 2: Push ke GitHub (3-5 menit)**

1. **Buat Repository GitHub**
   - Buka https://github.com/andrizulfahmi499
   - Klik **New** (atau + → New repository)
   - Isi:
     - **Repository name**: `katalog-undangan`
     - **Description**: `Platform undangan digital dengan fitur member dan admin dashboard`
     - **Public/Private**: Pilih sesuai kebutuhan
     - **Initialize with README**: ❌ Tidak perlu dicentang
   - Klik **Create repository**

2. **Push Project ke GitHub**
   Buka terminal di project folder Anda, lalu jalankan:

   ```bash
   # 1. Inisialisasi git (jika belum)
   git init

   # 2. Tambah semua file
   git add .

   # 3. Commit
   git commit -m "Initial commit: Katalog Undangan with member and admin dashboard"

   # 4. Hubungkan ke GitHub
   git remote add origin https://github.com/andrizulfahmi499/katalog-undangan.git

   # 5. Push ke GitHub
   git branch -M main
   git push -u origin main
   ```

   - Jika diminta login GitHub, masukkan username dan password/token

3. **Verifikasi**
   - Buka: https://github.com/andrizulfahmi499/katalog-undangan
   - Pastikan semua file sudah ter-upload
   - ✅ Repository siap!

---

### **STEP 3: Deploy ke Vercel (5-8 menit)**

1. **Buat Project Vercel**
   - Buka https://vercel.com
   - Login atau sign up
   - Klik **Add New** → **Project**

2. **Import GitHub Repository**
   - Klik **Import Git Repository**
   - Pilih **GitHub** (hubungkan jika diminta)
   - Cari dan pilih `katalog-undangan`
   - Klik **Import**

3. **Konfigurasi Project**
   **Framework Preset**: Next.js (auto-detect)
   **Root Directory**: `./`
   **Build Command**: `bun run build` (auto-detect)
   **Output Directory**: `.next` (auto-detect)
   **Install Command**: `bun install` (auto-detect)

4. **Setup Environment Variables** (SANGAT PENTING!)
   Klik **Environment Variables** → Tambahkan berikut:

   | Variable Name | Value |
   |--------------|-------|
   | `DATABASE_URL` | `[Paste dari Step 1.3]` |
   | `NEXTAUTH_SECRET` | Generate: `openssl rand -base64 32` |
   | `NEXTAUTH_URL` | Biarkan kosong (Vercel akan auto-fill) |

   **Cara generate NEXTAUTH_SECRET:**
   - Di terminal: `openssl rand -base64 32`
   - Copy hasilnya dan paste ke value `NEXTAUTH_SECRET`

   Klik **Add** untuk setiap variable
   Pilih:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

5. **Deploy!**
   - Klik **Deploy** di bawah
   - Tunggu 1-3 menit
   - Setelah selesai, Anda akan dapat URL: `https://katalog-undangan.vercel.app`

6. **Update NEXTAUTH_URL** (Opsional tapi Recommended)
   - Di Vercel dashboard, klik **Settings** → **Environment Variables**
   - Edit `NEXTAUTH_URL`
   - Set value: `https://katalog-undangan.vercel.app`
   - Save dan re-deploy

---

## ✅ VERIFIKASI

### 1. Cek Website
Buka: `https://katalog-undangan.vercel.app`
- ✅ Landing page muncul
- ✅ Menu navigasi berfungsi

### 2. Cek Login
- Buka: `https://katalog-undangan.vercel.app/login`
- Pilih **Admin**
- Login dengan:
  - **Email**: `admin@undanganku.com`
  - **Password**: `admin123`
- ✅ Dashboard admin muncul

### 3. Cek Database Connection
- Di dashboard admin, coba tambah member baru
- Jika berhasil berarti database connected! ✅

---

## 🎉 SELESAI!

Website Anda sudah live di:
**https://katalog-undangan.vercel.app**

---

## 📝 Catatan Penting

### ⚠️ Password Default Admin
- Default password: `admin123`
- **Segera ganti** setelah login pertama kali!

### 🔑 Database Password
- Password database Supabase TIDAK bisa dilihat lagi setelah setup
- **Pastikan sudah disimpan di tempat aman**

### 🔄 Auto Deploy
Setiap commit ke `main` branch akan otomatis deploy ke Vercel!

---

## 🐛 Ada Masalah?

Cek file `TROUBLESHOOTING.md` untuk solusi error umum.

---

**Selamat! Website Katalog Undangan Anda sudah live! 🎊**
