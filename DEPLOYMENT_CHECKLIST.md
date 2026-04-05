# ✅ DEPLOYMENT CHECKLIST - Katalog Undangan

Gunakan checklist ini untuk memastikan deployment berjalan dengan lancar.

---

## 📋 PRE-DEPLOYMENT CHECKLIST

Sebelum memulai deployment, pastikan:

### GitHub Setup
- [ ] Akun GitHub sudah dibuat
- [ ] Repository `katalog-undangan` sudah dibuat
- [ ] Git sudah terinstall di komputer
- [ ] Semua file project sudah di-commit:
  ```bash
  git add .
  git commit -m "Initial commit"
  ```

### Supabase Setup
- [ ] Akun Supabase sudah dibuat
- [ ] Supabase project `katalog-undangan` sudah dibuat
- [ ] Database password sudah **disimpan** di tempat aman
- [ ] SQL script sudah dijalankan di Supabase SQL Editor
- [ ] 6 tabel sudah terbentuk:
  - [ ] Admin
  - [ ] Member
  - [ ] Invitations
  - [ ] InvitationMessages
  - [ ] InvitationSends
  - [ ] CreditTransaction
- [ ] Database connection string sudah dicopy
- [ ] Default admin account sudah terbentuk:
  - Email: `admin@undanganku.com`
  - Password: `admin123`

### Code Preparation
- [ ] `prisma/schema.prisma` sudah update ke `postgresql`
- [ ] `package.json` sudah update dengan:
  - [ ] `postinstall: "prisma generate"`
  - [ ] `db:migrate:deploy: "prisma migrate deploy"`
- [ ] `.env.example` sudah dibuat
- [ ] `.gitignore` sudah update dengan `.env*`
- [ ] Semua file sudah push ke GitHub:
  ```bash
  git push -u origin main
  ```

### Vercel Setup
- [ ] Akun Vercel sudah dibuat
- [ ] Vercel sudah connect ke GitHub

---

## 🚀 DEPLOYMENT CHECKLIST

Saat melakukan deployment di Vercel:

### Import Project
- [ ] Login ke Vercel
- [ ] Klik **Add New** → **Project**
- [ ] Import repository `katalog-undangan` dari GitHub

### Configuration
- [ ] Framework Preset: `Next.js` (auto-detect)
- [ ] Root Directory: `./`
- [ ] Build Command: `bun run build` (auto-detect)
- [ ] Output Directory: `.next` (auto-detect)
- [ ] Install Command: `bun install` (auto-detect)

### Environment Variables (CRITICAL!)
- [ ] **DATABASE_URL** sudah ditambahkan:
  - [ ] Value: Supabase connection string
  - [ ] Jika pakai **pooler** (port **6543**): pastikan ada **`?pgbouncer=true`** (atau `&pgbouncer=true`) agar tidak error `42P05` / prepared statement
  - [ ] Environments: ✅ Production, ✅ Preview, ✅ Development
- [ ] **DIRECT_URL** sudah ditambahkan:
  - [ ] Value: koneksi **Direct** Supabase (port **5432**, host `db.<ref>.supabase.co`) — untuk Prisma migrate/db push
  - [ ] Jika tidak pakai pooler: isi **sama** dengan `DATABASE_URL`
  - [ ] Environments: ✅ Production, ✅ Preview, ✅ Development
- [ ] **NEXTAUTH_SECRET** sudah ditambahkan:
  - [ ] Value: Generated dengan `openssl rand -base64 32`
  - [ ] Environments: ✅ Production, ✅ Preview, ✅ Development
- [ ] **NEXTAUTH_URL** sudah ditambahkan:
  - [ ] Value: `https://katalog-undangan.vercel.app` (atau biarkan kosong untuk auto-fill)
  - [ ] Environments: ✅ Production, ✅ Preview, ✅ Development

### Deployment Process
- [ ] Klik **Deploy**
- [ ] Tunggu proses install dependencies
- [ ] Tunggu proses build
- [ ] Tunggu proses upload
- [ ] Status: **Deployed** (hijau)
- [ ] URL production sudah didapat

---

## ✅ POST-DEPLOYMENT CHECKLIST

Setelah deployment selesai, lakukan testing:

### Basic Testing
- [ ] Buka URL: `https://katalog-undangan.vercel.app`
- [ ] Landing page muncul tanpa error
- [ ] Navigasi menu berfungsi
- [ ] Tidak ada error di browser console (F12)
- [ ] Responsive design berfungsi di mobile

### Login Testing
- [ ] Buka: `/login`
- [ ] Pilih **Admin** berfungsi
- [ ] Login admin berhasil:
  - Email: `admin@undanganku.com`
  - Password: `admin123`
- [ ] Redirect ke `/admin/dashboard`
- [ ] Logout admin berhasil
- [ ] Pilih **Member** berfungsi
- [ ] Login member berhasil (jika sudah ada member)
- [ ] Redirect ke `/member/dashboard`

