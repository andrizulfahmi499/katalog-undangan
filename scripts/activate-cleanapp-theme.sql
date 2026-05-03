-- Script untuk mengaktifkan CleanApp Theme
-- Jalankan script ini di database PostgreSQL Anda

-- 1. Cek member yang ada
SELECT id, name, email, "customSlug", "landingPageTheme", "landingPageEnabled"
FROM "Member"
ORDER BY "createdAt" DESC
LIMIT 5;

-- 2. Aktifkan CleanApp theme untuk member pertama (ganti dengan ID/slug yang sesuai)
-- Uncomment dan edit query di bawah ini:

-- UPDATE "Member" 
-- SET 
--   "landingPageTheme" = 'cleanapp',
--   "landingPageEnabled" = true,
--   "customSlug" = 'demo-cleanapp'  -- Ganti dengan slug yang Anda inginkan
-- WHERE email = 'your-member-email@example.com';  -- Ganti dengan email member

-- 3. Atau aktifkan untuk member dengan slug tertentu:
-- UPDATE "Member" 
-- SET "landingPageTheme" = 'cleanapp'
-- WHERE "customSlug" = 'your-existing-slug';

-- 4. Verifikasi perubahan
-- SELECT id, name, "customSlug", "landingPageTheme", "landingPageEnabled"
-- FROM "Member"
-- WHERE "landingPageTheme" = 'cleanapp';

-- 5. (Optional) Set custom configuration
-- UPDATE "Member" 
-- SET "landingPageConfig" = '{
--   "hero": {
--     "title": "Undangan Digital Terbaik",
--     "subtitle": "Buat undangan pernikahan dan ulang tahun yang memorable",
--     "ctaText": "Mulai Sekarang",
--     "image": "/images/hero-cleanapp.jpg"
--   },
--   "colors": {
--     "primary": "#EC4899",
--     "secondary": "#8B5CF6",
--     "accent": "#F59E0B",
--     "background": "#FFFFFF",
--     "backgroundSecondary": "#F9FAFB",
--     "textPrimary": "#111827",
--     "textSecondary": "#6B7280"
--   }
-- }'::jsonb
-- WHERE "customSlug" = 'demo-cleanapp';
