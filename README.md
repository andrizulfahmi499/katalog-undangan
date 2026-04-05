# 🎉 Katalog Undangan

Platform undangan digital dengan fitur member dan admin dashboard.

---

## 📋 Overview

**Katalog Undangan** adalah platform undangan digital lengkap yang memungkinkan admin untuk mengelola member dan undangan, serta member untuk mengirim undangan personalisasi ke tamu melalui WhatsApp.

### ✨ Fitur Utama

- **Admin Dashboard**
  - Kelola member
  - Buat dan kelola undangan
  - Assign undangan ke member
  - Lihat statistik dan transaksi credit points

- **Member Dashboard**
  - Lihat undangan yang di-assign
  - Generate link undangan dengan nama tamu otomatis
  - Kirim undangan langsung ke WhatsApp
  - Edit template pesan
  - Lihat riwayat pengiriman

- **Multi-Domain Support**
  - `satumomen.com` - menggunakan `?guest=` parameter
  - `id.akainvitation.com` - menggunakan `?to=` parameter

- **Credit Point System**
  - 20 coin per undangan
  - Tracking transaksi credit
  - Member dapat melihat sisa credit

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Bun atau npm/yarn
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/andrizulfahmi499/katalog-undangan.git
cd katalog-undangan

# Install dependencies
bun install

# Setup environment variables
cp .env.example .env
# Edit .env with your values

# Push database schema
bun run db:push

# Generate Prisma Client
bun run db:generate

# Run development server
bun run dev
```

### Default Admin Account

- **Email**: `admin@undanganku.com`
- **Password**: `admin123`

⚠️ **Ganti password default setelah login pertama!**

---

## 📚 Documentation

- [QUICK_START.md](./QUICK_START.md) - Panduan cepat deployment (15-20 menit)
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Panduan deployment lengkap
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Checklist deployment
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Solusi error umum

---

## 🛠️ Tech Stack

### Core Framework
- **Next.js 16** - React framework with App Router
- **TypeScript 5** - Type-safe JavaScript
- **React 19** - UI library

### Styling
- **Tailwind CSS 4** - Utility-first CSS
- **shadcn/ui** - Beautiful component library
- **Framer Motion** - Animations

### Database
- **Prisma ORM** - Database toolkit
- **Supabase (PostgreSQL)** - Cloud database

### Authentication
- **NextAuth.js v4** - Authentication solution
- **bcryptjs** - Password hashing

### State Management
- **Zustand** - Client state management
- **React Hooks** - Built-in state

### Icons
- **Lucide React** - Icon library

---

## 📂 Project Structure

```
katalog-undangan/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── login/             # Login page
│   │   ├── admin/             # Admin dashboard
│   │   │   └── dashboard/     # Admin dashboard page
│   │   ├── member/            # Member dashboard
│   │   │   └── dashboard/     # Member dashboard page
│   │   └── api/               # API routes
│   │       ├── auth/          # Authentication APIs
│   │       ├── admin/         # Admin APIs
│   │       └── member/        # Member APIs
│   ├── components/            # React components
│   │   ├── landing/           # Landing page components
│   │   └── ui/                # shadcn/ui components
│   ├── lib/                   # Utility libraries
│   │   └── db.ts              # Prisma client
│   └── hooks/                 # Custom React hooks
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── supabase/
│   └── init.sql               # Supabase initialization script
├── public/                    # Static assets
├── .env.example               # Environment variables template
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── next.config.ts             # Next.js configuration
└── tailwind.config.ts         # Tailwind CSS configuration
```

---

## 🔧 Available Scripts

```bash
# Development
bun run dev                    # Start development server

# Build
bun run build                  # Build for production

# Production
bun run start                  # Start production server

# Database
bun run db:push                # Push schema to database
bun run db:generate            # Generate Prisma Client
bun run db:migrate             # Create migration
bun run db:reset              # Reset database

# Linting
bun run lint                   # Run ESLint
```

---

## 🔐 Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
# Database (Supabase)
# Pooler (port 6543): tambahkan ?pgbouncer=true agar Prisma tidak bentrok dengan PgBouncer.
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"
# Koneksi direct (port 5432) untuk migrate — jika tidak pakai pooler, isi sama seperti DATABASE_URL
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="your-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Application
NODE_ENV="development"
APP_URL="http://localhost:3000"
```

**Get DATABASE_URL from:**
- Supabase Dashboard → Settings → Database → Connection string → URI

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## 🗄️ Database Schema

### Tables

1. **Admin** - Admin users
2. **Member** - Members who send invitations
3. **Invitations** - Invitations created by admin
4. **InvitationMessages** - Custom message templates
5. **InvitationSends** - Log of sent invitations
6. **CreditTransaction** - Credit point transactions

### Initialize Database

For local development with SQLite:
```bash
bun run db:push
```

For production with Supabase:
1. Create Supabase project
2. Run `supabase/init.sql` in Supabase SQL Editor
3. Set `DATABASE_URL` in environment variables

---

## 🌐 Deployment

### Quick Deploy (15-20 min)

1. **Setup Supabase** (5-10 min)
   - Create Supabase project
   - Run `supabase/init.sql`
   - Copy database connection string

2. **Push to GitHub** (3-5 min)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/andrizulfahmi499/katalog-undangan.git
   git push -u origin main
   ```

3. **Deploy to Vercel** (5-8 min)
   - Import repository to Vercel
   - Set environment variables
   - Deploy!

**Detailed guide:** See [QUICK_START.md](./QUICK_START.md)

---

## 📱 Screenshots

### Landing Page
- Modern claymorphism design
- Responsive layout
- Smooth animations

### Admin Dashboard
- Member management
- Invitation creation
- Statistics overview
- Credit point tracking

### Member Dashboard
- View assigned invitations
- Auto-generate guest links
- Send via WhatsApp
- Message customization
- Send history

---

## 🧪 Testing

### Test Login Admin
1. Open `/login`
2. Select **Admin**
3. Login with:
   - Email: `admin@undanganku.com`
   - Password: `admin123`

### Test Create Member
1. In Admin Dashboard → Members tab
2. Click **Tambah Member**
3. Fill form and save

### Test Send Invitation
1. Login as Member
2. Select invitation
3. Click **Kirim Undangan**
4. Add guest with WhatsApp
5. Click **Kirim ke WhatsApp**

---

## 🐛 Troubleshooting

For common issues and solutions, see:
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

Common issues:
- Database connection failed → Check `DATABASE_URL`
- Build failed → Check dependencies
- Login failed → Check admin account in database

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add some AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📝 License

This project is private. All rights reserved.

---

## 👥 Author

**Andri Zulfahmi**
- GitHub: [@andrizulfahmi499](https://github.com/andrizulfahmi499)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Prisma](https://www.prisma.io/)

---

## 📞 Support

For issues and questions:
- GitHub Issues: [Repository Issues](https://github.com/andrizulfahmi499/katalog-undangan/issues)
- Documentation: [QUICK_START.md](./QUICK_START.md), [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Built with ❤️ using Next.js, TypeScript, and Supabase**