### Admin Dashboard Testing
- [ ] Stats cards muncul dengan data yang benar
- [ ] Tab **Members** berfungsi:
  - [ ] Daftar member muncul
  - [ ] **Tambah Member** modal muncul
  - [ ] Create member berhasil
  - [ ] Delete member berhasil
- [ ] Tab **Invitations** berfungsi:
  - [ ] Daftar undangan muncul
  - [ ] **Tambah Undangan** modal muncul
  - [ ] Create invitation berhasil
  - [ ] Assign ke member berhasil

### Member Dashboard Testing
- [ ] Stats cards muncul dengan data yang benar
- [ ] Tab **Undangan** berfungsi:
  - [ ] Daftar undangan yang di-assign muncul
  - [ ] Detail undangan muncul
  - [ ] **Kirim Undangan** modal muncul
- [ ] **Tambah Tamu** berfungsi:
  - [ ] Nama tamu bisa diinput
  - [ ] WhatsApp bisa diinput
  - [ ] Link otomatis ter-generate
  - [ ] Tombol **Salin** berfungsi
  - [ ] Tombol **Kirim ke WhatsApp** berfungsi
  - [ ] WhatsApp terbuka dengan pesan yang benar
- [ ] Tab **Riwayat Pengiriman** berfungsi:
  - [ ] Riwayat muncul
  - [ ] Status pengiriman ditampilkan

### Database Testing
- [ ] Member yang dibuat tersimpan di database
- [ ] Credit points berkurang setelah create invitation
- [ ] Credit transaction history tersimpan
- [ ] Invitation data tersimpan dengan benar

### Environment Variables Verification
- [ ] Database connection berhasil
- [ ] NEXTAUTH_SECRET berfungsi
- [ ] NEXTAUTH_URL benar

---

## 🔧 MAINTENANCE CHECKLIST

Setelah deployment selesai:

### Security
- [ ] Ganti default admin password
- [ ] Ganti NEXTAUTH_SECRET jika perlu
- [ ] Enable 2FA di GitHub
- [ ] Enable 2FA di Supabase
- [ ] Enable 2FA di Vercel

### Monitoring
- [ ] Setup Vercel Analytics (opsional)
- [ ] Setup error tracking (opsional)
- [ ] Check Vercel deployment logs regularly
- [ ] Check Supabase logs regularly

### Backup
- [ ] Database backup auto-enabled (Supabase free tier)
- [ ] Repository backup di GitHub
- [ ] Environment variables documented

### Documentation
- [ ] Update README dengan deployment info
- [ ] Document API endpoints
- [ ] Document database schema
- [ ] Document environment variables

---

## 🐛 TROUBLESHOOTING CHECKLIST

Jika ada masalah:

### Build Failed
- [ ] Cek deployment logs di Vercel
- [ ] Cek package.json untuk missing dependencies
- [ ] Run `bun run lint` di local
- [ ] Re-deploy di Vercel

### Database Error
- [ ] Cek DATABASE_URL di Vercel
- [ ] Verify Supabase project status
- [ ] Re-run SQL script if needed
- [ ] Check database connection

### Login Failed
- [ ] Check NEXTAUTH_SECRET
- [ ] Check NEXTAUTH_URL
- [ ] Verify admin account exists
- [ ] Check bcrypt password hash

### Pages Not Found
- [ ] Check routing structure
- [ ] Verify files exist in `src/app/`
- [ ] Check for TypeScript errors
- [ ] Re-deploy

---

## 📝 NOTES

### Important Passwords & Secrets
- **Supabase Database Password**: [FILL IN]
- **NEXTAUTH_SECRET**: [FILL IN]
- **Admin Default Password**: `admin123` (change immediately!)

### Important URLs
- **GitHub Repository**: https://github.com/andrizulfahmi499/katalog-undangan
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Production URL**: https://katalog-undangan.vercel.app

### Quick Commands
```bash
# Local development
bun run dev

# Build for production
bun run build

# Generate Prisma client
bun run db:generate

# Push database schema (local)
bun run db:push

# Deploy to Vercel (via CLI)
vercel --prod

# Check deployment status
vercel ls
```

---

## ✨ FINAL VERIFICATION

Sebelum menganggap deployment selesai:

- [ ] Semua checklist di atas terpenuhi
- [ ] Semua fitur utama berfungsi
- [ ] Tidak ada error di production
- [ ] Monitoring sudah setup
- [ ] Backup sudah terkonfirmasi
- [ ] Dokumentasi sudah lengkap

---

**🎉 DEPLOYMENT SELESAI DAN SIAP DIGUNAKAN!**

---

Last Updated: 2025
Project: Katalog Undangan
Repository: https://github.com/andrizulfahmi499/katalog-undangan
