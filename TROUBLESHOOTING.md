# 🐛 TROUBLESHOOTING GUIDE - Katalog Undangan

Panduan untuk mengatasi masalah umum saat deployment dan usage.

---

## 📋 DAFTAR ISI

1. [Deployment Issues](#deployment-issues)
2. [Database Issues](#database-issues)
3. [Authentication Issues](#authentication-issues)
4. [Application Issues](#application-issues)
5. [Build Issues](#build-issues)

---

## 🔧 DEPLOYMENT ISSUES

### Issue: "Import failed - No such repository"

**Symptoms:**
- Vercel tidak bisa import repository GitHub
- Error: "No such repository" atau "Repository not found"

**Causes:**
- Repository belum dibuat di GitHub
- GitHub belum di-connect ke Vercel
- Repository name salah

**Solutions:**

1. **Verify Repository Exists**
   - Buka: https://github.com/andrizulfahmi499/katalog-undangan
   - Pastikan repository ada dan bisa diakses

2. **Connect GitHub ke Vercel**
   - Di Vercel, klik **Settings** → **Git** → **Connect to GitHub**
   - Authorize Vercel akses ke GitHub
   - Pilih organization atau personal account

3. **Check Repository Name**
   - Pastikan nama repository: `katalog-undangan`
   - Case-sensitive!

4. **Make Repository Public (Optional)**
   - Di GitHub, klik **Settings** → Scroll ke bawah
   - Change visibility: **Public**
   - Kadang membantu untuk deployment pertama

---

### Issue: "Build failed - Module not found"

**Symptoms:**
- Build failed di Vercel
- Error: "Module not found: Can't resolve 'xxx'"
- Error: "Cannot find module 'xxx'"

**Causes:**
- Missing dependency di `package.json`
- Dependency tidak terinstall saat build
- Path import salah

**Solutions:**

1. **Check package.json**
   - Pastikan semua dependencies terdaftar
   - Run: `bun install` di local
   - Commit `package-lock.json` atau `bun.lockb`

2. **Re-deploy**
   - Di Vercel, klik **Redeploy**
   - Pilih **Clear cache and re-deploy**
   - Tunggu build selesai

3. **Check Import Paths**
   - Cek error logs untuk nama module yang missing
   - Verify import statements di code
   - Pastikan path import benar (relative path)

4. **Add Missing Dependency**
   ```bash
   bun install nama-package
   git add package.json
   git commit -m "Add missing dependency"
   git push
   ```

---

### Issue: "Environment variables not set"

**Symptoms:**
- Build success tapi runtime error
- Error: "DATABASE_URL is not defined"
- Error: "NEXTAUTH_SECRET is not defined"

**Causes:**
- Environment variables belum di-set di Vercel
- Variable name salah
- Environment belum dipilih (Production/Preview/Development)

**Solutions:**

1. **Add Environment Variables in Vercel**
   - Klik project di Vercel
   - Klik **Settings** → **Environment Variables**
   - Add variabel yang hilang
   - Pilih semua environments (Production, Preview, Development)
   - Save dan re-deploy

2. **Verify Variable Names**
   - Pastikan case-sensitive:
     - ✅ `DATABASE_URL`
     - ❌ `database_url`
     - ❌ `Database_Url`

3. **Check Environment Variable Values**
   - Pastikan value benar:
     - `DATABASE_URL`: Supabase connection string
     - `NEXTAUTH_SECRET`: Random string
     - `NEXTAUTH_URL`: Production URL

---

## 🗄️ DATABASE ISSUES

### Issue: Postgres `42P05` — `prepared statement "s1" already exists` (Prisma + PgBouncer)

**Symptoms:**
- Error saat login atau API yang memakai Prisma
- Pesan mengandung `ConnectorError`, `QueryError`, kode `42P05`, atau `prepared statement` / `already exists`
- Sering terjadi di **Vercel/serverless** dengan **Supabase connection pooler** (port **6543**)

**Penyebab:**
- Prisma memakai *prepared statements*; **PgBouncer** (mode transaksi) tidak kompatibel kecuali Prisma dikonfigurasi untuk itu.

**Solusi:**

1. **Pada `DATABASE_URL` yang lewat pooler**, tambahkan parameter **`pgbouncer=true`**:
   - Contoh: `...pooler.supabase.com:6543/postgres?pgbouncer=true`
   - Jika string sudah punya `?`, tambahkan: `&pgbouncer=true`
2. **Set `DIRECT_URL`** di `.env` / Vercel ke koneksi **direct** Postgres (biasanya port **5432**, host `db.<ref>.supabase.co`) — dipakai Prisma untuk migrate/db push. Lihat `prisma/schema.prisma` dan `.env.example`.
3. **Redeploy** setelah mengubah environment variables.

Tanpa pooler (koneksi langsung 5432 saja), error ini biasanya tidak muncul; Anda bisa set `DIRECT_URL` sama dengan `DATABASE_URL` untuk development lokal.

---

### Issue: "Connection refused" atau "Database connection failed"

**Symptoms:**
- Error: "Connection refused"
- Error: "Database connection failed"
- Error: "Unable to connect to database"

**Causes:**
- DATABASE_URL salah
- Database password salah
- Supabase project tidak aktif
- Network issue

**Solutions:**

1. **Verify DATABASE_URL**
   - Format: `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres`
   - Cek password database (tidak bisa dilihat lagi setelah setup!)
   - Cek project reference ID

2. **Check Supabase Project Status**
   - Buka Supabase dashboard
   - Cek status project (harus "Active")
   - Jika "Paused", resume project

3. **Test Connection Locally**
   ```bash
   # Set DATABASE_URL di .env
   echo "DATABASE_URL=postgresql://postgres:password@db.ref.supabase.co:5432/postgres" > .env

   # Test connection
   bun run db:push
   ```

4. **Reset Database Password (Last Resort)**
   - Di Supabase dashboard → Settings → Database
   - Scroll ke **Reset Database Password**
   - Generate new password
   - Update DATABASE_URL di Vercel
   - Re-deploy

---

### Issue: "Table not found" atau "Relation does not exist"

**Symptoms:**
- Error: "Table \"Admin\" does not exist"
- Error: "Relation \"Member\" does not exist"
- Error: "column does not exist"

**Causes:**
- SQL script belum dijalankan
- Script gagal dijalankan
- Schema mismatch

**Solutions:**

1. **Verify Tables Exist**
   - Di Supabase SQL Editor, jalankan:
     ```sql
     SELECT table_name
     FROM information_schema.tables
     WHERE table_schema = 'public'
     ORDER BY table_name;
     ```
   - Harusnya muncul 6 tabel

2. **Re-run SQL Script**
   - Buka file `supabase/init.sql`
   - Copy seluruh isi
   - Paste ke Supabase SQL Editor
   - Klik **Run**
   - Tunggu "Success"

3. **Check Schema Name**
   - Pastikan tables di schema `public`, bukan schema lain
   - Verify dengan query di atas

---

### Issue: "Prisma Client is not generated"

**Symptoms:**
- Error: "Prisma Client is not generated"
- Error: "Cannot read properties of undefined (reading 'xxx')"
- Prisma queries tidak berfungsi

**Causes:**
- Prisma Client belum di-generate
- `postinstall` script tidak berjalan
- Schema tidak valid

**Solutions:**

1. **Generate Prisma Client Manually**
   ```bash
   bun run db:generate
   ```

2. **Verify postinstall Script**
   - Cek `package.json`:
     ```json
     "scripts": {
       "postinstall": "prisma generate"
     }
     ```

3. **Check Prisma Schema**
   - Pastikan `prisma/schema.prisma` valid
   - Run: `bun run db:push` untuk validasi

4. **Re-deploy di Vercel**
   - Postinstall script akan auto-run saat build
   - Cek deployment logs untuk memastikan

---

## 🔐 AUTHENTICATION ISSUES

### Issue: "Login failed" atau "Invalid credentials"

**Symptoms:**
- Login admin gagal
- Error: "Email atau password salah"
- Error: "Invalid credentials"

**Causes:**
- Email atau password salah
- Default admin tidak dibuat
- Password hash tidak valid

**Solutions:**

1. **Verify Default Admin Exists**
   - Di Supabase SQL Editor, jalankan:
     ```sql
     SELECT * FROM "Admin";
     ```
   - Harusnya muncul 1 row dengan email `admin@undanganku.com`

2. **Check Password Hash**
   - Password default: `admin123`
   - Hash harus valid bcrypt

3. **Create Admin Manually (If Needed)**
   ```sql
   -- Generate bcrypt hash for "admin123"
   -- You can use: https://bcrypt-generator.com/

   INSERT INTO "Admin" (
       id,
       name,
       email,
       password,
       "createdAt",
       "updatedAt"
   ) VALUES (
       'admin-default-001',
       'Administrator',
       'admin@undanganku.com',
       '$2a$10$8K1p/a0dLrXrKTyJQYw.j.XXJqZ8Y5v5x5x5x5x5x5x5x5x5x5x', -- Replace with actual hash
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP
   );
   ```

4. **Reset Admin Password**
   ```sql
   UPDATE "Admin"
   SET password = '$2a$10$NEW_HASH_HERE'
   WHERE email = 'admin@undanganku.com';
   ```

---

### Issue: "NEXTAUTH_SECRET is missing"

**Symptoms:**
- Error: "NEXTAUTH_SECRET is missing"
- Error: "Invalid or missing secret"
- Login tidak berfungsi

**Causes:**
- NEXTAUTH_SECRET belum di-set
- NEXTAUTH_SECRET salah

**Solutions:**

1. **Generate NEXTAUTH_SECRET**
   ```bash
   openssl rand -base64 32
   ```

2. **Add to Vercel Environment Variables**
   - Klik **Settings** → **Environment Variables**
   - Add:
     - Name: `NEXTAUTH_SECRET`
     - Value: [paste hasil generate]
     - Environments: ✅ Production, ✅ Preview, ✅ Development

3. **Re-deploy**
   - Save environment variables
   - Vercel akan auto-redeploy

---

### Issue: "Member tidak bisa login setelah dibuat"

**Symptoms:**
- Member berhasil dibuat di admin dashboard
- Member tidak bisa login
- Error: "Email atau password salah"

**Causes:**
- Password tidak di-hash dengan benar
- Member status bukan "active"
- Email salah ketik

**Solutions:**

1. **Verify Member Status**
   - Di Supabase SQL Editor:
     ```sql
     SELECT * FROM "Member" WHERE email = 'email-member@contoh.com';
     ```
   - Cek kolom `status`: harus "active"

2. **Check Password Hash**
   - Password harus di-hash dengan bcrypt
   - Verify di code: `bcryptjs.hash(password, 10)`

3. **Test dengan Password Baru**
   - Update password di database:
     ```sql
     UPDATE "Member"
     SET password = '$2a$10$NEW_HASH_HERE'
     WHERE email = 'email-member@contoh.com';
     ```

---

## 🚀 APPLICATION ISSUES

### Issue: "Page 404 Not Found"

**Symptoms:**
- Halaman tertentu muncul 404
- Error: "This page could not be found"

**Causes:**
- Routing tidak benar
- File tidak ada di `src/app/`
- Case-sensitive path

**Solutions:**

1. **Check Routing Structure**
   - Next.js App Router: `src/app/[route]/page.tsx`
   - Pastikan file `page.tsx` ada di setiap folder route

2. **Verify File Paths**
   ```
   src/
   ├── app/
   │   ├── page.tsx          → / (root)
   │   ├── login/
   │   │   └── page.tsx      → /login
   │   ├── admin/
   │   │   └── dashboard/
   │   │       └── page.tsx  → /admin/dashboard
   │   └── member/
   │       └── dashboard/
   │           └── page.tsx  → /member/dashboard
   ```

3. **Check Case Sensitivity**
   - Linux/production adalah case-sensitive
   - Pastikan folder dan file names case-sensitive benar

---

### Issue: "API route 500 Internal Server Error"

**Symptoms:**
- API call gagal dengan error 500
- Error: "Internal Server Error"

**Causes:**
- Error di API route code
- Database query error
- Environment variable missing

**Solutions:**

1. **Check Vercel Deployment Logs**
   - Di Vercel dashboard → **Functions** tab
   - Cek logs untuk error details
   - Cari stack trace

2. **Check API Route Code**
   - Pastikan try-catch blocks
   - Validasi input
   - Error handling yang baik

3. **Test API Locally**
   ```bash
   bun run dev
   # Buka http://localhost:3000/api/test
   # Cek response dan logs
   ```

4. **Verify Database Connection**
   - Cek DATABASE_URL
   - Test database query di Supabase SQL Editor

---

### Issue: "WhatsApp redirect tidak berfungsi"

**Symptoms:**
- Tombol "Kirim ke WhatsApp" tidak berfungsi
- WhatsApp tidak terbuka
- Pesan tidak ter-generate dengan benar

**Causes:**
- Nomor WhatsApp tidak valid
- Message tidak ter-encode dengan benar
- Browser block popup

**Solutions:**

1. **Check Phone Number Format**
   - Pastikan nomor di format: `62xxx` (bukan `08xxx`)
   - Cek di code: `handleSendWhatsApp` function

2. **Verify Message Encoding**
   - Pastikan `encodeURIComponent(message)`
   - Cek placeholder replacement

3. **Check Popup Blocker**
   - Disable popup blocker untuk website
   - Coba open di tab baru

4. **Test WhatsApp API URL**
   - Buka manual di browser:
     ```
     https://wa.me/6281234567890?text=Hello
     ```
   - Harusnya terbuka ke WhatsApp Web

---

## 🏗️ BUILD ISSUES

### Issue: "TypeScript Error"

**Symptoms:**
- Build failed dengan TypeScript error
- Error: "Type 'xxx' is not assignable to type 'yyy'"

**Causes:**
- Type mismatch
- Missing type definition
- Strict mode issue

**Solutions:**

1. **Check TypeScript Errors Locally**
   ```bash
   bun run lint
   ```

2. **Fix Type Errors**
   - Add proper type annotations
   - Fix type mismatches
   - Add missing type definitions

3. **Update tsconfig.json (if needed)**
   ```json
   {
     "compilerOptions": {
       "strict": false,  // Temporary disable for debugging
       "skipLibCheck": true
     }
   }
   ```

---

### Issue: "Out of memory" saat build

**Symptoms:**
- Build failed di Vercel
- Error: "JavaScript heap out of memory"
- Error: "Allocation failed"

**Causes:**
- Project terlalu besar
- Memory limit tercapai

**Solutions:**

1. **Increase Node Memory**
   - Di Vercel, tambahkan environment variable:
     ```
     NODE_OPTIONS=--max-old-space-size=4096
     ```

2. **Optimize Build**
   - Cek `next.config.js`
   - Disable unnecessary features
   - Use dynamic imports

3. **Split Code**
   - Code splitting
   - Lazy loading
   - Reduce bundle size

---

## 📞 GETTING HELP

Jika masalah tidak terselesaikan:

1. **Check Logs**
   - Vercel deployment logs
   - Supabase database logs
   - Browser console logs (F12)

2. **Documentation**
   - Vercel Docs: https://vercel.com/docs
   - Supabase Docs: https://supabase.com/docs
   - Next.js Docs: https://nextjs.org/docs
   - Prisma Docs: https://www.prisma.io/docs

3. **Community Support**
   - GitHub Issues
   - Stack Overflow
   - Discord communities

---

## 📝 REPORTING ISSUES

Jika menemukan bug atau issue baru:

1. **Reproduce the issue**
   - Langkah-langkah detail
   - Expected behavior
   - Actual behavior

2. **Gather information**
   - Error messages
   - Screenshots
   - Logs
   - Environment details

3. **Create issue report**
   - Title yang jelas
   - Description detail
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment info

---

Last Updated: 2025
Project: Katalog Undangan
