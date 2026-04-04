# Download Project Katalog Undangan

File project siap untuk di-download:

## 📦 File yang Tersedia:

- **katalog-undangan.tar.gz** - File archive project (3.0 MB)
  - Berisi seluruh source code project Katalog Undangan
  - Sudah di-exclude: node_modules, .next, database files, upload folder
  - Siap untuk di-download dan dipush ke GitHub

---

## 📥 Cara Download:

1. Klik file **katalog-undangan.tar.gz** di panel file browser
2. Download akan dimulai secara otomatis
3. Ekstrak file di komputer Anda menggunakan:
   - Windows: Klik kanan → Extract All
   - Mac: Double-click (ekstrak otomatis)
   - Linux: `tar -xzf katalog-undangan.tar.gz`

---

## 🚀 Langkah Selanjutnya Setelah Download:

### 1. Ekstrak File
- Buka folder tempat Anda menyimpan file
- Ekstrak `katalog-undangan.tar.gz`

### 2. Buka Terminal di Folder Project
- Buka folder hasil ekstrak di File Explorer
- Klik kanan → **Open in Terminal** atau **Open in Git Bash**

### 3. Jalankan Perintah Git untuk Push ke GitHub

```bash
# Inisialisasi git
git init

# Tambah semua file
git add .

# Commit pertama
git commit -m "Initial commit: Katalog Undangan with member and admin dashboard"

# Hubungkan ke GitHub repository
git remote add origin https://github.com/andrizulfahmi499/katalog-undangan.git

# Set branch ke main
git branch -M main

# Push ke GitHub (akan diminta login)
git push -u origin main
```

### 4. Login GitHub Saat Push

Saat menjalankan `git push`:
- **Username**: Masukkan `andrizulfahmi499`
- **Password**: Masukkan **Personal Access Token** (bukan password GitHub biasa!)

**Cara Buat Personal Access Token (PAT):**
1. Buka: https://github.com/settings/tokens
2. Klik **Generate new token** → **Generate new token (classic)**
3. Isi:
   - **Note**: `Katalog Undangan Deployment`
   - **Expiration**: Pilih (misalnya: 30 days atau No expiration)
   - **Scopes**: Centang **repo** (ini yang penting!)
4. Klik **Generate token**
5. **Copy token yang muncul!** (token hanya muncul sekali)
6. Gunakan token ini sebagai "password" saat diminta di git push

### 5. Verifikasi di GitHub
- Buka: https://github.com/andrizulfahmi499/katalog-undangan
- Pastikan semua file sudah ter-upload ✅

### 6. Deploy ke Vercel
Setelah file ada di GitHub, lanjut ke:
1. Buka: https://vercel.com
2. Login
3. Klik **Add New** → **Project**
4. Import repository `katalog-undangan`
5. Setup environment variables:
   - `DATABASE_URL` - dari Supabase (Settings → Database → Connection string → URI)
   - `NEXTAUTH_SECRET` - generate dengan `openssl rand -base64 32`
   - `NEXTAUTH_URL` - biarkan kosong dulu
6. Deploy!

---

## 📝 Catatan Penting:

- File archive sudah di-exclude folder yang tidak diperlukan (node_modules, .next, dll)
- Ukuran file: 3.0 MB
- Project sudah siap untuk production deployment

---

**Selamat! Project Katalog Undangan siap untuk di-deploy! 🎉**
